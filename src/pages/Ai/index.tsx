import { useEffect, useRef, useState } from "react";
import { Button, Input } from 'antd';
import { streamRequest } from "@/service";
// @ts-ignore
import Markdown from 'react-markdown';

import styles from './index.module.scss';

const Ai = () => {
    const [result, setResult] = useState<string>('');
    const [prompt, setPrompt] = useState<string>('');

    const handleData = (data: any) => {
        if (data.done) {
            return;
        }
        setResult((prev) => prev + data.response);
    }

    const requests = async () => {
        setResult('');
        streamRequest('/ollama/api/generate', 'POST', {
            prompt: prompt || '请简单介绍你，30字左右',
            model: 'llama3.2',
            stream: true
        }, handleData);
    }

    return (
        <div
            className={styles.container}
        >
            <Markdown>{result}</Markdown>
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