"use client";

import React, { useState, useEffect, useRef } from "react";
import styles from "./ChatInput.module.scss";
import { useChatStore, useUserStore } from "@/store";
import SocketEvents from "@/constants/socketEvents";
import useSocket from "@/hooks/useSocket";
import IconButton from "@/components/common/IconButton";
import { AddButtonIcon,  BIcon, CodeIcon, ItalicIcon, LinkIcon, ListIcon, MicIcon, SendIcon, VideoIcon } from "@/svgs/icons";
import VerticalSeperator from "@/components/common/VerticalSeperator";
import { MessagePayload } from "@/types/Message";
import Image from "next/image";
import PdfFileIcon from "@/svgs/icons/PdfFileIcon";
import VideoFileIcon from "@/svgs/icons/VideoFileIcon";
import DocFileIcon from "@/svgs/icons/DocFileIcon";
import GenericFileIcon from "@/svgs/icons/GenericFileIcon";

interface ChatInputProps {
  socket: ReturnType<typeof useSocket>;
}

const ChatInput: React.FC<ChatInputProps> = ({ socket }) => {
  const { currentChat } = useChatStore();
  const { currentUser: user } = useUserStore();
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isVideoRecording, setIsVideoRecording] = useState(false);
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const videoRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const videoChunksRef = useRef<Blob[]>([]);
  const videoPreviewRef = useRef<HTMLVideoElement | null>(null);
  
  // Function to handle attachment removal
  const handleRemoveAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  // Function to get preview for file
  const getFilePreview = (file: File) => {
    if (file.type.startsWith('image/')) {
      return URL.createObjectURL(file);
    }
    if (file.type.startsWith('video/')) {
      return <VideoFileIcon />;
    }
    if (file.type.includes('pdf')) {
      return <PdfFileIcon />;
    }
    if (file.type.includes('document') || file.name.endsWith('.doc') || file.name.endsWith('.docx')) {
      return <DocFileIcon />;
    }
      
    
    return <GenericFileIcon />;
  };

  // Text formatting handlers
  const getSelectedText = () => {
    if (!textAreaRef.current) return "";
    const { selectionStart, selectionEnd } = textAreaRef.current;
    if (selectionStart === null || selectionEnd === null) return "";
    return message.substring(selectionStart, selectionEnd);
  };

  const isTextBold = () => {
    const selectedText = getSelectedText();
    return selectedText.startsWith('**') && selectedText.endsWith('**');
  };

  const isTextItalic = () => {
    const selectedText = getSelectedText();
    return selectedText.startsWith('*') && selectedText.endsWith('*') && !selectedText.startsWith('**');
  };

  const isTextCode = () => {
    const selectedText = getSelectedText();
    return selectedText.startsWith('`') && selectedText.endsWith('`');
  };

  const isTextLink = () => {
    const selectedText = getSelectedText();
    return selectedText.startsWith('[') && selectedText.includes('](') && selectedText.endsWith(')');
  };

  const isTextList = () => {
    const selectedText = getSelectedText();
    return /^(\s*)([-*]\s+)(.+)$/gm.test(selectedText);
  };

  const applyFormatting = (format: 'bold' | 'italic' | 'code' | 'link' | 'list') => {
    if (!textAreaRef.current) return;
    
    const { selectionStart, selectionEnd } = textAreaRef.current;
    if (selectionStart === null || selectionEnd === null) return;
    
    const selectedText = message.substring(selectionStart, selectionEnd);
    
    if (!selectedText) return;
    
    let formattedText = "";
    let newCursorPos = selectionStart;
    
    switch (format) {
      case 'bold':
        if (isTextBold()) {
          // Remove bold formatting
          formattedText = selectedText.slice(2, -2);
          newCursorPos = selectionStart;
        } else {
          // Add bold formatting
          formattedText = `**${selectedText}**`;
          newCursorPos = selectionStart + 2;
        }
        break;
      case 'italic':
        if (isTextItalic()) {
          // Remove italic formatting
          formattedText = selectedText.slice(1, -1);
          newCursorPos = selectionStart;
        } else {
          // Add italic formatting
          formattedText = `*${selectedText}*`;
          newCursorPos = selectionStart + 1;
        }
        break;
      case 'code':
        if (isTextCode()) {
          // Remove code formatting
          formattedText = selectedText.slice(1, -1);
          newCursorPos = selectionStart;
        } else {
          // Add code formatting
          formattedText = `\`${selectedText}\``;
          newCursorPos = selectionStart + 1;
        }
        break;
      case 'link':
        if (isTextLink()) {
          // Remove link formatting - extract just the text
          const linkMatch = selectedText.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
          if (linkMatch) {
            formattedText = linkMatch[1];
            newCursorPos = selectionStart;
          } else {
            formattedText = selectedText;
          }
        } else {
          // Add link formatting - prompt for URL
          const url = prompt('Enter URL:');
          if (url) {
            formattedText = `[${selectedText}](${url})`;
            newCursorPos = selectionStart + selectedText.length + 3; // Position after the text
          } else {
            return; // User cancelled
          }
        }
        break;
      case 'list':
        if (isTextList()) {
          // Remove list formatting
          const lines = selectedText.split('\n');
          const unformattedLines = lines.map(line => {
            const match = line.match(/^(\s*)([-*]\s+)(.+)$/);
            return match ? match[3] : line;
          });
          formattedText = unformattedLines.join('\n');
          newCursorPos = selectionStart;
        } else {
          // Add list formatting
          const lines = selectedText.split('\n');
          const formattedLines = lines.map(line => {
            if (line.trim()) {
              return `- ${line.trim()}`;
            }
            return line;
          });
          formattedText = formattedLines.join('\n');
          newCursorPos = selectionStart + 2; // Position after the dash
        }
        break;
    }
    
    const newMessage = 
      message.substring(0, selectionStart) + 
      formattedText + 
      message.substring(selectionEnd);
    
    setMessage(newMessage);
    
    // Set cursor position after formatting
    setTimeout(() => {
      if (textAreaRef.current) {
        textAreaRef.current.focus();
        textAreaRef.current.setSelectionRange(
          newCursorPos, 
          newCursorPos + formattedText.length
        );
      }
    }, 0);
  };

  const handleBoldClick = () => {
    applyFormatting('bold');
  };

  const handleItalicClick = () => {
    applyFormatting('italic');
  };

  const handleConsoleClick = () => {
    applyFormatting('code');
  };

  const handleLinkClick = () => {
    applyFormatting('link');
  };

  const handleListClick = () => {
    applyFormatting('list');
  };

  // Improved typing handlers
  const startTyping = () => {
    if (!socket || !currentChat?.id || !user?.id || isTyping) return;
    
    setIsTyping(true);
    socket.emit(SocketEvents.ON_TYPING_START, {
      chat_id: currentChat.id,
      user_id: user.id
    });
  };

  const stopTyping = () => {
    if (!socket || !currentChat?.id || !user?.id || !isTyping) return;
    
    setIsTyping(false);
    socket.emit(SocketEvents.ON_TYPING_STOP, {
      chat_id: currentChat.id,
      user_id: user.id
    });
  };

  // Improved message input handler with debounced typing
  const handleMessageChange = (value: string) => {
    setMessage(value);

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    if (value.trim().length > 0) {
      // Start typing if not already typing
      if (!isTyping) {
        startTyping();
      }
      
      // Set timeout to stop typing after 2 seconds of inactivity
      typingTimeoutRef.current = setTimeout(() => {
        stopTyping();
      }, 2000);
    } else {
      // Stop typing immediately if input is empty
      if (isTyping) {
        stopTyping();
      }
    }
  };

  // Voice recording handlers
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioFile = new File([audioBlob], `voice-message-${Date.now()}.webm`, {
          type: 'audio/webm'
        });
        
        setAttachments(prev => [...prev, audioFile]);
        setIsRecording(false);
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Could not access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
    }
  };

  const handleMicButtonClick = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  // Video recording handlers
  const startVideoRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }, 
        audio: true 
      });
      
      // Store the stream for preview
      setVideoStream(stream);
      
      // Set up video preview after a short delay to ensure DOM is ready
      setTimeout(() => {
        if (videoPreviewRef.current && stream) {
          videoPreviewRef.current.srcObject = stream;
          videoPreviewRef.current.play().catch(error => {
            console.log('Video preview play error (expected):', error);
          });
        }
      }, 100);
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp9,opus'
      });
      
      videoRecorderRef.current = mediaRecorder;
      videoChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          videoChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const videoBlob = new Blob(videoChunksRef.current, { type: 'video/webm' });
        const videoFile = new File([videoBlob], `video-message-${Date.now()}.webm`, {
          type: 'video/webm'
        });
        
        setAttachments(prev => [...prev, videoFile]);
        setIsVideoRecording(false);
        setVideoStream(null);
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorder.start();
      setIsVideoRecording(true);
      
    } catch (error) {
      console.error('Error starting video recording:', error);
      alert('Could not access camera. Please check permissions.');
    }
  };

  const stopVideoRecording = () => {
    if (videoRecorderRef.current && isVideoRecording) {
      videoRecorderRef.current.stop();
    }
  };

  const handleVideoButtonClick = () => {
    if (isVideoRecording) {
      stopVideoRecording();
    } else {
      startVideoRecording();
    }
  };

  // Cleanup function for typing and recording
  const cleanup = () => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
    if (isTyping) {
      stopTyping();
    }
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
    }
    if (videoRecorderRef.current && isVideoRecording) {
      videoRecorderRef.current.stop();
    }
  };

  // Clean up on unmount
  useEffect(() => {
    return cleanup;
  }, []);

  // Clean up when chat changes
  useEffect(() => {
    cleanup();
  }, [currentChat?.id]);

  const handleAttachmentButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments(Array.from(e.target.files));
    }
  };

  // Helper to read a file as ArrayBuffer and return buffer, type, name
  const readFileAsBuffer = (file: File): Promise<{ buffer: ArrayBuffer; type: string; name: string }> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve({ buffer: reader.result as ArrayBuffer, type: file.type, name: file.name });
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  };

  const handleSendMessage = async () => {
    if ((!message.trim() && attachments.length === 0) || !socket || !currentChat?.id || !user?.id) return;

    // Stop typing indicator immediately when sending
    if (isTyping) {
      stopTyping();
    }

    // Clear typing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }

    // Prepare attachments as buffers
    let preparedAttachments: { buffer: ArrayBuffer; type: string; name: string }[] = [];
    if (attachments.length > 0) {
      preparedAttachments = await Promise.all(
        attachments.map(async (file) => {
          return await readFileAsBuffer(file);
        })
      );
    }

    // Prepare payload
    const payload: Partial<MessagePayload> = {
      chat_id: currentChat.id,
      content: message.trim(),
      sender_id: user.id,
      attachments: preparedAttachments.length > 0 ? preparedAttachments : undefined,
    };

    // Send message via socket
    socket.emit(SocketEvents.ON_MESSAGE_SEND, payload);

    // Clear the input and attachments
    setMessage("");
    setAttachments([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      await handleSendMessage();
    }
    // Shift+Enter will insert a new line by default in textarea
  };

  const isSendDisabled = (!message.trim() && attachments.length === 0) || !socket || !currentChat?.id || !user?.id;

  return (
    <div className={styles.chatInput}>
      <div className={styles.toolbar}>
        <IconButton 
          title="Bold" 
          onClick={handleBoldClick}
          className={isTextBold() ? styles.activeFormat : ''}
        >
          <BIcon />
        </IconButton>
        <IconButton 
          title="Italic" 
          onClick={handleItalicClick}
          className={isTextItalic() ? styles.activeFormat : ''}
        >
          <ItalicIcon />
        </IconButton>
        <IconButton 
          title="Link" 
          onClick={handleLinkClick}
          className={isTextLink() ? styles.linkActive : ''}
        >
          <LinkIcon />
        </IconButton>
        <IconButton 
          title="List" 
          onClick={handleListClick}
          className={isTextList() ? styles.listActive : ''}
        >
          <ListIcon />
        </IconButton>

        <VerticalSeperator />
        <IconButton title="Code" onClick={handleConsoleClick} className={isTextCode() ? styles.consoleActive : ''}>
          <CodeIcon />
        </IconButton>
      </div>
      <div className={styles.textAreaWrapper}>
        <textarea
          className={styles.textArea}
          placeholder={currentChat ? `Message ${currentChat.name}` : "Select a chat to start messaging"}
          value={message}
          onChange={(e) => handleMessageChange(e.target.value)}
          onKeyDown={handleKeyDown}
          ref={textAreaRef as React.RefObject<HTMLTextAreaElement>}
          rows={1}
        />
      </div>
      {/* Show selected attachments */}
      {attachments.length > 0 && (
        <div className={styles.selectedAttachments}>
          {attachments.map((file, idx) => (
            <span key={idx} className={styles.selectedAttachment}>
              <span className={styles.filePreviewContainer}>
                {file.type.startsWith('image/') ? (
                  <Image
                    src={getFilePreview(file) as string}
                    alt={file.name}
                    className={styles.filePreview}
                    width={32}
                    height={32}
                  />
                ) : (
                  <div className={styles.fileIconContainer}>
                    {getFilePreview(file) as React.ReactElement}
                  </div>
                )}
              </span>
              <span className={styles.fileName}>{file.name}</span>
              <button
                onClick={() => handleRemoveAttachment(idx)}
                className={styles.removeAttachment}
                aria-label="Remove attachment"
              >
                &times;
              </button>
            </span>
          ))}
        </div>
      )}
      {/* Recording indicator */}
      {isRecording && (
        <div className={styles.recordingIndicator}>
          <div className={styles.recordingDot}></div>
          <span className={styles.recordingText}>
            Recording...
          </span>
        </div>
      )}
      {/* Video recording indicator */}
      {isVideoRecording && (
        <div className={styles.videoRecordingIndicator}>
          <div className={styles.videoRecordingDot}></div>
          <span className={styles.videoRecordingText}>
            Recording Video...
          </span>
        </div>
      )}
      {/* Video preview */}
      {videoStream && (
        <div className={styles.videoPreviewContainer}>
          <video
            ref={videoPreviewRef}
            className={styles.videoPreview}
            autoPlay
            muted
            playsInline
          />
        </div>
      )}
      <div className={styles.bottomBar}>
        <div className={styles.attachmentBar}>
          <IconButton title="Add Attachment" onClick={handleAttachmentButtonClick}>
            <AddButtonIcon />
          </IconButton>
          <input
            type="file"
            multiple
            style={{ display: "none" }}
            ref={fileInputRef}
            onChange={handleFileChange}
          />
          <VerticalSeperator />

        <IconButton 
            title={isVideoRecording ? "Stop Video Recording" : "Video Message"} 
            onClick={handleVideoButtonClick}
            className={isVideoRecording ? styles.videoRecording : ''}
          >
            <VideoIcon />
          </IconButton>
          <IconButton 
            title={isRecording ? "Stop Recording" : "Voice Message"} 
            onClick={handleMicButtonClick}
            className={isRecording ? styles.recording : ''}
          >
            <MicIcon />
          </IconButton>
        </div>
        <button 
          className={styles.sendButton}
          onClick={async () => await handleSendMessage()}
          disabled={isSendDisabled}
          type="button"
          aria-label="Send message"
        >
          <SendIcon />
        </button>
      </div>
    </div>
  );
};

export default ChatInput;