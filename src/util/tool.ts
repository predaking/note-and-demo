import { emojiRanges } from '@/constant';

const tool = {
    getEmojis: () => {
        let emojis: any = [];
        emojiRanges.forEach(range => {
            for (let i = range[0]; i <= range[1]; i++) {
                emojis.push(String.fromCodePoint(i));
            }
        });
        return emojis;
    },
    /**
     * @description 获取枚举的key和value
     * @param enumType 
     */
    getKeyValuesFromEnum: (enumType: any) => {
        const keys = Object.keys(enumType);
        const len = keys.length;
        return [keys.slice(0, len / 2), keys.slice(len / 2)];
    },
};

export default tool;