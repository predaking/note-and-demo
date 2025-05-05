FROM node:22-alpine

# 安装nginx
RUN apk add --no-cache nginx

# 设置工作目录
WORKDIR /app

# 复制package.json和安装依赖
COPY package*.json ./
RUN npm install -g pnpm
RUN npm install -g ts-node
RUN pnpm install

# 复制应用代码
COPY . .

# 构建React应用
RUN pnpm build

# 创建nginx目录
RUN mkdir -p /run/nginx

# 确保nginx的html目录存在并清空
RUN mkdir -p /usr/share/nginx/html && rm -rf /usr/share/nginx/html/*
RUN cp -r dist/* /usr/share/nginx/html/

# 复制nginx配置
COPY ./nginx/nginx.conf /etc/nginx/nginx.conf

# 确保SSL目录存在
RUN mkdir -p /etc/nginx/ssl

# 复制SSL证书
COPY ./nginx/ssl/ /etc/nginx/ssl/

# 暴露端口
EXPOSE 80 443 3000

# 启动应用
# 不使用启动脚本，直接在CMD中启动服务
CMD sh -c "nginx -g 'daemon off;'"