import React, { useState, useEffect } from 'react';
import { notification } from 'antd';

const ws = new WebSocket('wss://localhost:3000/ws');

const Entertainment = () => {
    const [status, setStatus] = useState(0);
    useEffect(() => {
        ws.onopen = () => {
            // ws.send('hello');
            console.log('connected');
        };
        ws.onerror = (e: any) => {
            console.log('error: ', e);
        };
        ws.onmessage = (e: any) => {
            const _data = JSON.parse(e.data);
            console.log('_data: ', _data);
            if (_data.type === 'matched') {
                notification.open({
                    message: '匹配成功'
                });
                setStatus(1);
            }   
        };
    }, []);

    return (
        <div>
            {
                status === 1 ? (
                    <div>
                        <h1>匹配成功</h1>
                    </div>
                ) : (
                    <div>
                        <h1>匹配中...</h1>
                    </div>
                )
            }
        </div>
    )
}

export default Entertainment;