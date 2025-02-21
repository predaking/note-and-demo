import { useEffect } from "react";
import { Modal, Form, Input, Button, message } from "antd";
import { post } from "@/service";
import { useGlobalContext } from "@/store";
import { actionTypes } from "@/constant";
import { asyncActions } from "@/store";
import { ResultType } from "@/interface";
import crypto from 'crypto';

import styles from "./index.module.scss";

const { 
    SET_USERINFO, 
    SET_OPEN_LOGIN_MODAL,
    SET_ISLOGIN
} = actionTypes;

const Register = () => {
    const [form] = Form.useForm();
    const { state, dispatch } = useGlobalContext();
    const { openLoginModal } = state;

    useEffect(() => {
        if (location.pathname.includes('/entertainment')) {
            asyncActions.isLogin(dispatch);
        }
    }, []);

    const setOpen = (openLoginModal: boolean) => {
        dispatch({ type: SET_OPEN_LOGIN_MODAL, openLoginModal });
    }

    const generateSalt = () => {
        return crypto.randomBytes(16).toString('hex');
    };

    const hashPassword = (password: string, salt: string) => {
        return crypto.createHash('md5').update(password + salt).digest('hex');
    };

    const encryptData = (data: any) => {
        const salt = generateSalt();
        const hashedPassword = hashPassword(data.password, salt);
        return {
            ...data,
            salt,
            hashedPassword
        };
    }

    const login = () => {
        form.validateFields().then(async (values) => {
            const loginData = encryptData(values);
            const res: ResultType = await post('/login', loginData);
            dispatch({ type: SET_USERINFO, userInfo: res.data });
            dispatch({ type: SET_ISLOGIN, isLogin: true});
            localStorage.setItem('name', values.name);
            message.success('登录成功');
            setOpen(false);
        });
    };

    const register = () => {
        form.validateFields().then(async (values) => {
            const registerData = encryptData(values);
            await post('/register', registerData);
            message.success('注册成功');
        });
    };

    return (
        <Modal
            title="欢迎👏🏻"
            open={openLoginModal}
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