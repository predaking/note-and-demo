import { forwardRef, useRef } from 'react';
import { PictureOutlined, FileOutlined } from '@ant-design/icons';
import styles from './index.module.scss';

interface RichTextProps {
    className?: string;
    placeholder?: string;
    value?: string;
    editable?: boolean;
    onChange?: (value: string) => void;
}

export interface RichTextRef {
    scrollIntoView: (arg: any) => void;
}

const RichText = forwardRef<RichTextRef, RichTextProps>(({
    className = '',
    placeholder = '请输入...',
    value = '',
    editable = true,
    onChange = () => {},
}: RichTextProps, ref: any) => {
    const contextRef = useRef<HTMLDivElement>(null);

    return (
        <div
            className={`${styles.container} ${className}`}
        >
            <div
                ref={contextRef}
                className={styles.content}
                placeholder={placeholder}
                contentEditable={editable}
                dangerouslySetInnerHTML={{
                    __html: value,
                }}
            />
            <div className={styles.operation}>
                <PictureOutlined className={styles.icon} />
                <FileOutlined className={styles.icon} />
            </div>
        </div>
    )
});

export default RichText;