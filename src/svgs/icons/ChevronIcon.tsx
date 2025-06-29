import React from "react";

const ChevronIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <path
            d="M22.8764 15.1891C23.4295 15.5883 23.4295 16.4117 22.8764 16.8109L13.5852 23.5162C12.9238 23.9935 12 23.521 12 22.7053L12 9.29465C12 8.47905 12.9238 8.00647 13.5852 8.48377L22.8764 15.1891Z"
            fill="currentColor"
        />
    </svg>
);

export default ChevronIcon;