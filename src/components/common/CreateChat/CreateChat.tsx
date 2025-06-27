import React, { useState } from "react";
import styles from "./CreateChat.module.scss";
import CreateGroupModal from "./CreateChatModal";
import useGetUnjoinedChats from "@/hooks/query/useGetUnjoinedChats";
import useSocket from "@/hooks/useSocket";
import SocketEvents from "@/constants/socketEvents";
import  { useUserStore } from "@/store";
import { useQueryClient } from "@tanstack/react-query";

export interface CreateChatProps {
  type?: "group" | "dm";
}

const CreateChat: React.FC<CreateChatProps> = ({
  type: chatType = "group",
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: chats = [] } = useGetUnjoinedChats();
  const socket = useSocket();
  const { currentUser } = useUserStore();
  const queryClient = useQueryClient();
  const groupChats = chats.filter((chat) => chat.is_group === true);

  const handleJoin = (chat_id: number) => {
    if (!socket) return;
    socket.emit(SocketEvents.ON_JOIN_CHAT, { chat_id, user_id: currentUser?.id });
    queryClient.invalidateQueries({ queryKey: ["unjoinedChats"] });
    queryClient.invalidateQueries({ queryKey: ["chats"] });
    
  };

  return (
    <div className={styles.createChannel}>
      <h4>{chatType === "group" ? "Groups" : "Direct Messages"}</h4>
      <button
        className={styles.createButton}
        onClick={() => setIsModalOpen(true)}
      >
        + Create New {chatType === "group" ? "Group" : "DM"}
      </button>
      <div className={styles.groupGrid}>
        {chatType === "group" &&
          groupChats.map((item) => (
            <div key={item.id} className={styles.groupCard}>
              <b>{item.name}</b>
              <button
                className={styles.joinButton}
                onClick={() => handleJoin(item.id)}
              >
                Join
              </button>
            </div>
          ))}
      </div>
      <CreateGroupModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        type={chatType}
      />
    </div>
  );
};

export default CreateChat;
