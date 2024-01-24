use std::{
    fs::OpenOptions, io::Write, path::Path
};

fn main() {
    let path = Path::new("../../docs/test.md");
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
