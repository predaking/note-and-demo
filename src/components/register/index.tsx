import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Button, message } from "antd";
import { get, post } from "@/service";
import { useGlobalContext } from "@/store";
import { actionTypes } from "@/constant";

import styles from "./index.module.scss";

const { SET_USERINFO } = actionTypes;

interface ResultType {
    code: number;
    data: any;
    message: string;
}

const Register = () => {
    const [open, setOpen] = useState<boolean>(false);
    const [form] = Form.useForm();
    const { state, dispatch } = useGlobalContext();
    const { userInfo } = state;

    useEffect(() => {
        if (location.pathname === '/entertainment') {
            isLogin();
        }
    }, []);

    const isLogin = async () => {
        try {
            const res: any = await get('/isLogin');
            dispatch({ type: SET_USERINFO, userInfo: res.data });
            setOpen(false);
        } catch (e) {
            setOpen(true);
        }
    }

    const login = () => {
        form.validateFields().then(async (values) => {
            await post('/login', values);
            localStorage.setItem('name', values.name);
            message.success('登录成功');
            setOpen(false);
        });
    };

    const register = () => {
        form.validateFields().then(async (values) => {
            await post('/register', values);
            message.success('注册成功');
        });
    };

    return (
        <Modal
            title="欢迎👏🏻"
            open={open}
            onCancel={() => setOpen(false)}
            onOk={() => setOpen(false)}
            footer={null}
        >
            <Form
                form={form}
            >
                <Form.Item
                    label="昵称"
                    name="name"
                    rules={[{ required: true, message: '请输入昵称' }]}
                >
                    <Input>{null}</Input>
                </Form.Item>
                <Form.Item
                    label="密码"
                    name="password"
                    rules={[{ required: true, max: 8, message: '请输入密码' }]}
                >
                    <Input type="password">{null}</Input>
                </Form.Item>
                <Form.Item
                >
                    <Button.Group
                        className={styles['btn-group']}
                    >
                        <Button
                            type="primary"
                            onClick={login}
                        >
                            登录
                        </Button>
                        <Button
                            type="primary"
                            onClick={register}
                        >
                            注册
                        </Button>
                    </Button.Group>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default Register;