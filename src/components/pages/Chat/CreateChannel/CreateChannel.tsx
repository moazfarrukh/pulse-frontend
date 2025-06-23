import React, { useState } from "react";
import styles from "./CreateChannel.module.scss";
import CreateGroupModal from "./CreateGroupModal";

export interface CreateChannelProps {
  type?: "group" | "dm";
}

const groups = [
  "Log Rocket Group",
  "Random",
  "HR",
  "General",
  "Qlu Daily Updates"
];

const dms = [
  "Alice",
  "Bob",
  "Charlie",
  "David",
  "Eve"
];

const CreateChannel: React.FC<CreateChannelProps> = ({ type = "group" }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const items = type === "group" ? groups : dms;

  const handleCreateGroup = (data: { name?: string; userIds: string[] }) => {
    // For now, just log the group or DM. You can add to state or call an API here.
    console.log(type === "group" ? "Created group:" : "Started DM:", data);
    setIsModalOpen(false);
  };

  return (
    <div className={styles.createChannel}>
      <h4>{type === "group" ? "Groups" : "Direct Messages"}</h4>
      <button className={styles.createButton} onClick={() => setIsModalOpen(true)}>
        + Create New {type === "group" ? "Group" : "DM"}
      </button>
      <div className={styles.groupGrid}>
        {items.map((item) => (
          <div key={item} className={styles.groupCard}>
            <b>{item}</b>
          </div>
        ))}
      </div>
      <CreateGroupModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateGroup}
        type={type}
      />
    </div>
  );
};

export default CreateChannel; 