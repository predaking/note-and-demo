import React from 'react';
import { Avatar, Input } from 'antd';
import { SearchOutlined, UserOutlined } from '@ant-design/icons';
import { Link, useLocation } from 'react-router-dom';
import { useGlobalContext } from '@/store';

import styles from './index.module.scss';

const Header = () => {
    const { state } = useGlobalContext();
    const { userInfo } = state;

    const {
        avatar
    } = userInfo || {};

    const location = useLocation();

    const showAvatar = location.pathname !== '/' && userInfo;

    return (
        <header
            className={styles.header}
        >
            <div className={styles.logo}>
                <Link to='/'>欢迎👏🏻</Link>
            </div>
            <Input 
                className={styles.search}
                placeholder='全站搜索（暂未开放）' 
                prefix={
                    <SearchOutlined
                        className={styles['search-icon']}
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
            {
                showAvatar && (
                    <Avatar 
                        className={styles.avatar}
                        icon={<UserOutlined />} 
                        src={avatar || null}
                        alt='avatar'
                    />
                )
            }
        </header>
    );
};

export default Header;