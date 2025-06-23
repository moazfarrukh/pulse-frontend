import React from "react";
import styles from "./Toolbar.module.scss";
import IconButton from "@/components/common/IconButton";
import CodeIcon from "@/svgs/Icons/CodeIcon";
import AlignLeftIcon from "@/svgs/Icons/AlignLeftIcon";
import ItalicIcon from "@/svgs/Icons/ItalicIcon";
import LinkIcon from "@/svgs/Icons/LinkIcon";
import ListIcon from "@/svgs/Icons/ListIcon";
import BIcon from "@/svgs/Icons/BIcon";
import VerticalSeperator from "@/components/common/VerticalSeperator/VerticalSeperator";
// import { FaBold, FaItalic, FaLink, FaListUl, FaAlignLeft, FaCode } from "react-icons/fa";

const Toolbar = () => (
  <div className={styles.toolbar}>
    <IconButton title="Bold">
      <BIcon />
    </IconButton>
    <IconButton title="Italic">
      <ItalicIcon />
    </IconButton>
    <IconButton title="Link">
      <LinkIcon />
    </IconButton>
    <VerticalSeperator />
    <IconButton title="List">
      <ListIcon />
    </IconButton>
    <IconButton title="Align Left">
      <AlignLeftIcon />
    </IconButton>
    <VerticalSeperator />
    <IconButton title="Code">
      <CodeIcon />
    </IconButton>
  </div>
);

export default Toolbar;
