import { useEffect, useRef } from "react";
import config from "@/games/ThreeKingdomsDebate/config";
import { actionTypes } from "@/constant";
import { useGlobalContext } from "@/store";

const { SET_OPEN_LOGIN_MODAL } = actionTypes;

const ThreeKingdomsDebate = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { state, dispatch } = useGlobalContext();
    const { isLogin } = state;
    const ws = useRef<WebSocket | null>(null);

    useEffect(() => {
        let _ws = ws.current;
        const connectWebSocket = () => {
            if (!_ws || _ws.readyState === WebSocket.CLOSED) {
                _ws = new WebSocket('wss://localhost:3000/matching');

                _ws.onopen = () => {
                    console.log('connected');
                };

                _ws.onerror = (err: any) => {
                    console.log('error: ', err, err.message);
                    // 发生错误时尝试重连
                    setTimeout(connectWebSocket, 3000);
                };

                _ws.onclose = () => {
                    console.log('connection closed');
                    // 连接关闭时尝试重连
                    setTimeout(connectWebSocket, 3000);
                };

                _ws.onmessage = (e: any) => {
                    console.log('e: ', e);
                    const _data = JSON.parse(e.data);
                    console.log('_data: ', _data);
                    if (_data.type === 'matched') {

                    }   
                };
            }
        };

        connectWebSocket();

        return () => {
            if (_ws) {
                _ws.close();
            }
        };
    }, []);

    useEffect(() => {
        const _container = containerRef.current;
        const game = new Phaser.Game({
            ...config,
            callbacks: {
                preBoot: (game) => {
                    // 将登录状态注入到游戏实例中
                    game.registry.set('isLogin', isLogin);
                    game.registry.set('login', () => {
                        dispatch({ type: SET_OPEN_LOGIN_MODAL, openLoginModal: true });
                    });
                }
            }
        });

        if (_container && game.canvas) {
            _container.appendChild(game.canvas);
        }

        game.registry.set('isLogin', isLogin);
        console.log('isLogin', isLogin)

        return () => {
            if (_container && game.canvas) {
                _container.removeChild(game.canvas);
            }
        };
    }, [isLogin]);

    return (
        <div id="ThreeKingdomsDebate" ref={containerRef} />
    )
}

export default ThreeKingdomsDebate;