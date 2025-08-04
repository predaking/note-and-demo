import { 
    forwardRef, 
    useState,
    useEffect, 
    useRef,
    useCallback,
    useTransition,
    MouseEvent,
    ClipboardEvent,
} from 'react';
import { PictureOutlined, FileOutlined, AudioOutlined } from '@ant-design/icons';
import { message } from 'antd';
import styles from './index.module.scss';

const MAX_IMAGE_SIZE = 10;
const MAX_IMAGE_COUNT = 9;
const MAX_FILE_SIZE = 10;
const MAX_FILE_COUNT = 10;
const MAX_AUDIO_SIZE = 10;
const MAX_AUDIO_COUNT = 5;
const MAX_TEXT_LENGTH = 10000;

interface RichTextOptions {
    maxImageCount?: number;
    maxImageSize?: number;
    maxFileCount?: number;
    maxFileSize?: number;
    maxAudioCount?: number;
    maxVideoCount?: number;
    maxTextLength?: number;
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
        maxImageCount: MAX_IMAGE_COUNT,
        maxImageSize: MAX_IMAGE_SIZE,
        maxFileCount: 0,
        maxTextLength: MAX_TEXT_LENGTH,
    },
}: RichTextProps, ref: any) => {
    const contentRef = useRef<HTMLDivElement>(null);
    const observerRef = useRef<MutationObserver | null>(null);
    const rangeRef = useRef<any>(null);
    const fileRef = useRef<HTMLInputElement>(null);
    const saverRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const lastContentRef = useRef<string>(''); // 缓存上次的内容
    const textLengthRef = useRef<number>(0); // 使用 ref 存储文本长度，避免频繁 setState

    const [textLength, setTextLength] = useState<number>(0);
    const [isPending, startTransition] = useTransition();

    /**
     * @description 高效计算文本长度，过滤掉 contentEditable=false 的元素
     */
    const calculateTextLength = () => {
        if (!contentRef.current) return 0;
        
        let totalLength = 0;
        
        // 使用 TreeWalker 高效遍历所有文本节点
        const walker = document.createTreeWalker(
            contentRef.current,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode: (node) => {
                    // 检查节点的父元素是否设置了 contentEditable=false
                    let parent = node.parentElement;
                    while (parent && parent !== contentRef.current) {
                        if (parent.getAttribute('contenteditable') === 'false') {
                            return NodeFilter.FILTER_REJECT; // 跳过这个节点及其子节点
                        }
                        parent = parent.parentElement;
                    }
                    return NodeFilter.FILTER_ACCEPT;
                }
            }
        );
        
        let textNode;
        while (textNode = walker.nextNode()) {
            const textContent = textNode.textContent?.trim();
            if (textContent) {
                totalLength += textContent.length;
            }
        }
        
        // 更新 ref
        textLengthRef.current = totalLength;
        
        return totalLength;
    };

    /**
     * @description 使用 useTransition 更新字数统计，避免阻塞用户输入
     */
    const updateTextLength = useCallback(() => {
        const newLength = calculateTextLength();
        
        // 使用 startTransition 标记为非紧急更新
        startTransition(() => {
            setTextLength(newLength);
        });
        
        console.log('updateTextLength newLength', newLength);
    }, [startTransition]);

    /**
     * @description 防抖保存内容到 sessionStorage
     */
    const debouncedSaveContent = useCallback(() => {
        if (saverRef.current) {
            clearTimeout(saverRef.current);
        }
        
        saverRef.current = setTimeout(() => {
            if (contentRef.current) {
                const content = contentRef.current.innerHTML;
                sessionStorage.setItem('rich-text', content);
                // onChange(content);
            }
            
            clearTimeout(saverRef.current!);
            saverRef.current = null;
        }, 300);
    }, []);

    /**
     * @description 监听内容变化
     * @param mutations 
     */
    const handleMutations = (mutations: MutationRecord[]) => {
        // 只计算长度但不更新状态，避免打断输入
        calculateTextLength();
        
        // 使用防抖更新状态和保存内容
        updateTextLength();
        debouncedSaveContent();
    };

    useEffect(() => {
        if (!editable) {
            return;
        }

        observerRef.current?.disconnect();

        observerRef.current = new MutationObserver(handleMutations);
        observerRef.current.observe(contentRef.current!, {
            childList: true,      // 监听子节点变化（插入、删除）
            subtree: true,        // 监听所有后代节点
            characterData: true,  // 监听文本内容变化
            // 不监听 attributes，因为 contentEditable 属性变化不需要重新计算字数
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
        }
        initRange();
        contentRef.current!.blur();
        
        // 使用 setTimeout 确保 DOM 完全渲染后再计算文本长度
        setTimeout(() => {
            updateTextLength();
        }, 0);
    }, [value, updateTextLength]);

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

    const insertSpacer = () => {
        const spacer = document.createElement('div'); // 使用零宽空格
        spacer.innerHTML = '<br />';
        insertContent(spacer);
    }

    const insertContent = (node: Element | DocumentFragment) => {
        // 插入主要内容
        rangeRef.current.insertNode(node);
        
        // 更新 Range 位置到插入节点之后
        rangeRef.current.setStartAfter(node);
        rangeRef.current.setEndAfter(node);
        
        // 设置选择范围到文本节点之后
        const range = document.createRange();
        range.setStartAfter(node);
        range.setEndAfter(node);
    
        const selection = window.getSelection();
        if (!selection) {
            return;
        }
        selection.removeAllRanges();
        selection.addRange(range);
        rangeRef.current = range;
        
        // 更新文本长度但不立即更新状态，让 MutationObserver 处理
        calculateTextLength();
    }

    /**
     * @description 处理聚焦
     */
    const handleFocus = () => {
        if (rangeRef.current) {
            const selection = window.getSelection();
            selection?.removeAllRanges();
            selection?.addRange(rangeRef.current);
        }
    };

    /**
     * @description 处理失去焦点
     */
    const handleBlur = () => {
        // Safari 下此处无需操作，rangeRef 已在 selectionchange 时实时同步
    };

    const handleUploadImage = (e: Event) => {
        const _target = e.target as HTMLInputElement;
        const len = _target.files?.length || 0;

        if (len === 0) {
            return;
        }

        const _maxCounts = options.maxImageCount || MAX_IMAGE_COUNT;
        if (len > _maxCounts) {
            message.warning(`最多只能上传${_maxCounts}张图片，多余将被丢弃`);
        }
        
        Array.from(_target.files!).slice(0, _maxCounts).forEach((file) => {
            if (file.size / 1024 / 1024 > (options.maxImageSize || MAX_IMAGE_SIZE)) {
                message.warning(`图片${file.name}大小超过了${options.maxImageSize || MAX_IMAGE_SIZE}M`);
                return;
            }
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                const img = document.createElement('img');
                img.src = reader.result as string;
                img.alt = file.name;
                img.classList.add('image');
                insertSpacer();
                insertContent(img);
                insertSpacer();
            }
        })
    }

    const handleUploadFile = (e: Event) => {
        const _target = e.target as HTMLInputElement;
        const len = _target.files?.length || 0;

        if (len === 0) {
            return;
        }

        const _maxCounts = options.maxFileCount || MAX_FILE_COUNT;
        if (len > _maxCounts) {
            message.warning(`最多只能上传${_maxCounts}个文件，多余将被丢弃`);
        }
        
        Array.from(_target.files!).slice(0, _maxCounts).forEach((file) => {
            const _size = file.size / 1024 / 1024;
            if (_size > (options.maxFileSize || MAX_FILE_SIZE)) {
                message.warning(`文件${file.name}大小超过了${options.maxFileCount || MAX_FILE_SIZE}M`);
                return;
            }
            const suffix = file.name.split('.').pop();
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                // 创建文件组件
                const container = document.createElement('div');
                container.classList.add('file');
                container.contentEditable = 'false';
                container.title = file.name;
                const content = `
                    <img src='//${location.host}/resource/img/project/${suffix}.png' alt='${file.name}' />
                    <div class='info'>
                        <div class='file-name'>${file.name}</div>
                        <div class='file-size'>${_size.toFixed(2)}M</div>
                    </div>
                `;
                container.innerHTML = content;
                insertSpacer();
                insertContent(container);
                insertSpacer();
            }
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
                fileRef.current!.onchange = handleUploadImage;
                fileRef.current!.click();
                break;
            case 'file':
                fileRef.current!.accept = '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx';
                fileRef.current!.onchange = handleUploadFile;
                fileRef.current!.click();
                break;
            case 'audio':
                break;
            default:
                break;
        }
    }

    const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
        // console.log(e.clipboardData.getData('text/html'));
        const editor = contentRef.current;

        if (editor) {
            setTimeout(() => {
                editor.querySelectorAll('.file').forEach(node => {
                    (node as HTMLElement).setAttribute('contentEditable', 'false');
                });
            }, 0);
        }
    };

    useEffect(() => {
        const handleSelectionChange = () => {
            const selection = window.getSelection();
            if (selection && contentRef.current && contentRef.current.contains(selection.anchorNode)) {
                rangeRef.current = selection.rangeCount > 0 ? selection.getRangeAt(0).cloneRange() : null;
            }
        };
        document.addEventListener('selectionchange', handleSelectionChange);
        return () => {
            document.removeEventListener('selectionchange', handleSelectionChange);
        };
    }, []);

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
                // onCompositionStart={}
                onPaste={handlePaste}
            />
            <div 
                className={styles.operation}
                onClick={handleOperationClick}
            >
                <PictureOutlined data-type='pic' />
                <FileOutlined data-type='file' />
                <AudioOutlined data-type='audio' />
            </div>
            <div
                className={`${styles.total} ${isPending ? styles.loading : ''}`}
            >
                {isPending ? '计算中...' : `${textLength}`}/{options.maxTextLength}
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