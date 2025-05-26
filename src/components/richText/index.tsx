import { 
    forwardRef, 
    useEffect, 
    useRef,
    MouseEvent,
} from 'react';
import { PictureOutlined, FileOutlined, AudioOutlined } from '@ant-design/icons';
import { message } from 'antd';
import styles from './index.module.scss';

const MAX_IMAGE_SIZE = 10;
const MAX_IMAGE_COUNTS = 9;

interface RichTextOptions {
    maxImageCounts?: number;
    maxImageSize?: number;
    maxFileCounts?: number;
    maxAudioCounts?: number;
    maxVideoCounts?: number;
}

interface RichTextProps {
    className?: string;
    placeholder?: string;
    value?: string;
    editable?: boolean;
    onChange?: (value: string) => void;
    options?: RichTextOptions;
}

const RichText = forwardRef<RichTextProps>(({
    className = '',
    placeholder = '请输入...',
    value = '',
    editable = true,
    onChange = () => {},
    options = {
        maxImageCounts: MAX_IMAGE_COUNTS,
        maxImageSize: MAX_IMAGE_SIZE,
    },
}: RichTextProps, ref: any) => {
    const contentRef = useRef<HTMLDivElement>(null);
    const observerRef = useRef<MutationObserver | null>(null);
    const rangeRef = useRef<any>(null);
    const fileRef = useRef<HTMLInputElement>(null);
    const saverRef = useRef<number | null>(null);

    /**
     * @description 监听内容变化
     * @param mutations 
     */
    const handleMutations = (mutations: MutationRecord[]) => {
        if (saverRef.current) {
            clearTimeout(saverRef.current);
        }
        // mutations.forEach((mutation) => {
        //     Array.from(mutation.addedNodes).forEach((node: Node) => {
        //         if (node instanceof Element && node.nodeName === 'BR') {
        //             node.remove();
        //         }
        //     });
        // });
        saverRef.current = setTimeout(() => {
            sessionStorage.setItem('rich-text', contentRef.current!.innerHTML);
            clearTimeout(saverRef.current!);
            saverRef.current = null;
        }, 1000);
    };

    useEffect(() => {
        if (!editable) {
            return;
        }

        observerRef.current?.disconnect();

        observerRef.current = new MutationObserver(handleMutations);
        observerRef.current.observe(contentRef.current!, {
            childList: true,
            subtree: true,
            attributes: true,
            characterData: true,
        });

        return () => {
            observerRef.current?.disconnect();
            saverRef.current && clearTimeout(saverRef.current);
        }
    }, [editable]);

    useEffect(() => {
        const _value = value || sessionStorage.getItem('rich-text') || '';
        if (_value) {
            contentRef.current!.innerHTML = _value;
            initRange();
            contentRef.current!.blur();
        }
    }, [value]);

    /**
     * @description 初始化光标
     */
    const initRange = () => {
        const range = document.createRange();
        const selection = window.getSelection();
        if (selection) {
            selection.removeAllRanges();
            range.selectNodeContents(contentRef.current!);
            range.collapse(false);
            selection.addRange(range);
            rangeRef.current = selection.getRangeAt(0);
        }
    }

    const insertContent = (node: Element) => {
        rangeRef.current.insertNode(node);
        const range = document.createRange();
        range.setStartAfter(node);
        range.collapse(true);
        const selection = window.getSelection();
        if (!selection) {
            return;
        }
        selection.removeAllRanges();
        selection.addRange(range);
        selection.collapseToEnd();
        rangeRef.current = selection.getRangeAt(0);
    }

    /**
     * @description 处理聚焦
     */
    const handleFocus = () => {

    }

    /**
     * @description 处理失去焦点
     */
    const handleBlur = () => {
        rangeRef.current = window.getSelection()?.getRangeAt(0);
    }

    const handleUpload = (e: Event) => {
        const _target = e.target as HTMLInputElement;
        const len = _target.files?.length || 0;

        if (len === 0) {
            return;
        }

        const _maxCounts = options.maxImageCounts || MAX_IMAGE_COUNTS;
        if (len > _maxCounts) {
            message.warning(`最多只能上传${_maxCounts}张图片，多余将被丢弃`);
        }
        
        Array.from(_target.files!).slice(0, _maxCounts).forEach((file) => {
            if (file.size / 1024 / 1024 > (options.maxImageSize || MAX_IMAGE_SIZE)) {
                message.warning(`图片${file.name}大小超过了${options.maxImageSize || MAX_IMAGE_SIZE}M`);
                return;
            }
            const blob = new Blob([file], { type: file.type });
            const blobUrl = URL.createObjectURL(blob);
            const img = document.createElement('img');
            img.src = blobUrl;
            img.alt = file.name;
            img.classList.add('image');
            insertContent(img);
        })
    }

    /**
     * @description 操作点击
     * @param e
     */
    const handleOperationClick = (e: MouseEvent<HTMLDivElement>) => {
        const _target = e.target as Element;
        const clickedTarget = _target.closest('[data-type]') as HTMLElement | null;
        switch (clickedTarget!.dataset.type) {
            case 'pic':
                fileRef.current!.accept = 'image/*';
                fileRef.current!.onchange = handleUpload;
                fileRef.current!.click();
                break;
            case 'file':
                break;
            case 'audio':
                break;
            default:
                break;
        }
    }

    return (
        <div
            className={`${styles.container} ${className}`}
        >
            <div
                ref={contentRef}
                className={styles.content}
                data-placeholder={placeholder}
                contentEditable={editable}
                dangerouslySetInnerHTML={{
                    __html: value,
                }}
                onFocus={handleFocus}
                onBlur={handleBlur}
            />
            <div 
                className={styles.operation}
                onClick={handleOperationClick}
            >
                <PictureOutlined data-type='pic' />
                <FileOutlined data-type='file' />
                <AudioOutlined data-type='audio' />
            </div>
            <div>
                <input 
                    ref={fileRef}
                    type='file' 
                    hidden 
                    data-type='pic' 
                    multiple
                />
            </div>
        </div>
    )
});

export default RichText;