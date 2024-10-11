import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Button, message } from "antd";
import { request } from "@/service";
import classnames from "classnames";
import styles from "./index.styl";

const cx = classnames.bind(styles);

const Register = () => {
    const [open, setOpen] = useState<boolean>(false);
    const [form] = Form.useForm();

    useEffect(() => {
        isLogin();
    }, []);

    const isLogin = async () => {
        try {
            const res = await request('/isLogin');
            console.log(res);
            setOpen(false);
        } catch (e) {
            setOpen(true);
        }
    }

    const login = () => {
        form.validateFields().then(async (values) => {
            await request('/login', values, 'post');
            localStorage.setItem('name', values.name);
            message.success('登录成功');
            setOpen(false);
        });
    };

    const register = () => {
        form.validateFields().then(async (values) => {
            await request('/register', values, 'post');
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
                    <Input />
                </Form.Item>
                <Form.Item
                    label="密码"
                    name="password"
                    rules={[{ required: true, max: 8, message: '请输入密码' }]}
                >
                    <Input type="password" />
                </Form.Item>
                <Form.Item
                >
                    <Button.Group
                        className={cx('btn-group')}
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