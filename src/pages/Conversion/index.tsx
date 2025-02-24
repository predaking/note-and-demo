import React, { useEffect, useState, useRef } from 'react';
import { Upload, message } from 'antd';
import { formUpload } from '@/service';

const Conversion: React.FC = () => {
    const onChange = async (info: any) => {
        // if (info.file.status === 'uploading') {
        //     return;
        // }
        if (info.file.status === 'done') {
            console.log('info: ', info);
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
        }
    }

    useEffect(() => {
    }, []);

    return (
        <div>
            <Upload.Dragger
                multiple
                onChange={onChange}
                showUploadList={false}
                name='file'
                customRequest={({ file }) => {
                    console.log('file: ', file);
                    const formData = new FormData();
                    formData.append('file', file);
                    formUpload('/upload', formData).then((res: any) => {
                        console.log('res: ', res);
                    }).catch((err: any) => {
                        console.log('err: ', err);
                    })
                }}
            >
                Upload
            </Upload.Dragger>
            <Upload.Dragger
            >
                Convert
            </Upload.Dragger>
        </div>
    );
};

export default Conversion;