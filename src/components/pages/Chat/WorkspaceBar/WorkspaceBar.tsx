"use client";
import React, { useState } from "react";
import styles from "./WorkspaceBar.module.scss";
import { UsersIcon, MessageIcon } from "@/svgs/Icons";
import Expandable from "./Expandable";
import Section from "./Section";
import GroupItem from "./GroupItem";
import useStore from "@/store";
import { ChatTab } from "@/types";

const WorkspaceBar = () => {
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const { setCurrentChannel, setChatTab, chatTab } = useStore();

  // Sample groups data
  const groups = [
    { id: 'hr-team', name: 'HR Team', avatar: '/images/profile.jpg' },
    { id: 'recruitment', name: 'Recruitment', avatar: '/images/profile.jpg' },
    { id: 'management', name: 'Management', avatar: '/images/profile.jpg' },
    { id: 'general', name: 'General', avatar: '/images/profile.jpg' },
  ];


  // Sample direct messages data
  const directMessages = [
    { id: 'john-doe', name: 'John Doe', avatar: '/images/profile.jpg' },
    { id: 'sarah-smith', name: 'Sarah Smith', avatar: '/images/profile.jpg' },
    { id: 'mike-johnson', name: 'Mike Johnson', avatar: '/images/profile.jpg' },
    { id: 'emma-wilson', name: 'Emma Wilson', avatar: '/images/profile.jpg' },
    { id: 'david-brown', name: 'David Brown', avatar: '/images/profile.jpg' },
  ];

  const handleItemClick = (itemId: string) => {
    setActiveItem(itemId);
    setCurrentChannel(itemId);

  };

  const handleTabChange = (tab: ChatTab) => {
    setChatTab(tab);
  };

  return (
    <aside className={styles.workspaceBar}>
      <div className={styles.header}>QLU Recruiting</div>
      
      <Section 
        icon={<UsersIcon />} 
        label="Groups" 
        active={chatTab === "group_create"}
        onClick={() => handleTabChange("group_create")}
      />
      <Section 
        icon={<MessageIcon />} 
        label="Direct Messages" 
        active={chatTab === "dm_create"}
        onClick={() => handleTabChange("dm_create")}
      />
      
      <Expandable label="Groups" defaultExpanded={true}>
        {groups.map((group) => (
          <GroupItem
            key={group.id}
            name={group.name}
            active={activeItem === group.id}
            onClick={() => handleItemClick(group.id)}
            isChannel={true}
          />
        ))}
      </Expandable>
      
      <Expandable label="Direct Messages" defaultExpanded={false}>
        {directMessages.map((dm) => (
          <GroupItem
            key={dm.id}
            name={dm.name}
            avatar={dm.avatar}
            active={activeItem === dm.id}
            onClick={() => handleItemClick(dm.id)}
          />
        ))}
      </Expandable>
    </aside>
  );
};

export default WorkspaceBar;