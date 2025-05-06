# 构建阶段
FROM node:22-alpine AS builder

WORKDIR /app

# 复制package.json和安装依赖
COPY package*.json ./
RUN npm install -g pnpm
RUN pnpm install

# 只复制必要的源代码文件
COPY src/ ./src/
COPY public/ ./public/
COPY vite.config.js ./
COPY tsconfig.json ./
COPY index.html ./
COPY predaking.crt ./
COPY predaking.key ./
COPY resource/ ./resource/

# 构建React应用
RUN pnpm build

# 生产阶段
FROM nginx:alpine

# 复制构建结果
COPY --from=builder /app/dist /usr/share/nginx/html

# 复制docs目录到Nginx服务器
COPY ./docs /usr/share/nginx/html/docs
COPY ./resource /usr/share/nginx/html/resource

# 复制nginx配置
COPY ./nginx/nginx.conf /etc/nginx/nginx.conf

# 确保SSL目录存在
RUN mkdir -p /etc/nginx/ssl

# 复制SSL证书
COPY ./nginx/ssl/ /etc/nginx/ssl/

# 暴露端口
EXPOSE 80 443

# 启动nginx
CMD ["nginx", "-g", "daemon off;"]