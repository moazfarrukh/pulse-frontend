import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import styles from "./GroupItem.module.scss";
import { ChatWithMembers } from "@/types";
import useSocket from "@/hooks/useSocket";
import SocketEvents from "@/constants/socketEvents";
import { useQueryClient } from "@tanstack/react-query";
import { useChatStore, useUIStore } from "@/store";
import { XIcon } from "@/svgs/icons";

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
  const [showDropdown, setShowDropdown] = useState(false);
  const [showLeaveDialog, setShowLeaveDialog] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const moreButtonRef = useRef<HTMLButtonElement>(null);

  const itemClasses = [
    styles.groupItem,
    active ? styles.active : "",
    className
  ].filter(Boolean).join(" ");

  const { setChatTab, chatTab } = useUIStore();
  const { currentChannel, setCurrentChannel } = useChatStore();
  const socket = useSocket();
  const queryClient = useQueryClient();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        moreButtonRef.current &&
        !moreButtonRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleClick = (e: React.MouseEvent) => {
    // Don't trigger group selection if clicking on action buttons
    if ((e.target as HTMLElement).closest('[data-action-button]')) {
      return;
    }
    
    if (chatTab !== "chat") {
      setChatTab("chat");
    }
    onClick?.();
  };

  const handleMoreClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDropdown(!showDropdown);
  };

  const handleQuickLeave = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowLeaveDialog(true);
  };

  const handleLeaveFromDropdown = () => {
    setShowDropdown(false);
    setShowLeaveDialog(true);
  };

  const handleConfirmLeave = () => {
    socket?.emit(SocketEvents.ON_LEAVE_CHAT, {
      chat_id: group.id,
    });
    
    queryClient.invalidateQueries({ queryKey: ["chats"] });
    queryClient.invalidateQueries({ queryKey: ["chatMembers"] });
    
    if (currentChannel === String(group.id)) {
      setCurrentChannel(null);
    }
    
    setShowLeaveDialog(false);
    onLeaveGroup?.();
  };

  const handleCancelLeave = () => {
    setShowLeaveDialog(false);
  };

  return (
    <>
      <div className={itemClasses} onClick={handleClick}>
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
        
        {(
          <button
            className={styles.quickLeave}
            onClick={handleQuickLeave}
            data-action-button
            title="Leave chat"
            type="button"
          >
            <XIcon/>
          </button>
        )}
        
        {/* More options button */}
        <button
          ref={moreButtonRef}
          className={styles.moreButton}
          onClick={handleMoreClick}
          data-action-button
          title="More options"
          type="button"
        >
          ⋯
        </button>

        {/* Dropdown menu */}
        {showDropdown && (
          <div ref={dropdownRef} className={styles.dropdown}>
            {group.is_group ? (
              <>
                <div 
                  className={styles.dropdownItemDanger}
                  onClick={handleLeaveFromDropdown}
                >
                  <span className="icon">🚪</span>
                  Leave Group
                </div>
              </>
            ) : (
              <>
                <div 
                  className={styles.dropdownItemDanger}
                  onClick={handleLeaveFromDropdown}
                >
                  <span className="icon"><XIcon/></span>
                  Close Chat
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {showLeaveDialog && (
        <div className={styles.dialogOverlay} onClick={handleCancelLeave}>
          <div 
            className={styles.dialogBox} 
            onClick={(e) => e.stopPropagation()}
          >

            <h3 className={styles.dialogTitle}>
              {group.is_group ? "Leave Group" : "Close Chat"}
            </h3>
            
            <p className={styles.dialogText}>
              {group.is_group 
                ? `Are you sure you want to leave "${group.name}"? You'll need to be re-join to participate again.`
                : `Are you sure you want to close your chat with "${group.name}"? You can always start a new conversation later.`
              }
            </p>
            
            <div className={styles.dialogActions}>
              <button 
                className={styles.cancelBtn} 
                onClick={handleCancelLeave}
                type="button"
              >
                Cancel
              </button>
              <button 
                className={styles.leaveBtn} 
                onClick={handleConfirmLeave}
                type="button"
              >
                {group.is_group ? "Leave Group" : "Close Chat"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GroupItem;