import React from "react";

const NotificationIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg
        width="22"
        height="24"
        viewBox="0 0 22 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <path
            d="M17.6667 7.74996C17.6667 6.00392 16.9643 4.32939 15.714 3.09475C14.4638 1.86012 12.7681 1.1665 11 1.1665C9.23189 1.1665 7.5362 1.86012 6.28596 3.09475C5.03571 4.32939 4.33333 6.00392 4.33333 7.74996C4.33333 15.4307 1 17.6252 1 17.6252H21C21 17.6252 17.6667 15.4307 17.6667 7.74996Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M12.9222 21.7397C12.7269 22.0723 12.4465 22.3483 12.1091 22.5402C11.7718 22.7321 11.3893 22.8331 11 22.8331C10.6107 22.8331 10.2282 22.7321 9.89084 22.5402C9.55349 22.3483 9.2731 22.0723 9.07776 21.7397"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

export default NotificationIcon;