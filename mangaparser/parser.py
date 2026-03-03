# parser.py
import os
import re
import json
import shutil
from bs4 import BeautifulSoup
from urllib.parse import unquote
from tqdm import tqdm
from config import *
from converters.avif_converter import convert_avif_to_jpg, convert_all_avif_in_folder

class MandarakeParser:
    def __init__(self):
        self.products = []
        self.image_counter = 1
        self.images_dir = os.path.join(OUTPUT_DIR, "images")
        
        # Создаём выходные папки
        os.makedirs(self.images_dir, exist_ok=True)
        
    def parse_price(self, price_text):
        """
        Парсит цену из текста вида "2,000 yen"
        Возвращает цену в йенах (int)
        """
        if not price_text:
            return None
        
        # Ищем число с запятыми
        match = re.search(r'([\d,]+)', price_text)
        if match:
            price_str = match.group(1).replace(',', '')
            return int(price_str)
        return None
    
    def calculate_rub_price(self, yen_price):
        """
        Рассчитывает цену в рублях по формуле:
        (yen * 0.5) * 2 + 1500
        """
        if not yen_price:
            return None
        
        # Проверяем минимальную цену
        if yen_price < MIN_PRICE_YEN:
            return None
        
        # (йены * 0.5) * 2 + 1500
        rub_price = (yen_price * YEN_TO_RUB_RATE) * (1 + MARKUP_PERCENT / 100) + SHIPPING_COST
        return int(round(rub_price, -1))  # Округляем до десятков
    
    def find_image_file(self, folder_path, img_src):
        """
        Ищет файл изображения в папке *_files
        """
        # Извлекаем имя файла из src
        img_filename = os.path.basename(unquote(img_src))
        
        # Папка с файлами (обычно называется как HTML файл + _files)
        html_name = os.path.basename(folder_path).replace('.htm', '').replace('.html', '')
        files_folder = os.path.join(os.path.dirname(folder_path), f"{html_name}_files")
        
        if not os.path.exists(files_folder):
            # Пробуем другие варианты названий
            parent_folder = os.path.dirname(folder_path)
            possible_folders = [f for f in os.listdir(parent_folder) 
                              if f.endswith('_files') and os.path.isdir(os.path.join(parent_folder, f))]
            if possible_folders:
                files_folder = os.path.join(parent_folder, possible_folders[0])
            else:
                return None
        
        # Ищем файл
        img_path = os.path.join(files_folder, img_filename)
        if os.path.exists(img_path):
            return img_path
        
        # Пробуем найти похожий файл (иногда имена могут отличаться)
        for file in os.listdir(files_folder):
            if img_filename.lower() in file.lower() or file.lower() in img_filename.lower():
                return os.path.join(files_folder, file)
        
        return None
    
    def extract_product_info(self, html_file_path):
        """
        Извлекает информацию о товаре из HTML файла
        """
        with open(html_file_path, 'r', encoding='utf-8') as f:
            soup = BeautifulSoup(f.read(), 'lxml')
        
        products = []
        
        # Ищем все блоки товаров
        for block in soup.find_all('div', class_='block'):
            try:
                # Название товара
                title_elem = block.find('div', class_='title')
                if not title_elem:
                    continue
                
                title = title_elem.get_text(strip=True)
                
                # Цена
                price_elem = block.find('div', class_='price')
                if not price_elem:
                    continue
                
                price_text = price_elem.get_text(strip=True)
                yen_price = self.parse_price(price_text)
                
                # Пропускаем товары дешевле порога
                if not yen_price or yen_price < MIN_PRICE_YEN:
                    continue
                
                # Изображение - ищем локальный файл
                img_elem = block.find('img')
                img_local_path = None
                
                if img_elem and img_elem.get('src'):
                    img_src = img_elem['src']
                    img_local_path = self.find_image_file(html_file_path, img_src)
                
                # Артикул (itemno)
                itemno_elem = block.find('p', class_='itemno')
                sku = itemno_elem.get_text(strip=True) if itemno_elem else f"SKU-{self.image_counter}"
                
                # Категория
                category = self.detect_category(title)
                
                # Рассчитываем цену в рублях
                rub_price = self.calculate_rub_price(yen_price)
                
                if rub_price:
                    product = {
                        'id': self.image_counter,
                        'name': title,
                        'description': title,  # Можно сделать описание подробнее
                        'price': rub_price,
                        'original_price_yen': yen_price,
                        'category': category,
                        'imageUrl': f'/images/{self.image_counter:05d}.jpg',
                        'sku': sku,
                        'stock': 1,
                        'inStock': True
                    }
                    
                    products.append({
                        'product': product,
                        'local_image_path': img_local_path,
                        'target_image_name': f"{self.image_counter:05d}.avif"
                    })
                    
                    self.image_counter += 1
                    
            except Exception as e:
                print(f"Ошибка парсинга блока: {e}")
                continue
        
        return products
    
    def detect_category(self, title):
        """
        Определяет категорию товара по названию
        """
        title_lower = title.lower()
        
        if any(word in title_lower for word in ['manga', 'comic', 'comics', 'shonen', 'jump']):
            return 'Манга'
        elif 'figure' in title_lower:
            return 'Фигурки'
        elif any(word in title_lower for word in ['dvd', 'blu-ray', 'bluray']):
            return 'DVD/Blu-ray'
        elif any(word in title_lower for word in ['game', 'playstation', 'nintendo']):
            return 'Игры'
        elif 'book' in title_lower or 'art book' in title_lower:
            return 'Книги/Артбуки'
        else:
            return 'Другое'
    
    def copy_image(self, source_path, target_path):
        """
        Копирует файл изображения
        """
        try:
            if source_path and os.path.exists(source_path):
                shutil.copy2(source_path, target_path)
                return True
        except Exception as e:
            print(f"Ошибка копирования {source_path}: {e}")
        return False
    
    def process_html_files(self):
        """
        Обрабатывает все HTML файлы в пронумерованных папках
        """
        print("🔍 Поиск HTML файлов...")
        
        # Проходим по всем папкам 1, 2, 3...
        for folder_num in range(1, 1000):  # Проверяем папки 1-999
            folder_path = os.path.join(INPUT_DIR, str(folder_num))
            if not os.path.exists(folder_path):
                continue
            
            print(f"📁 Обработка папки {folder_num}...")
            
            # Ищем HTML файлы в папке
            html_files = [f for f in os.listdir(folder_path) 
                         if f.lower().endswith('.htm') or f.lower().endswith('.html')]
            
            for html_file in html_files:
                html_path = os.path.join(folder_path, html_file)
                products_data = self.extract_product_info(html_path)
                
                for item in products_data:
                    # Копируем изображение
                    if item['local_image_path']:
                        target_filename = f"{item['product']['id']:05d}.avif"
                        target_path = os.path.join(self.images_dir, target_filename)
                        
                        if self.copy_image(item['local_image_path'], target_path):
                            self.products.append(item['product'])
                            print(f"  ✅ Товар: {item['product']['name'][:50]}...")
                        else:
                            print(f"  ⚠️  Не удалось скопировать изображение для товара {item['product']['id']}")
                    else:
                        print(f"  ⚠️  Изображение не найдено для товара {item['product']['id']}")
        
        print(f"\n📊 Найдено товаров: {len(self.products)}")
    
    def convert_images(self):
        """
        Конвертирует AVIF изображения в JPG
        """
        if not CONVERT_AVIF:
            return
        
        print("\n🔄 Конвертация AVIF в JPG...")
        
        # Получаем список всех AVIF файлов
        avif_files = [f for f in os.listdir(self.images_dir) if f.lower().endswith('.avif')]
        
        for avif_file in tqdm(avif_files, desc="Конвертация"):
            avif_path = os.path.join(self.images_dir, avif_file)
            jpg_filename = avif_file[:-5] + '.jpg'
            jpg_path = os.path.join(self.images_dir, jpg_filename)
            
            if convert_avif_to_jpg(avif_path, jpg_path, MAX_IMAGE_SIZE):
                # Обновляем путь в товарах
                old_id = int(avif_file.split('.')[0])
                for product in self.products:
                    if product['id'] == old_id:
                        product['imageUrl'] = f'/images/{old_id:05d}.jpg'
                
                # Удаляем оригинал если нужно
                if DELETE_AVIF_AFTER_CONVERT:
                    os.remove(avif_path)
        
        print(f"✅ Конвертация завершена")
    
    def save_results(self):
        """
        Сохраняет результаты в JSON файл
        """
        json_path = os.path.join(OUTPUT_DIR, 'products.json')
        
        # Готовим данные для импорта в админку
        output_data = {
            'products': self.products,
            'total': len(self.products),
            'generated': '2026-02-25',
            'format': 'dropshop-import'
        }
        
        with open(json_path, 'w', encoding='utf-8') as f:
            json.dump(output_data, f, ensure_ascii=False, indent=2)
        
        print(f"\n💾 Результаты сохранены:")
        print(f"   - JSON: {json_path}")
        print(f"   - Изображения: {self.images_dir}")
        print(f"   - Всего товаров: {len(self.products)}")
        
        # Показываем пример первых 3 товаров
        print(f"\n📋 Пример первых товаров:")
        for i, product in enumerate(self.products[:3]):
            print(f"   {i+1}. {product['name'][:50]}... - {product['price']}₽")
    
    def run(self):
        """
        Запускает парсер
        """
        print("=" * 60)
        print("🚀 Mandarake Parser v1.1 (локальная версия)")
        print("=" * 60)
        
        # Проверяем входную папку
        if not os.path.exists(INPUT_DIR):
            print(f"❌ Папка не найдена: {INPUT_DIR}")
            print("Пожалуйста, укажите правильный путь в config.py")
            print(f"Текущий путь: {INPUT_DIR}")
            return
        
        print(f"📂 Входная папка: {INPUT_DIR}")
        print(f"📂 Выходная папка: {OUTPUT_DIR}")
        
        # Парсим HTML
        self.process_html_files()
        
        if not self.products:
            print("❌ Товары не найдены")
            return
        
        # Конвертируем изображения
        self.convert_images()
        
        # Сохраняем результаты
        self.save_results()
        
        print("\n✨ Готово! Теперь можно импортировать товары в админку")
        print("\n📌 Инструкция по импорту:")
        print("   1. Скопируйте папку 'images' в client/public/ вашего сайта")
        print("   2. В админ-панели добавьте кнопку импорта из JSON")
        print("   3. Загрузите файл products.json")

if __name__ == "__main__":
    parser = MandarakeParser()
    parser.run()