# 目录

+ CSS

## CSS

### Flex弹性盒子

#### 父元素上的属性

+ `display`: 设置`flex`则为块儿级弹性盒子，父元素独占一行，默认宽度100%，设置`inline-flex`则为内联弹性盒子，父元素宽度取决于全部子元素宽度

+ `flex-direction`: 定义子元素的排列方向（主轴方向），默认横向排列，值为`row`，纵向排列`column`，横向逆序排列`row-reverse`，纵向逆序排列`column-reverse`

+ `flex-wrap`: 定义元素超出一排或一列后如何排列，默认不换行，值为`nowrap`，自动换行`wrap`，自动反向换行`wrap-reverse`（排列结果与`wrap`轴对称）

+ `flex-flow`: `flex-direction`与`flex-wrap`的结合。默认为`row nowrap`

+ `align-content`: 定义多条轴线子元素的排列方式（一般是子元素排不满产生了换行），可选值与`align-items`相同

#### 子元素上的属性

+ `flex-grow`: 定义子元素如何占据主轴剩余空间，默认值为0，若值为1，则表示当前子元素占满剩余空间

+ `flex-shrink`: 定义子元素的缩小比例，默认值为1，表示空间不足时，都将等比例缩小；若
