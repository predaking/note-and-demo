export const sendToClient = (type: string, data: any) => {
    return JSON.stringify({
        type,
        data
    })
};

export const underscoreToCamelCase = (obj: any): any => {
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            let newKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
            if (newKey !== key) {
                obj[newKey] = obj[key];
                delete obj[key];
            }
        }
    }

    return obj;
}

/**
 * @description 随机打乱数组(费雪耶茨算法)
 * @param {any[]} array
 */
export const fisherYatesShuffle = (array: any[]) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

/**
 * @description 获取枚举的key和value
 * @param enumType 
 */
export const getKeyValuesFromEnum = (enumType: any) => {
    const keys = Object.keys(enumType);
    const len = keys.length;
    return [keys.slice(0, len / 2), keys.slice(len / 2)];
}

export const isProd = process.env.NODE_ENV === 'production';