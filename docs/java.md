# 目录

- [目录](#目录)
  - [java](#java)
    - [基础语法](#基础语法)
      - [数组合并](#数组合并)

## java

### 基础语法

#### 数组合并

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