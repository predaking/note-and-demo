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
    }
};

export default tool;