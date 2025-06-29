"use client";
import React, { useEffect, useRef, useCallback, useState } from "react";
import styles from "./ChatArea.module.scss";
import ChatSplash from "@/svgs/Images/ChatSplash";
import ChatHeader from "./ChatHeader";
import { useChatStore, useUserStore } from "@/store";
import { useGetChatMembers, useGetChatMessages } from "@/hooks/query";
import { formatDateString } from "@/utils/date";
import useSocket from "@/hooks/useSocket";
import SocketEvents from "@/constants/socketEvents";
import { useQueryClient } from "@tanstack/react-query";
import { SocketMessage } from "@/types/Message";
import { getTypingText } from "@/utils/typing";
import Image from "next/image";
import ChatMessage from "./ChatMessage";

interface ChatAreaProps {
  children?: React.ReactNode;
  socket: ReturnType<typeof useSocket>;
}

const ChatArea: React.FC<ChatAreaProps> = ({ socket }) => {
  const { currentChannel, currentChat } = useChatStore();
  const { currentUser: user } = useUserStore();
  const { data: messages } = useGetChatMessages(currentChannel || "");
  const { data: members } = useGetChatMembers(currentChannel || "");
  const queryClient = useQueryClient();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollableContainerRef = useRef<HTMLDivElement>(null);
  const [typingUsers, setTypingUsers] = useState<{ user_id: number; display_name: string }[]>([]);
  const typingTimeoutRef = useRef<{ [key: number]: NodeJS.Timeout }>({});

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const scrollToBottomInstant = useCallback(() => {
    if (scrollableContainerRef.current) {
      scrollableContainerRef.current.scrollTop =
        scrollableContainerRef.current.scrollHeight;
    }
  }, []);

  const removeTypingUser = useCallback((userId: number) => {
    setTypingUsers((prev) => {
      const filtered = prev.filter((u) => u.user_id !== userId);
      return filtered;
    });
    if (typingTimeoutRef.current[userId]) {
      clearTimeout(typingTimeoutRef.current[userId]);
      delete typingTimeoutRef.current[userId];
    }
  }, []);

  const addTypingUser = useCallback(
    (userId: number, displayName: string) => {
      setTypingUsers((prev) => {
        const exists = prev.find((u) => u.user_id === userId);
        if (!exists) {
          return [...prev, { user_id: userId, display_name: displayName }];
        }
        return prev;
      });
      
      // Clear existing timeout and set a new one
      if (typingTimeoutRef.current[userId]) {
        clearTimeout(typingTimeoutRef.current[userId]);
      }
      
      // Increased timeout to 5 seconds for smoother experience
      typingTimeoutRef.current[userId] = setTimeout(() => {
        removeTypingUser(userId);
      }, 5000);
    },
    [removeTypingUser]
  );

  useEffect(() => {
    if (messages && messages.length > 0) {
      const timer = setTimeout(scrollToBottom, 100);
      return () => clearTimeout(timer);
    }
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (currentChannel && messages) {
      scrollToBottomInstant();
    }
  }, [currentChannel, messages, scrollToBottomInstant]);

  useEffect(() => {
    setTypingUsers([]);
    Object.values(typingTimeoutRef.current).forEach((timeout) =>
      clearTimeout(timeout)
    );
    typingTimeoutRef.current = {};
  }, [currentChannel]);

  useEffect(() => {
    if (!socket || !currentChannel) return;
    
    const handleNewMessage = (data: SocketMessage) => {
      if (String(data.chat_id) === String(currentChannel)) {  
        queryClient.setQueryData(
          ["chatMessages", currentChannel], 
          (oldData: typeof messages) => {
            if (!oldData) return [data];
            return [...oldData, data];
          }
        );
        
        if (data.sender_id) {
          removeTypingUser(data.sender_id);
        }
      }
    };

    const handleTypingStart = (data: {
      chat_id: number;
      user_id: number;
      user_info: { display_name: string; username: string };
    }) => {
      if (
        data.user_id !== user?.id &&
        String(data.chat_id) === String(currentChannel)
      ) {
        addTypingUser(data.user_id, data.user_info.display_name);
      }
    };

    const handleTypingStop = (data: { chat_id: number; user_id: number }) => {
      if (String(data.chat_id) === String(currentChannel)) {
        removeTypingUser(data.user_id);
      }
    };

    socket.onAny((event, ...args) => {
      console.log(`Socket event received: ${event}`, args);
    });

    const handleUserEntry = (data: { chat_id: number }) => {
      console.log("User entry event received:", data);
      queryClient.invalidateQueries({ queryKey: ["chatMembers"] });
    };

    socket.on(SocketEvents.ON_USER_JOINED, handleUserEntry);
    socket.on(SocketEvents.ON_USER_LEFT, handleUserEntry);
    socket.on(SocketEvents.ON_MESSAGE, handleNewMessage);
    socket.on(SocketEvents.ON_TYPING_START, handleTypingStart);
    socket.on(SocketEvents.ON_TYPING_STOP, handleTypingStop);
    
    return () => {
      console.log("Cleaning up socket listeners in ChatArea");
      socket.off(SocketEvents.ON_MESSAGE, handleNewMessage);
      socket.off(SocketEvents.ON_TYPING_START, handleTypingStart);
      socket.off(SocketEvents.ON_TYPING_STOP, handleTypingStop);
      socket.off(SocketEvents.ON_USER_JOINED, handleUserEntry);
      socket.off(SocketEvents.ON_USER_LEFT, handleUserEntry);
      Object.values(typingTimeoutRef.current).forEach((timeout) =>
        clearTimeout(timeout)
      );
      typingTimeoutRef.current = {};
    };
  }, [
    socket,
    currentChannel,
    user,
    addTypingUser,
    removeTypingUser,
    queryClient,
  ]);

  const memberAvatars =
    members
      ?.map((member) => member.avatar_url || '/images/profile.jpg')
      .filter((url): url is string => url !== undefined) || [];
  const creator = currentChat?.created_by
    ? members?.find((member) => member.id === currentChat.created_by)
    : null;

  const isMember = !!members?.find((member) => member.id === user?.id);

  const handleJoinChat = () => {
    if (!socket || !currentChannel || isMember) return;
    socket.emit(SocketEvents.ON_JOIN_CHAT, currentChannel);
  };

  return (
    <div className={styles.chatArea}>
      {currentChannel && currentChat && (
        <ChatHeader
          channelName={currentChat.name || ""}
          memberCount={members?.length || 0}
          memberAvatars={memberAvatars}
          isMember={isMember}
          onJoinChat={handleJoinChat}
        />
      )}
      <div className={styles.messagesContainer} ref={scrollableContainerRef}>
        {currentChannel && currentChat ? (
          <div className={styles.scrollableContent}>
            <div className={styles.chatDescription}>
              <div className={styles.groupName}>
                {currentChat.is_group ? (
                  <span className={styles.hash}>#</span>
                ) : (
                  <Image
                    src={currentChat.avatar || '/images/profile.jpg'} 
                    alt="User avatar" 
                    className={styles.userAvatar}
                    width={32}
                    height={32}
                  />
                )}
                {currentChat.name || "Unnamed Group"}
              </div>
              <div className={styles.creatorInfo}>
                {currentChat.is_group ? (
                  <>
                    <span className={styles.mention}>@{creator?.display_name}</span>
                    <span className={styles.text}>
                      created this group on{" "}
                      {formatDateString(String(currentChat.created_at))}.
                    </span>
                    <span className={styles.description}>
                      {`This is the very beginning of the ${currentChat.name} group.`}
                    </span>
                  </>
                ) : (
                  <>
                    <span className={styles.text}>
                      This conversation is between{" "}
                      you and{" "}
                      <span className={styles.mention}>
                        @{members?.find(member => member.id !== user?.id)?.display_name}
                      </span>
                    </span>
                  </>
                )}
              </div>
            </div>
            {messages && messages.length > 0 ? (
              <div className={styles.messagesList}>
                {messages.map((msg) => (
                  <ChatMessage key={msg.id} message={msg} />
                ))}
                <div ref={messagesEndRef} />
              </div>
            ) : (
              <div className={styles.noMessages}>
                <p>No messages yet. Start the conversation!</p>
              </div>
            )}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <div className={styles.splashIcon}>
              <ChatSplash width={500} height={500} />
            </div>
            <h1 className={styles.title}>Pulse</h1>
            <h2 className={styles.subtitle}>Connect, Communicate, Create</h2>
            <p className={styles.description}>
              Your journey with pulse begins here!
            </p>
          </div>
        )}
      </div>
      {typingUsers.length > 0 && (
        <div className={styles.typingIndicator}>
          <div className={styles.typingText}>{`${getTypingText(typingUsers)}`}</div>
        </div>
      )}  
    </div>
  );
};

export default ChatArea;