import { useEffect, useRef } from "react";
import config from "@/games/ThreeKingdomsDebate/config";
import { actionTypes } from "@/constant";
import { useGlobalContext } from "@/store";

const { SET_OPEN_LOGIN_MODAL } = actionTypes;

// const wsUrl = 'wss://10.203.81.15:3000/threeKingdomsDebate';
const wsUrl = 'wss://192.168.1.54:3000/threeKingdomsDebate';

const ThreeKingdomsDebate = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { state, dispatch } = useGlobalContext();
    const { isLogin } = state;
    const wsRef = useRef<WebSocket>(null);

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
                    game.registry.set('getWsInstance', () => {
                        let ws = wsRef.current;
                        if (!ws) {
                            ws = new WebSocket(wsUrl);
                        }
                        return ws;
                    })
                }
            }
        });

        if (_container && game.canvas) {
            _container.appendChild(game.canvas);
        }

        game.registry.set('isLogin', isLogin);

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