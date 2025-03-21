# 目录

+ 函数
+ 高阶函数
+ 闭包
+ 迭代器
+ other

## 函数

### reverse

`reverse()` 函数用于将列表中的元素反转，与 js 中的不同，它的返回值是 None，并非列表

## 高阶函数

### map

返回一个迭代器，可通过 `list()` 等函数将其转换为列表、元组等其他数据类型

## 闭包


## 迭代器

可迭代对象(Iterable)：实现了 `__iter__` 方法的对象，如列表、元组、字典、集合、字符串等
迭代器(Iterator)：实现了 `__iter__` 与 `__next__` 方法的对象，如生成器、带有 yield 的函数、map object、filter object 等

通过 `iter()` 函数可以将可迭代对象转换为迭代器

可通过 `isinstance()` 函数判断对象是否为可迭代对象或迭代器

```python
from collections.abc import Iterable, Iterator
a = [1, 2, 3]
b = iter(a)
print(isinstance(a, Iterable))  # True
print(isinstance(a, Iterator))  # False
print(isinstance(b, Iterable))  # True
print(isinstance(b, Iterator))  # True
```

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
