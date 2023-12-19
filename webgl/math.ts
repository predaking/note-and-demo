const math = {
    /**
     * @description 判断是否为2次幂
     * @param {number} value 
     */
    isPowerOf2(value: number) {
        return (value & (value - 1)) === 0;
    },
    /**
     * @description 一维数组转二维数组
     * @param arr 
     * @param cols 
     */
    convertTo2DArray(arr: Array<any>, cols: number) {
        return arr.slice(0, cols).map(function (_, i) {
            return arr.slice(i * cols, i * cols + cols);
        });
    }
};

export default math;