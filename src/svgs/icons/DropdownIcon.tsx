import React from "react";

const DropdownIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg
        width="15"
        height="8"
        viewBox="0 0 15 8"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ marginLeft: 4, verticalAlign: 'middle' }}
        {...props}
    >
        <path
            d="M1.5 1L7.5 7L13.5 1"
            stroke="#06334D"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

export default DropdownIcon;