import subprocess
from PIL import Image

def convert_wmf_to_png(wmf_file, png_file):
    # 使用 LibreOffice 将 WMF 转换为 PNG
    subprocess.run(['/Applications/LibreOffice.app/Contents/MacOS/soffice', '--headless', '--convert-to', 'png', '--outdir', '.', wmf_file])
    # 将转换后的文件重命名为目标文件名
    subprocess.run(['mv', wmf_file.replace('.wmf', '.png'), png_file])

def trim_image(input_path, output_path):
    # 使用 Pillow 去除多余的空白
    image = Image.open(input_path)
    image.load()

    # 使用 getbbox() 函数获取图像的边界框
    bbox = image.getbbox()
    if bbox:
        image = image.crop(bbox)
        image.save(output_path)

# 示例使用
wmf_file = 'image1.wmf'
png_file = 'output.png'
trimmed_png_file = 'output_trimmed.png'

convert_wmf_to_png(wmf_file, png_file)
trim_image(png_file, trimmed_png_file)



# def hanoi(n, a, b, c):
#     if n == 1:
#         print(a, '->', c);
#         return;
#     hanoi(n - 1, a, c, b);
#     hanoi(1, a, b, c);
#     hanoi(n - 1, b, a, c);

# hanoi(3, 'A', 'B', 'C');