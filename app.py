import sys
from PIL import Image
from pytesseract import pytesseract
import pyperclip

# Add debug logging
print(f"Script started with args: {sys.argv}", flush=True)

if len(sys.argv) < 2:
    print("Image path missing", flush=True)
    sys.exit(1)

try:
    pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"
    image_path = sys.argv[1]
    
    print(f"Processing image: {image_path}", flush=True)
    
    img = Image.open(image_path)
    text = pytesseract.image_to_string(img)
    pyperclip.copy(text.strip())
    # print(text.strip(), flush=True)
except Exception as e:
    print(f"Error: {str(e)}", flush=True)
    sys.exit(1)