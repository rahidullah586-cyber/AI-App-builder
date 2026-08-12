#!/usr/bin/env python3
"""Generate app icons using the AI-generated logo."""
from PIL import Image, ImageDraw, ImageFilter, ImageFont
import os

BASE = '/home/z/my-project/download/z-ai-app/src/assets'
LOGO = f'{BASE}/logo-generated.png'

def make_rounded_mask(size):
    mask = Image.new('L', (size, size), 0)
    draw = ImageDraw.Draw(mask)
    # Android adaptive icon: inner 66% is the safe zone (circle inscribed)
    padding = int(size * 0.1)
    draw.ellipse([padding, padding, size - padding, size - padding], fill=255)
    return mask

def create_icon(size, filename, mask=True):
    logo = Image.open(LOGO).convert('RGBA').resize((size, size), Image.LANCZOS)
    if mask:
        m = make_rounded_mask(size)
        # Apply mask to alpha channel
        logo.putalpha(ImageChops.multiply(logo.split()[3], m))
    logo.save(filename)
    print(f'  Created {filename} ({size}x{size})')

from PIL import ImageChops

# Ensure logo exists
if not os.path.exists(LOGO):
    print('Error: logo-generated.png not found!')
    exit(1)

print('Generating app icons from AI logo...')
create_icon(1024, f'{BASE}/icon.png', mask=True)
create_icon(1024, f'{BASE}/adaptive-icon.png', mask=True)
create_icon(48, f'{BASE}/favicon.png', mask=False)

# Splash: logo centered on dark gradient background
def create_splash(width, height, filename):
    bg = Image.new('RGBA', (width, height), (6, 6, 12, 255))
    # Subtle radial gradient
    for y in range(height):
        for x in range(0, width, 4):
            dx = (x - width / 2) / (width / 2)
            dy = (y - height / 2) / (height / 2)
            dist = (dx * dx + dy * dy) ** 0.5
            alpha = int(max(0, min(40, (1 - dist) * 60)))
            bg.putpixel((x, y), (79, 70, 229, alpha))
    
    # Paste logo centered
    logo = Image.open(LOGO).convert('RGBA')
    logo_size = min(width, height) // 3
    logo_resized = logo.resize((logo_size, logo_size), Image.LANCZOS)
    x = (width - logo_size) // 2
    y = (height // 2) - (height // 6)
    bg.paste(logo_resized, (x, y), logo_resized)
    bg.save(filename)
    print(f'  Created {filename} ({width}x{height})')

create_splash(1242, 2688, f'{BASE}/splash.png')
print('Done! All icons regenerated with AI logo.')