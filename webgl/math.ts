const math = {
    /**
     * @description 判断是否为2次幂
     * @param {number} value 
     */
    isPowerOf2(value) {
        return (value & (value - 1)) === 0;
    }
};

export default math;