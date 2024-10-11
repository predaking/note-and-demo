import React, { useMemo } from 'react';
import classNames from 'classnames';
import util from '@/util/index';

import styles from './index.styl';

const cx = classNames.bind(styles);

const { getEmojis } = util;

const Emoji = () => {
    const emojis = useMemo(() => getEmojis(), []);

    return (
        <div className={cx('emoji')}>
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

