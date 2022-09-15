import React, { CSSProperties } from "react";
import { NavLink } from "react-router-dom";
import { LinkProps } from "@/common/interface";

const TodoLink: React.FC<LinkProps> = ({ active, children, onClick, filter }) => {

    // const handleClick: any = (e: Event) => {
    //     e.preventDefault();
    //     onClick && onClick();
    // }

    const activeStyle = {
        textDecoration: 'none',
        color: 'black'
    }

    const style = ({ isActive }: { isActive: boolean }) => isActive ? activeStyle : undefined;

    return (
        <NavLink 
            to={filter === 'all' ? '' : filter}
            style={style as CSSProperties | undefined}
        >
            {children}
        </NavLink>
    );
}

export default TodoLink;