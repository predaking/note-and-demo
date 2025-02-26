import geopandas as gpd

# 读取shp文件
gdf = gpd.read_file("/Users/xdf/react-pro/uploads/0004.shp")

# 转换为GeoJSON并保存
gdf.to_file("output.geojson", driver='GeoJSON')