#!/usr/bin/env python3
"""Generate placeholder icon files for the Expo project."""
from PIL import Image, ImageDraw, ImageFont
import os

def create_icon(size, filename):
    """Create a simple Z AI icon with a purple background and white Z."""
    img = Image.new('RGBA', (size, size), (79, 70, 229, 255))  # #4F46E5
    draw = ImageDraw.Draw(img)
    
    font_size = int(size * 0.55)
    try:
        font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", font_size)
    except:
        font = ImageFont.load_default()
    
    bbox = draw.textbbox((0, 0), "Z", font=font)
    tw = bbox[2] - bbox[0]
    th = bbox[3] - bbox[1]
    x = (size - tw) / 2
    y = (size - th) / 2 - size * 0.03
    draw.text((x, y), "Z", fill=(255, 255, 255, 255), font=font)
    img.save(filename)
    print(f"Created {filename} ({size}x{size})")

def create_adaptive_icon(size, filename):
    """Create adaptive icon with transparent background and the Z in a circle."""
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Draw circle
    padding = int(size * 0.1)
    draw.ellipse([padding, padding, size - padding, size - padding], fill=(79, 70, 229, 255))
    
    # Draw Z
    font_size = int(size * 0.45)
    try:
        font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", font_size)
    except:
        font = ImageFont.load_default()
    
    bbox = draw.textbbox((0, 0), "Z", font=font)
    tw = bbox[2] - bbox[0]
    th = bbox[3] - bbox[1]
    x = (size - tw) / 2
    y = (size - th) / 2 - size * 0.02
    draw.text((x, y), "Z", fill=(255, 255, 255, 255), font=font)
    img.save(filename)
    print(f"Created {filename} ({size}x{size})")

def create_splash(width, height, filename):
    """Create splash screen."""
    img = Image.new('RGBA', (width, height), (10, 10, 15, 255))  # #0A0A0F
    draw = ImageDraw.Draw(img)
    
    circle_size = min(width, height) // 4
    cx, cy = width // 2, height // 2 - height // 8
    draw.ellipse([cx - circle_size, cy - circle_size, cx + circle_size, cy + circle_size], fill=(79, 70, 229, 255))
    
    font_size = int(circle_size * 1.2)
    try:
        font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", font_size)
    except:
        font = ImageFont.load_default()
    
    bbox = draw.textbbox((0, 0), "Z", font=font)
    tw = bbox[2] - bbox[0]
    th = bbox[3] - bbox[1]
    draw.text((cx - tw/2, cy - th/2 - font_size*0.03), "Z", fill=(255, 255, 255, 255), font=font)
    img.save(filename)
    print(f"Created {filename} ({width}x{height})")

base = '/home/z/my-project/download/z-ai-app/src/assets'
os.makedirs(base, exist_ok=True)

create_icon(1024, f"{base}/icon.png")
create_adaptive_icon(1024, f"{base}/adaptive-icon.png")
create_splash(1242, 2688, f"{base}/splash.png")
create_icon(48, f"{base}/favicon.png")

print("\nAll icons generated!")