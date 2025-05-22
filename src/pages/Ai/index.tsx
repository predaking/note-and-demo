import { useState } from "react";
import { Button, Input } from 'antd';
import { streamRequest } from "@/service";
// @ts-ignore
import Markdown from 'react-markdown';

import styles from './index.module.scss';
import RichText from "@/components/richText";

const Ai = () => {
    const [result, setResult] = useState<string>('');
    const [prompt, setPrompt] = useState<string>('');

    const handleData = (data: any) => {
        if (data.done) {
            return;
        }
        setResult((prev) => prev + data.data);
    }

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
                onClick={requests}
            >
                提问
            </Button>
        </div>
    )
};

export default Ai;