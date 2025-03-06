import { useEffect } from "react";
import { Modal, Form, Input, Button, message } from "antd";
import { post } from "@/service";
import { useGlobalContext } from "@/store";
import { actionTypes } from "@/constant";
import { asyncActions } from "@/store";
import { ResultType } from "@/interface";

import styles from "./index.module.scss";

const { 
    SET_USERINFO, 
    SET_OPEN_LOGIN_MODAL,
    SET_ISLOGIN,
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

    const generateSalt = async () => {
        const array = new Uint8Array(16);
        crypto.getRandomValues(array);
        return Array.from(array).map(b => b.toString(16).padStart(2, '0')).join('');
    };

    const hashPassword = async (password: string, salt: string) => {
        const encoder = new TextEncoder();
        const data = encoder.encode(password + salt);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    };

    const encryptData = async (data: any) => {
        const salt = await generateSalt();
        const hashedPassword = await hashPassword(data.password, salt);
        console.log('password: ', hashedPassword);
        return {
            ...data,
            salt,
            password: hashedPassword
        };
    }

    const login = () => {
        form.validateFields().then(async (values) => {
            // 先获取用户的salt
            const res: ResultType = await post('/login/salt', { name: values.name });
            if (res.code === 1) {
                message.error(res.msg || '用户不存在');
                return;
            }
            // 使用服务端的salt重新计算密码哈希
            const hashedPassword = await hashPassword(values.password, res.data.salt);
            const loginData = {
                name: values.name,
                password: hashedPassword
            };
            const loginRes: ResultType = await post('/login', loginData);
            if (loginRes.code === 0) {
                dispatch({ type: SET_USERINFO, userInfo: loginRes.data });
                dispatch({ type: SET_ISLOGIN, isLogin: true});
                localStorage.setItem('name', values.name);
                message.success('登录成功');
                setOpen(false);
            } else {
                message.error(loginRes.msg || '登录失败');
            }
        });
    };

    const register = () => {
        form.validateFields().then(async (values) => {
            const registerData = await encryptData(values);
            const res: ResultType = await post('/register', registerData);
            dispatch({ type: SET_USERINFO, userInfo: res.data });
            message.success(res.msg || '注册成功');
            setOpen(false);
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
                    <Input maxLength={8} />
                </Form.Item>
                <Form.Item
                    label="密码"
                    name="password"
                    rules={[{ required: true, message: '请输入密码' }]}
                >
                    <Input type="password" maxLength={8} />
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