# webgl

## 工作原理

webgl 每次绘制需要两个着色器：顶点着色器 与 片段着色器，每个着色器都是一个方法，一个顶点着色器加一个片段着色器链接在一起放在一个着色程序当中，一个 webgl 应用往往会有多个着色程序

例：初始化一个点：
![工作原理-初始换一个点](../assets/img/webgl/process.excalidraw.png)

### 顶点着色器(vertex shader)

生成裁剪空间坐标值，每个顶点都会调用一次顶点着色器方法，每次调用都会设置一个全局变量`gl_Positon`，该变量的值就是裁剪空间坐标值

顶点着色器的数据来源：

1. `Attribute`属性：从缓冲中读取的数据
2. `Uniforms`全局变量：在一次绘制中对所有顶点保持一致的值
3. `Textures`纹理：从像素或者纹理元素中获取的数据

### 片段着色器(fragment shader)

为当前光栅化的像素提供颜色值，每个像素每次都会调用一次片段着色器，并从设置的特殊全局变量`gl_FragColor`中获取颜色值信息

片段着色器的数据来源：

1. `Attribute`属性：从缓冲中读取的数据
2. `Uniforms`全局变量：在一次绘制中对所有顶点保持一致的值
3. `Varyings`可变量：用于从顶点着色器传值到片段着色器

## GLSL

### 精度

+ 精度限定词：约定变量的范围（极值）与精度。例: `precision mediump float` 表示采取中等精度。

## 变换矩阵

### 旋转矩阵

$$
    \begin{bmatrix}
        cosθ & sinθ & 0 & 0 \\
        -sinθ & cosθ & 0 & 0 \\
        0 & 0 & 1 & 0 \\
        0 & 0 & 0 & 1
    \end{bmatrix}
$$

### 平移矩阵

$$
    \begin{bmatrix}
        1 & 0 & 0 & tx \\
        0 & 1 & 0 & ty \\
        0 & 0 & 1 & tz \\
        0 & 0 & 0 & 1
    \end{bmatrix}
$$

### 缩放矩阵

$$
    \begin{bmatrix}
        sx & 0 & 0 & 0 \\
        0 & sy & 0 & 0 \\
        0 & 0 & sz & 0 \\
        0 & 0 & 0 & 1
    \end{bmatrix}
$$