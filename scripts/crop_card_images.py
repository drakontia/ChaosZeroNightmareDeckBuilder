#!/usr/bin/env python3
"""
カード画像のトリミングスクリプト
public/images/cards_cropped/ 内の全てのカード画像をトリミングして public/images/cards/ に配置します
"""

import os
from pathlib import Path
from PIL import Image

def find_card_bounds(img):
    """画像からカード部分の境界を検出"""
    # グレースケールに変換
    gray = img.convert('L')
    
    # 背景色を推定（端の複数ピクセルから平均を取る）
    width, height = img.size
    pixels = gray.load()
    
    # 端の領域から背景色を推定（より広い範囲から）
    bg_samples = []
    for i in range(min(50, width // 4)):
        bg_samples.append(pixels[i, 0])
        bg_samples.append(pixels[width - 1 - i, 0])
        bg_samples.append(pixels[i, height - 1])
        bg_samples.append(pixels[width - 1 - i, height - 1])
    bg_color = sum(bg_samples) // len(bg_samples)
    
    # より厳密な閾値を設定
    threshold = 50
    min_content_ratio = 0.3  # 列/行の30%以上がコンテンツである必要がある
    
    # 左端を検出（列ごとに非背景ピクセル数をカウント）
    left = 0
    for x in range(width):
        content_count = 0
        for y in range(height):
            if abs(pixels[x, y] - bg_color) > threshold:
                content_count += 1
        if content_count >= height * min_content_ratio:
            left = x
            break
    
    # 右端を検出
    right = width - 1
    for x in range(width - 1, -1, -1):
        content_count = 0
        for y in range(height):
            if abs(pixels[x, y] - bg_color) > threshold:
                content_count += 1
        if content_count >= height * min_content_ratio:
            right = x
            break
    
    # 上端を検出（行ごとに非背景ピクセル数をカウント）
    card_width = right - left + 1 if right > left else width
    top = 0
    for y in range(height):
        content_count = 0
        for x in range(max(0, left - 50), min(width, right + 50)):
            if abs(pixels[x, y] - bg_color) > threshold:
                content_count += 1
        if content_count >= card_width * min_content_ratio:
            top = y
            break
    
    # 下端を検出
    bottom = height - 1
    for y in range(height - 1, -1, -1):
        content_count = 0
        for x in range(max(0, left - 50), min(width, right + 50)):
            if abs(pixels[x, y] - bg_color) > threshold:
                content_count += 1
        if content_count >= card_width * min_content_ratio:
            bottom = y
            break
    
    # マージンなし（検出自体を厳密にする）
    left = max(0, left)
    top = max(0, top)
    right = min(width - 1, right)
    bottom = min(height - 1, bottom)
    
    return (left, top, right, bottom)

def crop_card_image(input_path, output_path, bounds=None):
    """カード画像をトリミング"""
    try:
        img = Image.open(input_path)
        
        # カード境界を検出（boundsが指定されていない場合のみ）
        if bounds is None:
            bounds = find_card_bounds(img)
        
        # トリミング
        cropped = img.crop(bounds)
        
        # 保存
        cropped.save(output_path, 'PNG', optimize=True)
        
        print(f"✓ {os.path.basename(input_path)} → {os.path.basename(output_path)} ({cropped.width}×{cropped.height})")
        return True, bounds
        
    except Exception as e:
        print(f"✗ Error processing {os.path.basename(input_path)}: {e}")
        return False, None

def main():
    # パス設定
    script_dir = Path(__file__).parent
    project_root = script_dir.parent
    input_dir = project_root / 'public' / 'images' / 'cards_cropped'
    output_dir = project_root / 'public' / 'images' / 'cards'
    
    # 出力ディレクトリを作成
    output_dir.mkdir(parents=True, exist_ok=True)
    
    # PNG ファイルを取得（全ての PNG ファイル）
    image_files = sorted([f for f in input_dir.glob('*.png')])
    
    if not image_files:
        print("No PNG files found in", input_dir)
        return
    
    print(f"Found {len(image_files)} images to process")
    print(f"Output directory: {output_dir}\n")
    
    # 最初の画像から境界を検出
    print("Detecting card bounds from first image...")
    first_output_path = output_dir / image_files[0].name
    success, bounds = crop_card_image(image_files[0], first_output_path)
    
    if not success or bounds is None:
        print("Failed to detect card bounds from first image")
        return
    
    print(f"Detected bounds: left={bounds[0]}, top={bounds[1]}, right={bounds[2]}, bottom={bounds[3]}")
    print(f"Applying same bounds to all {len(image_files)} images...\n")
    
    # 検出した境界を全ての画像に適用
    success_count = 1  # 最初の画像は既に処理済み
    for input_path in image_files[1:]:
        output_path = output_dir / input_path.name
        result, _ = crop_card_image(input_path, output_path, bounds)
        if result:
            success_count += 1
    
    print(f"\nCompleted: {success_count}/{len(image_files)} images processed successfully")

if __name__ == '__main__':
    main()
