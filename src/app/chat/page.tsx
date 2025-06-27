"use client";
import SearchBar from "@/components/common/SearchBar/SearchBar";
import SideNav from "@/components/common/SideNav/SideNav";
import WorkspaceBar from "@/components/common/WorkspaceBar/WorkspaceBar";
import ChatArea from "@/components/pages/Chat/ChatArea";
import ChatInput from "@/components/pages/Chat/ChatInput/ChatInput";
import CreateChat from "@/components/common/CreateChat";

import React from "react";
import styles from "./page.module.scss"; // Assuming you have a CSS module for styling
import { useChatStore, useUIStore } from "@/store";
import ProfileModal from "@/components/common/ProfileModal";
import useCurrentUser from "@/hooks/query/useCurrentUser";
import useSocket from "@/hooks/useSocket";
import useGetChats from "@/hooks/query/useGetChats";

const ChatPage: React.FC = () => {
  const { isProfileModalOpen, closeProfileModal, chatTab } = useUIStore();
  const { currentChannel } = useChatStore();
  const { data: user } = useCurrentUser();
  const socket = useSocket();

  const [searchQuery, setSearchQuery] = React.useState("");
  const [debouncedQuery, setDebouncedQuery] = React.useState("");
  const { data: chatsData } = useGetChats();
  const groupChats = React.useMemo(
    () => chatsData?.groupChats || [],
    [chatsData?.groupChats]
  );
  const dmChats = React.useMemo(
    () => chatsData?.directChats || [],
    [chatsData?.directChats]
  );

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const filteredGroupChats = React.useMemo(
    () =>
      groupChats.filter((chat) =>
        chat.name?.toLowerCase().includes(debouncedQuery.toLowerCase())
      ),
    [groupChats, debouncedQuery]
  );
  const filteredDmChats = React.useMemo(
    () =>
      dmChats.filter((chat) =>
        chat.name?.toLowerCase().includes(debouncedQuery.toLowerCase())
      ),
    [dmChats, debouncedQuery]
  );

  return (
    <div className={styles.chatPage}>
      <SearchBar
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search chats..."
      />
      <div className={styles.chatContent}>
        {user && (
          <ProfileModal
            isOpen={isProfileModalOpen}
            onClose={closeProfileModal}
            user={user}
          />
        )}
        <SideNav />
        <WorkspaceBar
          groupChats={filteredGroupChats}
          dmChats={filteredDmChats}
        />
        <div className={styles.mainContent}>
          {chatTab === "chat" ? (
            <>
              <ChatArea socket={socket} />
              {currentChannel && (
                <div className={styles.inputContainer}>
                  <ChatInput socket={socket} />
                </div>
              )}
            </>
          ) : (
            <CreateChat type={chatTab === "group_create" ? "group" : "dm"} />
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
