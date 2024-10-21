import React, { useMemo } from 'react';
import util from '@/util/index';

import styles from './index.module.scss';

const { getEmojis } = util;

const Emoji = () => {
    const emojis = useMemo(() => getEmojis(), []);

    return (
        <div className={styles.emoji}>
            {
                emojis.map((_emoji: any, index: number) => (
                    <React.Fragment
                        key={index}
                    >
                        {_emoji}
                    </React.Fragment>
                ))
            }
        </div>
    );
};

export default Emoji;

