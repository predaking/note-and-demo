import React, { useState, useEffect } from 'react'
import { Editor, Toolbar } from '@wangeditor/editor-for-react'
import { IDomEditor, IEditorConfig, IToolbarConfig } from '@wangeditor/editor';
import { SlateTransforms } from '@wangeditor/editor';
import html2canvas from 'html2canvas';
import '@wangeditor/editor/dist/css/style.css';

const E = () => {
    // editor 实例
    const [editor, setEditor] = useState<IDomEditor | null>(null)   // TS 语法
    // const [editor, setEditor] = useState(null)                   // JS 语法

    // 编辑器内容
    const [html, setHtml] = useState('')

    // 模拟 ajax 请求，异步设置 html
    useEffect(() => {
        // setTimeout(() => {
        //     setHtml('<p>hello world</p>')
        // }, 1500)
    }, []);

    const handleChange = (e: any) => {
        const files = (e.target as any).files;
        const formData = new FormData();
        formData.append('file', files[0]);
        const node = {
            type: 'image',
            children: [{ text: '' }],
            src: 'https://guonei-cos.koocdn.com/flowrate/2023/10/17/25342efb7c0d4e2791c753fd6d6b3136.png'
        }
        // editor?.insertNode(node);
        // editor?.insertText('text');
        SlateTransforms.insertNodes(editor as any, node, { at: [1] });
        // formUpload('http://localhost:3000/upload', formData);
    }

    // 工具栏配置
    // const toolbarConfig: Partial<IToolbarConfig> = {}  // TS 语法
    // const toolbarConfig = { }                        // JS 语法

    // 编辑器配置
    const editorConfig: Partial<IEditorConfig> = {    // TS 语法
        // const editorConfig = {                         // JS 语法
        placeholder: '请输入内容...',
    }

    const handleClick = () => {
        const node = {
            type: 'image',
            children: [{ text: '' }],
            src: 'https://guonei-cos.koocdn.com/flowrate/2023/10/17/25342efb7c0d4e2791c753fd6d6b3136.png'
        }
        // editor?.insertNode(node);
        // editor?.insertText('text');
        editor?.restoreSelection();
        // editor?.insertNode(node);
        // 插入 img - HTML 格式
        editor?.dangerouslyInsertHtml(`
            <iframe>
                <img src="xxx.png" alt="xxx"/>
                <div>
                    <div>123</div>
                    <div>456</div>
                </div>
            </iframe>
        `);
    }

    useEffect(() => {
        return () => {
            if (editor == null) return
            editor.destroy()
            setEditor(null)
        }
    }, [editor])

    return (
        <>
            <div style={{ border: '1px solid #ccc', zIndex: 100}}>
                {/* <Toolbar
                    editor={editor}
                    defaultConfig={toolbarConfig}
                    mode="default"
                    style={{ borderBottom: '1px solid #ccc' }}
                /> */}
                <Editor
                    defaultConfig={editorConfig}
                    value={html}
                    onCreated={setEditor}
                    onChange={editor => setHtml(editor.getHtml())}
                    mode="default"
                    style={{ height: '500px', overflowY: 'hidden' }}
                />
            </div>
            <input
                name='file'
                type='file'
                accept='*'
                onChange={handleChange} 
            />
            <button onClick={handleClick}>点我</button>
            {/* <div style={{ marginTop: '15px' }}>
                {html}
            </div> */}
        </>
    );
}

export default E;