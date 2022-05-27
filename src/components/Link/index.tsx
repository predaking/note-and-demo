import React from "react";

import { LinkProps } from "@/common/interface";

const Link: React.FC<LinkProps> = ({ active, children, onClick }) => {
    if (active) {
        return <span>{children}</span>
    }

    const handleClick: any = (e: Event) => {
        e.preventDefault();
        onClick && onClick();
    }

    return (
        <a
            href=""
            onClick={handleClick}
        >
            {children}
        </a>
    );
}

export default Link;