// GroupItem.tsx - Separate component for group items
import React from "react";
import Image from "next/image";
import styles from "./GroupItem.module.scss";
import useStore from "@/store";
interface GroupItemProps {
  name: string;
  initials?: string;
  avatar?: string;
  active?: boolean;
  onClick?: () => void;
  isChannel?: boolean;
  className?: string;
}

const GroupItem: React.FC<GroupItemProps> = ({
  name,
  avatar,
  active = false,
  onClick,
  isChannel,
  className = "",
}) => {
  const itemClasses = [styles.groupItem, active ? styles.active : "", className]
    .filter(Boolean)
    .join(" ");
  const { setChatTab,chatTab } = useStore();

  const handleClick = () => {
    if (chatTab !== "chat") {
      setChatTab("chat");
    }
    onClick?.();
  };

  return (
    <div className={itemClasses} onClick={handleClick}>
      {isChannel ? (
        <span className={styles.channelIcon}>#</span>
      ) : (
        <div className={styles.groupAvatar}>
          <Image
            src={avatar || "/images/profile.jpg"}
            alt={name}
            className={styles.avatarImage}
            width={32}
            height={32}
            unoptimized
          />
        </div>
      )}
      <span className={styles.groupName}>{name}</span>
    </div>
  );
};

export default GroupItem;