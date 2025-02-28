const math = {
    /**
     * @description 判断是否为2次幂
     * @param {number} value 
     */
    isPowerOf2(value: number) {
        return (value & (value - 1)) === 0;
    },

    /**
     * @description 随机打乱数组(费雪耶茨算法)
     * @param {any[]} array
     */
    fisherYatesShuffle(array: any[]) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    },
};

export default math;