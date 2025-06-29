import React, { useState } from "react";
import NavigationItem from "./NavigationItem";
import {HomeIcon} from "@/svgs/icons";
import {NotificationIcon} from "@/svgs/icons";
import MessageIcon from "@/svgs/icons/MessageIcon";
import MoreIcon from "@/svgs/icons/MoreIcon";   
import styles from "./MainNavigation.module.scss";
import { useUIStore } from "@/store";
const MainNavigation: React.FC = () => {

    const { setChatTab,chatTab } = useUIStore();
    const [activeIndex, setActiveIndex] = useState(0);
    const navigationItems = [
        {
            icon: <HomeIcon />,
            onClick: () => {
                if (chatTab !== "chat") {
                    setChatTab("chat");
                }
            },
        },
        {
            icon: <NotificationIcon />,
            href: '/notifications',
        },
        {
            icon: <MessageIcon />,
            onClick: () => {
                if (chatTab !== "chat") {
                    setChatTab("chat");
                }
            },
        },
        {
            label: 'More',
            icon: <MoreIcon />,
            href: '/more',
        },
    ];
    return (
        <div className={styles.mainNavigation}>
            {navigationItems.map((item,index) => {
                const originalOnClick = item.onClick;
                const handleClick = () => {
                    setActiveIndex(index);
                    if (originalOnClick) {
                        originalOnClick();
                    }
                };
                return (
                    <NavigationItem
                        key={index}
                        {...item}
                        isActive={activeIndex === index}
                        onClick={handleClick}
                    />
                );
            })}
        </div>
    );
};

export default MainNavigation;