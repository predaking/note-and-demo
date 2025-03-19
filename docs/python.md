# 目录

+ other

## other

### 什么是WSGI

WSGI(Web Server Gateway Interface)：是 Python Web 服务器（例如 nginx、apache）和 Web 应用程序（例如 flask）之间的一种简单而通用的接口。常用的 WSGI 服务器有 gunicorn

工作流程：

1. 服务器接收 http 请求，生成 `environ` 字典
2. 调用应用程序，传递 `environ` 与 `start_response`
3. 应用程序处理请求，生成响应内容并调用 `start_response` 设置状态与响应头
4. 服务器将上述处理好的响应发送到客户端

注意：

1. WSGI 是接口，是规范，WSGI 服务器的核心作用是运行符合 WSGI 规范的 Web 应用程序，如 gunicorn；WSGI 应用程序则是开发者编写的实现了`environ`与`start_response`接口的业务逻辑程序，如 flask

2. WSGI 是同步接口，且只支持 http1.1，不支持 webSocket，应用程序框架有 Flask，异步接口需用 ASGI，对应应用程序框架有 FastAPI
