import React from 'react';
import classNames from 'classnames';

import styles from './index.styl';

const cx = classNames.bind(styles);

const Footer = () => {
    return (
        <footer
            className={cx('footer')}
        >
            ©2024 predaking
        </footer>
    );
}

export default Footer;