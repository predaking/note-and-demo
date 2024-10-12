import React from 'react';
import classNames from 'classnames';

import styles from './index.styl';

const cx = classNames.bind(styles);

const Footer = () => {
    return (
        <footer
            className={cx('footer')}
        >
            ©2024 predaking&nbsp;
            <a 
                href='https://beian.miit.gov.cn'
                target='_blank'
            >
                京ICP备2024090417号-1
            </a>
        </footer>
    );
}

export default Footer;