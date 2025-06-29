import React from "react";

const HomeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg
        width="26"
        height="29"
        viewBox="0 0 26 29"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <path
            d="M1 10.2399L13 1L25 10.2399V24.7599C25 25.46 24.719 26.1315 24.219 26.6266C23.7189 27.1217 23.0406 27.3998 22.3333 27.3998H3.66667C2.95942 27.3998 2.28115 27.1217 1.78105 26.6266C1.28095 26.1315 1 25.46 1 24.7599V10.2399Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M9 27.4001V14.2002H17V27.4001"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

export default HomeIcon;