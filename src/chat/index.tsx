import React, { useState, useEffect, useRef } from "react";
import { Button, Input } from "antd";

const Chat = () => {
    const [msg, setMsg] = useState<any>('');
    const [value, setValue] = useState<any>('');

    const ws = useRef<any>(null);

    useEffect(() => {
        const _ws = new WebSocket('ws://localhost:8888');
        _ws.onmessage = (e) => {
            setMsg(e.data);
        }
        ws.current = _ws;
    }, []);

    const sendMsg = () => {
        ws.current?.send(value);
        setValue('');
    };

    return (
        <div>
            <div>服务端消息：{msg}</div>
            <div>
                <Input 
                    value={value} 
                    onChange={e => setValue(e.target.value)}
                />
                <Button
                    onClick={sendMsg}
                >
                    发送
                </Button>
            </div>
        </div>
    );
}

export default Chat;