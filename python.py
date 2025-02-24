import geopandas as gpd
import matplotlib.pyplot as plt

gdf = gpd.read_file('./uploads/0004.shp')
fig, ax = plt.subplots(figsize=(10, 10))

gdf.plot(ax=ax)

ax.set_axis_off()

# 保存为图片（支持 PNG/JPEG/SVG 等格式）
plt.savefig("output.png", dpi=300, bbox_inches="tight")
plt.close()