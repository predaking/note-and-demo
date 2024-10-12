import React, { useEffect } from 'react';
import Register from '@/components/register';
import { notification } from 'antd';

const ws = new WebSocket('ws://localhost:3000');

const Entertainment = () => {
    useEffect(() => {
        ws.onopen = () => {
            // ws.send('hello');
            console.log('connected');
        };
        ws.onmessage = (e: any) => {
            const timer = setTimeout(() => {
                notification.success({
                    message: e.data,
                });
                clearTimeout(timer);
            }, 1000);
        };
    }, []);

    return (
        <div>
            <Register />
            暂无内容
        </div>
    )
}

export default Entertainment;