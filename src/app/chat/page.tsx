"use client";
import SearchBar from "@/components/common/SearchBar/SearchBar";
import SideNav from "@/components/common/SideNav/SideNav";
import WorkspaceBar from "@/components/common/WorkspaceBar/WorkspaceBar";
import ChatArea from "@/components/pages/Chat/ChatArea";
import ChatInput from "@/components/pages/Chat/ChatInput/ChatInput";
import CreateChannel from "@/components/pages/Chat/CreateChannel";

import React from "react";
import styles from "./page.module.scss"; // Assuming you have a CSS module for styling
import useStore  from "@/store";
import ProfileModal from "@/components/common/ProfileModal";
import useCurrentUser from "@/hooks/query/useCurrentUser";

const ChatPage: React.FC = () => {
  const { currentChannel, isProfileModalOpen, closeProfileModal, chatTab ,setCurrentUser} = useStore();
  const { data: user } = useCurrentUser();
  React.useEffect(() => {
    if (user) {
      setCurrentUser(user);
    }
  }, [user, setCurrentUser]);

  return (
    <div className={styles.chatPage}>
      <SearchBar />
      <div className={styles.chatContent}>
        {user && <ProfileModal isOpen={isProfileModalOpen} onClose={closeProfileModal} user={user} />}
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

