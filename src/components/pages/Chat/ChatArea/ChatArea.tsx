// Updated ChatArea with ChatDescription inside scrollable area
"use client";

import React from "react";
import styles from "./ChatArea.module.scss";
import ChatSplash from "@/svgs/Images/ChatSplash";
import ChatHeader from "./ChatHeader";
import ChatDescription from "./ChatDescription";
import ChatMessagesList from "./ChatMessageList";
import useStore  from "@/store";

interface ChatAreaProps {
  children?: React.ReactNode;
}

const ChatArea: React.FC<ChatAreaProps> = () => {
  const { currentChannel } = useStore();

  // Sample messages data
  const getSampleMessages = (channelId: string) => {
    const messageData = {
      'log-rocket-group': [
        {
          id: '1',
          avatar: '/images/profile.jpg',
          username: 'Muhammad Salman',
          timestamp: '09:53am',
          message: 'The Roxanna log rocket explains why we really need to consolidate and move to a single search bar. Its imperative for us to go to a single search bar experience where everything just shows in a single search bar experience. Good Work! @Imamtariq',
          mentions: ['Imamtariq']
        },
        {
          id: '2',
          avatar: '/images/profile.jpg',
          username: 'Ashir Manzoor',
          timestamp: '09:57am',
          message: 'Following up on these tickets.',
          mentions: []
        }
      ],
      'hr-team': [
        {
          id: '1',
          avatar: '/images/profile.jpg',
          username: 'Sarah Johnson',
          timestamp: '10:30am',
          message: 'Team meeting scheduled for tomorrow at 2 PM.',
          mentions: []
        }
      ],
      'recruitment': [
        {
          id: '1',
          avatar: '/images/profile.jpg',
          username: 'Mike Davis',
          timestamp: '11:15am',
          message: 'The Roxanna log rocket explains why we really need to consolidate and move to a single search bar. Its imperative for us to go to a single search bar experience where everything just shows in a single search bar experience. Good Work! @Imamtariq',
          mentions: ['Imamtariq']   
        },
        {
          id: '2',
          avatar: '/images/profile.jpg',
          username: 'Mike Davis',
          timestamp: '11:15am',
          message: 'The Roxanna log rocket explains why we really need to consolidate and move to a single search bar. Its imperative for us to go to a single search bar experience where everything just shows in a single search bar experience. Good Work! @Imamtariq',
          mentions: ['Imamtariq']   
        },
        {
          id: '3',
          avatar: '/images/profile.jpg',
          username: 'Mike Davis',
          timestamp: '11:15am',
          message: 'The Roxanna log rocket explains why we really need to consolidate and move to a single search bar. Its imperative for us to go to a single search bar experience where everything just shows in a single search bar experience. Good Work! @Imamtariq',
          mentions: ['Imamtariq']   
        },
        {
          id: '4',
          avatar: '/images/profile.jpg',
          username: 'Mike Davis',
          timestamp: '11:15am',
          message: 'The Roxanna log rocket explains why we really need to consolidate and move to a single search bar. Its imperative for us to go to a single search bar experience where everything just shows in a single search bar experience. Good Work! @Imamtariq',
          mentions: ['Imamtariq']   
        },
        {
          id: '5',
          avatar: '/images/profile.jpg',
          username: 'Mike Davis',
          timestamp: '11:15am',
          message: 'The Roxanna log rocket explains why we really need to consolidate and move to a single search bar. Its imperative for us to go to a single search bar experience where everything just shows in a single search bar experience. Good Work! @Imamtariq',
          mentions: ['Imamtariq']   
        },
        {
          id: '6',
          avatar: '/images/profile.jpg',
          username: 'Mike Davis',
          timestamp: '11:15am',
          message: 'The Roxanna log rocket explains why we really need to consolidate and move to a single search bar. Its imperative for us to go to a single search bar experience where everything just shows in a single search bar experience. Good Work! @Imamtariq',
          mentions: ['Imamtariq']   
        },
        {
          id: '7',
          avatar: '/images/profile.jpg',
          username: 'Mike Davis',
          timestamp: '11:15am',
          message: 'The Roxanna log rocket explains why we really need to consolidate and move to a single search bar. Its imperative for us to go to a single search bar experience where everything just shows in a single search bar experience. Good Work! @Imamtariq',
          mentions: ['Imamtariq']   
        },
      ]
    };
    
    return messageData[channelId as keyof typeof messageData] || [];
  };

  // Sample data - replace with your actual data
  const getChannelData = (channelId: string) => {
    const channelData = {
      'hr-team': {
        name: 'HR Team',
        memberCount: 12,
        memberAvatars: ['/images/profile.jpg', '/images/profile.jpg', '/images/profile.jpg', '/images/profile.jpg'],
        creatorName: 'Sarah Johnson',
        createdDate: 'March 15th',
        description: 'This is the very beginning of the HR Team'
      },
      'recruitment': {
        name: 'Recruitment',
        memberCount: 8,
        memberAvatars: ['/images/profile.jpg', '/images/profile.jpg', '/images/profile.jpg'],
        creatorName: 'Mike Davis',
        createdDate: 'February 22nd',
        description: 'This is the very beginning of the Recruitment'
      },
      'management': {
        name: 'Management',
        memberCount: 5,
        memberAvatars: ['/images/profile.jpg', '/images/profile.jpg'],
        creatorName: 'Emma Wilson',
        createdDate: 'January 10th',
        description: 'This is the very beginning of the Management'
      },
      'general': {
        name: 'General',
        memberCount: 25,
        memberAvatars: ['/images/profile.jpg', '/images/profile.jpg', '/images/profile.jpg', '/images/profile.jpg'],
        creatorName: 'John Doe',
        createdDate: 'December 1st',
        description: 'This is the very beginning of the General'
      },
      'log-rocket-group': {
        name: 'Log Rocket Group',
        memberCount: 9,
        memberAvatars: ['/images/profile.jpg', '/images/profile.jpg', '/images/profile.jpg', '/images/profile.jpg'],
        creatorName: 'Fahad Jalal',
        createdDate: 'January 3rd',
        description: 'This is the very beginning of the Log Rocket Group'
      }
    };
    
    return channelData[channelId as keyof typeof channelData] || {
      name: channelId,
      memberCount: 0,
      memberAvatars: [],
      creatorName: 'Unknown',
      createdDate: 'Unknown',
      description: ''
    };
  };

  const channelData = currentChannel ? getChannelData(currentChannel) : null;
  const messages = currentChannel
    ? getSampleMessages(currentChannel).map((msg) => ({
        ...msg,
        displayName: msg.username,
        senderId: msg.id,
        content: msg.message,
        read: true,
        type: "group" as const // or "dm" as "dm" if appropriate
      }))
    : [];

  return (
    <div className={styles.chatArea}>
      {/* Header stays fixed at top */}
      {currentChannel && channelData && (
        <ChatHeader
          channelName={channelData.name}
          memberCount={channelData.memberCount}
          memberAvatars={channelData.memberAvatars}
        />
      )}

      {/* Scrollable content area */}
      <div className={styles.messagesContainer}>
        {currentChannel && channelData ? (
          <div className={styles.scrollableContent}>
            {/* Description at the top of scrollable area */}
            <ChatDescription
              creatorName={channelData.creatorName}
              createdDate={channelData.createdDate}
              groupName={channelData.name}
              description={channelData.description}
            />
            
            {/* Messages below description */}
            {messages.length > 0 ? (
              <ChatMessagesList messages={messages} />
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
            <p className={styles.description}>Your journey with pulse begins here!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatArea;