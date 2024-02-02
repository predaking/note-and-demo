# 目录

- [目录](#目录)
  - [基础语法](#基础语法)
    - [数据类型](#数据类型)
      - [let 与 const 区别](#let-与-const-区别)
    - [文件与IO](#文件与io)
      - [读取文本文件](#读取文本文件)
      - [读取二进制文件](#读取二进制文件)
      - [写入文件](#写入文件)

## 基础语法

### 数据类型

#### let 与 const 区别

+ `const`声明的变量必须指定类型
+ `match`匹配条件不能是`let`变量，而必须是`const`常量（存疑）

### 文件与IO

#### 读取文本文件

```rust
use std::{fs, path::Path};

fn main() {
    // path为相对当前工作目录（.toml所在路径）的路径
    let path = Path::new("../../docs/rust.md");
    // 利用 read_to_string 读取文本文件
    let text = fs::read_to_string(&path).unwrap();
    println!("{}", text);
}
```

#### 读取二进制文件

```rust
use std::{fs, path::Path};

fn main() {
    // path为相对当前工作目录（.toml所在路径）的路径
    let path = Path::new("../../docs/rust.md");
    // 利用 read 读取二进制文件
    let text = fs::read(&path).unwrap();
    // 读取结果为 u8 类型集合
    println!("{:?}", text);
}
```

#### 写入文件

一次性写入：
```rust
fn main() {
    let path = Path::new("../../docs/test.md");
    // 文件不存在则新建
    fs::write(&path, "write something...").unwrap();
}
```

流式写入：
```rust
use std::{
    fs::File, io::Write, path::Path, thread::sleep, time::Duration
};

/** 示例：每隔5s写入一行字符 */
fn main() {
    let path = Path::new("../../docs/test.md");
    let mut index = 0;
    // 调用 create 方法实现流式写入
    let mut _file = File::create(&path).unwrap();
    while index < 5 {
        sleep(Duration::from_millis(5000));
        // 调用 as_bytes 将字符串转化为buffer类型
        _file.write(format!("{}{}\n", "index", index).as_bytes()).unwrap();
        index += 1;
    }
}
```

以上两种方式均为破坏性写入（每次执行都会清空文件内容后写入），以下为非破坏性写入，但前提是文件已存在。

```rust
use std::{
    fs::OpenOptions, io::Write, path::Path
};
/** 示例：利用 append 追加写入 */
fn main() {
    let path = Path::new("../../docs/test.md");
    /** OpenOptions 为一种灵活打开文件的方式，并可以链式
     * 调用式地设置打开权限，其中 append 值为 true 表示
     * 追加内容，如果文件不存在则会报错 */
    let res = OpenOptions::new()
      .append(true)
      .open(&path)
      .unwrap()
      .write(b"this is append text");

    match res {
        Ok(usize) => {
            println!("res: {}", usize);
        }
        Err(err) => {
            println!("err: {}", err);
        }
    }
}
```

```rust
use std::{
    fs::OpenOptions, io::Write, path::Path
};

/** 示例：从头部覆盖内容 */
fn main() {
    let path = Path::new("../../docs/test.md");
    // 打开文件的读写权限
    let res = OpenOptions::new()
        .read(true)
        .write(true)
        .open(&path)
        .unwrap()
        .write(b"cover");

    match res {
        Ok(usize) => {
            println!("res: {}", usize);
        }
        Err(err) => {
            eprintln!("err: {}", err);
        }
    }
}
```


