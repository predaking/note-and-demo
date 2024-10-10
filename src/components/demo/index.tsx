import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Button, message } from "antd";
import { request } from "@/service";
import classnames from "classnames";
import styles from "./index.styl";

const cx = classnames.bind(styles);

const source = 'https://guonei-cos.koocdn.com/32/2024/05/27/e4adb87a0d6c453b87d48c451dcd8647.png';
const source1 = 'https://guonei-cos.koocdn.com/32/2024/05/27/1a8494eac13b49788f5ce1184c63c8fb.png';
const source2 = 'https://guonei-cos.koocdn.com/32/2024/05/27/94f5113562474d8f8428caded567f0da.png?imageMogr2/thumbnail/100x'

const Demo = () => {
    const [viewportWidth, setViewportWidth] = useState(window.innerWidth);
    useEffect(() => {
        const handleResize = () => {
            console.log('resize');
            setViewportWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);
    return (
        <div className={cx('demo')}>
            <img
                srcSet={`${source2} 100w, ${source1} 556w`}
                sizes="(max-width: 500px) 100px, 556px"
                src={source}
            />
        </div>
    )
};

export default Demo;