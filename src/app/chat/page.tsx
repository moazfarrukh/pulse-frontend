"use client";
import SearchBar from "@/components/pages/Chat/SearchBar/SearchBar";
import SideNav from "@/components/pages/Chat/SideNav/SideNav";
import WorkspaceBar from "@/components/pages/Chat/WorkspaceBar/WorkspaceBar";
import ChatArea from "@/components/pages/Chat/ChatArea";
import ChatInput from "@/components/pages/Chat/ChatInput/ChatInput";
import CreateChannel from "@/components/pages/Chat/CreateChannel";

import React from "react";
import styles from "./page.module.scss"; // Assuming you have a CSS module for styling
import useStore  from "@/store";
import ProfileModal from "@/components/pages/Chat/ProfileModal";

const ChatPage: React.FC = () => {
  const { currentChannel, isProfileModalOpen, closeProfileModal, chatTab } = useStore();
  // Dummy user for demonstration
  const user = {
    id: "1",
    name: "Muhammad Salman",
    email: "m.salman@qlu.ai",
    
    displayName: "Muhammad Salman",
    username: "msalman.qlu123",
  };

  return (
    <div className={styles.chatPage}>
      <SearchBar />
      <div className={styles.chatContent}>
        <ProfileModal isOpen={isProfileModalOpen} onClose={closeProfileModal} user={user} />
        <SideNav />
        <WorkspaceBar />
        <div className={styles.mainContent}>
          {chatTab === "chat" ? (
            <>
          <ChatArea />
          {currentChannel && (
            <div className={styles.inputContainer}>
              <ChatInput />
            </div>
              )}
            </>
          ) : (
            <CreateChannel type={chatTab === "group_create" ? "group" : "dm"} />
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
