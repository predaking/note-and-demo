import React from 'react';
import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import classNames from 'classnames';

import styles from './index.styl';
import { Link } from 'react-router-dom';

const cx = classNames.bind(styles);

const Header = () => {
    return (
        <header
            className={cx('header')}
        >
            <div className={cx('logo')}>
                <Link to='/'>欢迎👏🏻</Link>
            </div>
            <Input 
                className={cx('search')}
                placeholder='全站搜索（暂未开放）' 
                prefix={
                    <SearchOutlined
                        className={cx('search-icon')}
                    />
                }
            />
            <nav>
                <ul>
                    <li>
                        <Link to='/entertainment'>娱乐</Link>
                    </li>
                    <li>其他</li>
                </ul>
            </nav>
            <div></div>
        </header>
    );
};

export default Header;