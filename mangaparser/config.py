# config.py
import os

# Настройки парсинга
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
INPUT_DIR = r"C:\Users\Король пешеры\Desktop\mangaparser\htm"  # Укажите путь к папке с пронумерованными папками
OUTPUT_DIR = os.path.join(BASE_DIR, "output")

# Настройки цен
YEN_TO_RUB_RATE = 0.5  # 100 йен = 50 рублей (делим пополам)
MARKUP_PERCENT = 100    # Наценка 100%
SHIPPING_COST = 1500    # Стоимость доставки в рублях
MIN_PRICE_YEN = 500     # Минимальная цена в йенах (пропускаем дешевле)

# Настройки изображений
CONVERT_AVIF = True     # Конвертировать AVIF в JPG
MAX_IMAGE_SIZE = (800, 800)  # Максимальный размер изображения

# Категории товаров (можно расширить)
CATEGORY_MAPPING = {
    'manga': 'Манга',
    'comic': 'Комиксы',
    'figure': 'Фигурки',
    'dvd': 'DVD',
    'game': 'Игры',
}
if 'DELETE_AVIF_AFTER_CONVERT' not in locals() and 'DELETE_AVIF_AFTER_CONVERT' not in globals():
    DELETE_AVIF_AFTER_CONVERT = False