import { useEffect, useState } from "react";
import { Button, Input } from 'antd';
import { post } from "@/service";

import styles from './index.module.scss';

const Ai = () => {
    // const [result, setResult] = useState<string>('');
    const [prompt, setPrompt] = useState<string>('');

    const requests = async () => {
        const res = await post('http://localhost:11434/api/generate', {
            prompt: prompt || '你好'
        });
        console.log('res: ', res);
    }

    useEffect(() => {

    });

    return (
        <div
            className={styles.container}
        >
            <Input.TextArea
                className={styles.input}
                value={prompt}
                onChange={(e: any) => setPrompt(e.target.value)}
                placeholder="请输入"
                autoSize={{ minRows: 12 }}
            />
            <Button 
                className={styles.submit}
                type="primary"
                onClick={requests}
            >
                提问
            </Button>
        </div>
    )
};

export default Ai;