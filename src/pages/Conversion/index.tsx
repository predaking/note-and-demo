import React, { useEffect, useState, useRef } from 'react';
import { Upload, message } from 'antd';
import { request } from '@/service';

const SOURCE_URL = 'https://guonei-cos.koocdn.com/common/2f34d4722bff4481804ff19816233095.wmf';

const Conversion: React.FC = () => {
    const ctxRef = useRef<HTMLCanvasElement>(null);
    const [src, setSrc] = useState('');

    const onChange = async (info: any) => {
        if (info.file.status === 'uploading') {
            return;
        }
        if (info.file.status === 'done') {
            try {
                const base64Url = info.file.response;
                setSrc(base64Url);
            } catch (error) {
                console.error('Error:', error);
                message.error('Error while processing the response.');
            }
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
        }
    }

    useEffect(() => {
    }, []);

    return (
        <div>
            <Upload.Dragger
                action={'https://aibox.neibu.koolearn.com/wmf-convertion/convert'}
                onChange={onChange}
                showUploadList={false}
                name='file'
            >
                Upload
            </Upload.Dragger>
            <div
                style={{
                    marginTop: '20px',
                }}
            >
                <canvas ref={ctxRef} />
            </div>
            <div
                style={{
                    marginTop: '20px',
                }}
            >
                <img src={src} />
            </div>
        </div>
    );
};

export default Conversion;