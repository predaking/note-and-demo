import React from 'react';
import classNames from 'classnames';
import icon from '../../../assets/icon.png';
import styles from './index.styl';

const cx = classNames.bind(styles);

const Footer = () => {
    return (
        <footer
            className={cx('footer')}
        >
            <div
                className={cx('copy-right')}
            >
                ©2024 predaking&nbsp;
            </div>
            <a 
                href='https://beian.miit.gov.cn'
                target='_blank'
            >
                京ICP备2024090417号-1
            </a>
            <div
                className={cx('record')}
            >
                <img 
                    className={cx('icon')}
                    src={icon}
                />
                <a 
                    href="https://beian.mps.gov.cn/#/query/webSearch?code=11011402054382" 
                    rel="noreferrer" 
                    target="_blank"
                >
                    京公网安备11011402054382
                </a>
            </div>
        </footer>
    );
}

export default Footer;