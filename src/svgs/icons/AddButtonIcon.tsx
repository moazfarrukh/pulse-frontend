import React from "react";

const AddButtonIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg
        width={24}
        height={24}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <rect
            y={24}
            width={24}
            height={24}
            rx={12}
            transform="rotate(-90 0 24)"
            fill="#B7DDF2"
        />
        <path
            d="M12 6V18"
            stroke="#596368"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M6 12H18"
            stroke="#596368"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

export default AddButtonIcon;