import React, { useState, useEffect } from 'react';
import { notification } from 'antd';

const ws = new WebSocket('ws://localhost:3000');

const Entertainment = () => {
    const [status, setStatus] = useState(0);
    useEffect(() => {
        ws.onopen = () => {
            // ws.send('hello');
            console.log('connected');
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