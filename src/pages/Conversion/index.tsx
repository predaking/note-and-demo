import React, { useEffect, useState, useRef } from 'react';
import { Upload } from 'antd';

const SOURCE_URL = 'https://guonei-cos.koocdn.com/common/2f34d4722bff4481804ff19816233095.wmf';

const Conversion: React.FC = () => {
    const ctxRef = useRef<HTMLCanvasElement>(null);
    const [src, setSrc] = useState('');

    const onChange = async (info: any) => {
        const { status, response } = info.file;
        if (status === 'done') {
            const blob = new Blob([response]);
            setSrc(URL.createObjectURL(blob));
        }
    }

    useEffect(() => {
    }, []);

    return (
        <div>
            <Upload.Dragger
                action={'http://localhost:9090/convert'}
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