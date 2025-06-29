import React from "react";

const MoreIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg width="24" height="7" viewBox="0 0 24 7" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <circle cx="22" cy="4.5" r="2" transform="rotate(180 22 4.5)" fill="currentColor"/>
        <circle cx="12" cy="4.5" r="2" transform="rotate(180 12 4.5)" fill="currentColor"/>
        <circle cx="2" cy="4.5" r="2" transform="rotate(180 2 4.5)" fill="currentColor"/>
    </svg>
);

export default MoreIcon;