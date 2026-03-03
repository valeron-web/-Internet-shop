# converters/avif_converter.py
import os
from PIL import Image
import pillow_avif  # Регистрирует плагин AVIF для Pillow
from tqdm import tqdm

def convert_avif_to_jpg(avif_path, jpg_path, max_size=(800, 800)):
    """
    Конвертирует AVIF в JPG с изменением размера
    """
    try:
        # Открываем AVIF
        with Image.open(avif_path) as img:
            # Конвертируем в RGB (на случай если есть альфа-канал)
            if img.mode in ('RGBA', 'LA', 'P'):
                rgb_img = Image.new('RGB', img.size, (255, 255, 255))
                rgb_img.paste(img, mask=img.split()[-1] if img.mode == 'RGBA' else None)
                img = rgb_img
            elif img.mode != 'RGB':
                img = img.convert('RGB')
            
            # Изменяем размер с сохранением пропорций
            img.thumbnail(max_size, Image.Resampling.LANCZOS)
            
            # Сохраняем как JPG
            img.save(jpg_path, 'JPEG', quality=85, optimize=True)
            return True
    except Exception as e:
        print(f"Ошибка конвертации {avif_path}: {e}")
        return False

def convert_all_avif_in_folder(folder_path, max_size=(800, 800)):
    """
    Конвертирует все AVIF файлы в папке в JPG
    """
    converted_files = []
    
    # Находим все AVIF файлы
    avif_files = [f for f in os.listdir(folder_path) if f.lower().endswith('.avif')]
    
    for avif_file in tqdm(avif_files, desc="Конвертация AVIF"):
        avif_path = os.path.join(folder_path, avif_file)
        jpg_filename = avif_file[:-5] + '.jpg'  # Меняем .avif на .jpg
        jpg_path = os.path.join(folder_path, jpg_filename)
        
        if convert_avif_to_jpg(avif_path, jpg_path, max_size):
            converted_files.append({
                'original': avif_file,
                'converted': jpg_filename
            })
            # Удаляем оригинальный AVIF (опционально)
            # os.remove(avif_path)
    
    return converted_files