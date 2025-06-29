"use client";
import React, { useState } from "react";
import styles from "./WorkspaceBar.module.scss";
import { UsersIcon, MessageIcon } from "@/svgs/icons";
import ChevronIcon from "@/svgs/icons/ChevronIcon";
import Section from "./Section";
import GroupItem from "./GroupItem";
import { useChatStore, useUIStore } from "@/store";
import { Chat, ChatTab, ChatWithUser } from "@/types";

interface WorkspaceBarProps {
  groupChats: Chat[];
  dmChats: ChatWithUser[];
}

const WorkspaceBar: React.FC<WorkspaceBarProps> = ({ groupChats, dmChats }) => {
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const { setCurrentChannel, setCurrentChat } = useChatStore();
  const { chatTab, setChatTab } = useUIStore();

  const [groupsExpanded, setGroupsExpanded] = useState(true);
  const [dmsExpanded, setDmsExpanded] = useState(true);

  const handleItemClick = (itemId: string | number, item: Chat) => {
    setActiveItem(String(itemId));
    setCurrentChannel(String(itemId));
    setCurrentChat(item);
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
      <div>
        <div
          className={styles.expandable}
          onClick={() => setGroupsExpanded((prev) => !prev)}
        >
          <ChevronIcon className={groupsExpanded ? styles.chevronDown : styles.chevron} />
          <span>Groups</span>
        </div>
        {groupsExpanded && (
          <div className={styles.expandableContent}>
            {groupChats.length === 0 ? (
              <div className={styles.noChats}>No group chats found.</div>
            ) : (
              groupChats.map((group) => (
                <GroupItem
                  key={group.id}
                  group={group}
                  active={activeItem === String(group.id)}
                  onClick={() => handleItemClick(group.id, group)}
                />
              ))
            )}
          </div>
        )}
      </div>
      <div>
        <div
          className={styles.expandable}
          onClick={() => setDmsExpanded((prev) => !prev)}
        >
          <ChevronIcon className={dmsExpanded ? styles.chevronDown : styles.chevron} />
          <span>Direct Messages</span>
        </div>
        {dmsExpanded && (
          <div className={styles.expandableContent}>
            {dmChats.length === 0 ? (
              <div className={styles.noChats}>No direct messages found.</div>
            ) : (
              dmChats.map((dm) => (
                <GroupItem
                  key={dm.id}
                  group={dm}
                  active={activeItem === String(dm.id)}
                  onClick={() => {
                    handleItemClick(dm.id, dm);
                  }}
                />
              ))
            )}
          </div>
        )}
      </div>
    </aside>
  );
};

export default WorkspaceBar;