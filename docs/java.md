# 目录

- [目录](#目录)
  - [java](#java)
    - [基础语法](#基础语法)
      - [数组](#数组)
        - [数组合并](#数组合并)
      - [字符串](#字符串)
        - [String、StringBuilder 与 StringBuffer 区别](#stringstringbuilder-与-stringbuffer-区别)
    - [进阶语法](#进阶语法)
      - [HashMap 与 LinkedHashMap](#hashmap-与-linkedhashmap)
        - [HashMap](#hashmap)
        - [LinkedHashMap](#linkedhashmap)

## java

### 基础语法

#### 数组

##### 数组合并

java 中并无像js一样的扩展运算符用于快速合并数组，常规的合并写起来太过繁琐。因此可以采用 nio 包中的缓冲（buffer）类去实现，所有基本类型的数组都有对应的 buffer。

```java
import java.nio.IntBuffer;

public class Main {
    public static void main(String[] args) {
        int[] arr1 = new int[]{1, 2};
        int[] arr2 = new int[]{3, 4};

        IntBuffer intBuffer = IntBuffer.allocate(arr1.length + arr2.length);
        intBuffer.put(arr1);
        intBuffer.put(arr2);
        System.out.println(Arrays.toString(intBuffer.array()));
    }
}
```

#### 字符串

##### String、StringBuilder 与 StringBuffer 区别

`String`: 不可变，通常用于常量。
`StringBuffer`: 适用于对字符串频繁操作，多线程环境下，线程安全。
`StringBuilder`: 同样适用于对字符串的频繁操作，但因是单线程环境下运行，因此线程不安全。性能强于`StringBuffer`。

### 进阶语法

#### HashMap 与 LinkedHashMap

##### HashMap

- 不允许有重复的键
- 非线程安全
- 基于散列表实现
- 可以设置初始容量（默认16），且可以传入装载因子（默认值为0.75，表示现有数据量达到当前容量 × 装载因子时，HashMap会进行扩容，扩大的容量是原本的2倍）

##### LinkedHashMap

- 继承自HashMap，区别在于能够实现有序
- 实现基于重写HashMap的实体类Entry，将HashMap的数据组成一个双向链表
- 可根据插入顺序或访问顺序实现迭代顺序的改变，这可以通过设置accessOrder为true触发

```java
    public void practiceHashMap () {
        HashMap<Integer, Integer> hashMap = new LinkedHashMap<>(10, 0.75f, true);
        hashMap.put(3, 25);
        hashMap.put(1, 27);
        hashMap.put(7, 10);
        hashMap.put(4, 30);

        hashMap.get(1);

        // 3 7 4 1
        for (Map.Entry e: hashMap.entrySet()) {
            System.out.print(e.getKey() + " ");
        }
    }
```