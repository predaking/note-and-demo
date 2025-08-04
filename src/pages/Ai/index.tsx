import { useCallback, useState } from "react";
import { Button, Input } from 'antd';
import { streamRequest } from "@/service";
// @ts-ignore
import Markdown from 'react-markdown';

import styles from './index.module.scss';
import RichText from "@/components/richText";
import Chat from "@/components/chat";

const Ai = () => {
    const [result, setResult] = useState<string>('');
    const [prompt, setPrompt] = useState<string>('');
    const [count, setCount] = useState<number>(0);
    const [number, setNumber] = useState<number>(0);

    const handleData = useCallback((data: any) => {
        if (data.done) {
            return;
        }
        setResult((prev) => prev + data.data);
    }, []);

    const requests = () => {
        setResult('');
        streamRequest('/api/sse', handleData);
    }

    return (
        <div
            className={styles.container}
        >
            <Markdown>{result}</Markdown>
            <RichText
                value={prompt}
                onChange={(value) => setPrompt(value)}
            />
            <Button
                className={styles.submit}
                type="primary"
                onClick={() => {
                    setNumber((prev) => prev + 1);
                }}
            >
                提问
            </Button>
            <Chat />
        </div>
    )
};

export default Ai;