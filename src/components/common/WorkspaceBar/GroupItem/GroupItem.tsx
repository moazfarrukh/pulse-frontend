// GroupItem.tsx - Separate component for group items
import React, { useState } from "react";
import Image from "next/image";
import styles from "./GroupItem.module.scss";
import { ChatWithMembers } from "@/types";
import useSocket from "@/hooks/useSocket";
import SocketEvents from "@/constants/socketEvents";
import { useQueryClient } from "@tanstack/react-query";
import { useUIStore } from "@/store";



interface GroupItemProps {
  group: ChatWithMembers;
  active?: boolean;
  onClick?: () => void;
  className?: string;
  onLeaveGroup?: () => void;
}

const GroupItem: React.FC<GroupItemProps> = ({
  group,
  active = false,
  onClick,
  className = "",
  onLeaveGroup,
}) => {
  const itemClasses = [styles.groupItem, active ? styles.active : "", className]
    .filter(Boolean)
    .join(" ");
  const { setChatTab, chatTab } = useUIStore();

  const [showDialog, setShowDialog] = useState(false);
  
  const socket = useSocket();
  const queryClient = useQueryClient();

  const handleClick = () => {
    if (chatTab !== "chat") {
      setChatTab("chat");
    }
    onClick?.();
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowDialog(true);
  };

  const handleLeave = () => {
    socket?.emit(SocketEvents.ON_LEAVE_CHAT, {
      chat_id: group.id,
    });
    queryClient.invalidateQueries({ queryKey: ["chats"] });
    queryClient.invalidateQueries({ queryKey: ["chatMembers"] });
    setShowDialog(false);
    onLeaveGroup?.();
  };

  return (
    <>
      <div
        className={itemClasses}
        onClick={handleClick}
        onContextMenu={handleContextMenu}
      >
        {group.is_group ? (
          <span className={styles.channelIcon}>#</span>
        ) : (
          <div className={styles.groupAvatar}>
            <Image
              src={group.avatar || "/images/profile.jpg"}
              alt={group.name || "Group Avatar"}
              className={styles.avatarImage}
              width={32}
              height={32}
              unoptimized
            />
          </div>
        )}
        <span className={styles.groupName}>{group.name}</span>
      </div>
      {showDialog && (
        <div className={styles.dialogOverlay}>
          <div className={styles.dialogBox}>
            <p>Are you sure you want to leave <b>{group.name}</b>?</p>
            <div className={styles.dialogActions}>
              <button className={styles.leaveBtn} onClick={handleLeave}>Leave Chat</button>
              <button className={styles.cancelBtn} onClick={() => setShowDialog(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GroupItem;