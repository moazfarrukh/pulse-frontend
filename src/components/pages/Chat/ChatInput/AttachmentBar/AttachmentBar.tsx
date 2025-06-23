import React from "react";
import styles from "./AttachmentBar.module.scss";
import IconButton from "@/components/common/IconButton";
import ItalicIcon from "@/svgs/Icons/ItalicIcon";
import FontIcon from "@/svgs/Icons/FontIcon";
import SmileIcon from "@/svgs/Icons/SmileIcon";
import VideoIcon from "@/svgs/Icons/VideoIcon";
import MicIcon from "@/svgs/Icons/MicIcon";
import ConsoleIcon from "@/svgs/Icons/ConsoleIcon";
import AddButtonIcon from "@/svgs/Icons/AddButtonIcon";
import VerticalSeperator from "@/components/common/VerticalSeperator/VerticalSeperator";

const AttachmentBar = () => (
  <div className={styles.attachmentBar}>
    <IconButton title="Add Attachment">
      <AddButtonIcon />
    </IconButton>
    <IconButton title="Italic">
      <ItalicIcon />
    </IconButton>
    <IconButton title="Font">
      <FontIcon />
    </IconButton>
    <IconButton title="Emoji">
      <SmileIcon />
    </IconButton>
    <VerticalSeperator />
    <IconButton title="Video">
      <VideoIcon />
    </IconButton>
    <IconButton title="Voice Message">
      <MicIcon />
    </IconButton>
    <VerticalSeperator />
    <IconButton title="Console">
      <ConsoleIcon />
    </IconButton>
  </div>
);

export default AttachmentBar;
