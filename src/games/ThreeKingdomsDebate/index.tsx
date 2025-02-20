import { useEffect, useRef } from "react";
import game from "./main";

const ThreeKingdomsDebate = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const _container = containerRef.current;
        if (_container && game.canvas) {
            _container.appendChild(game.canvas);
        }

        return () => {
            if (_container && game.canvas) {
                _container.removeChild(game.canvas);
            }
        };
    }, []);

    return (
        <div id="ThreeKingdomsDebate" ref={containerRef} />
    )
}

export default ThreeKingdomsDebate;