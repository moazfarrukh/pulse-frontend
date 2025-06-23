import React from "react";
import Link from "next/link";
import styles from "./NavLink.module.scss";
import DropdownIcon from "@/svgs/Icons/DropdownIcon";

interface NavLinkProps {
  href: string;
  content: string;
  download?: boolean;
}

const NavLink: React.FC<NavLinkProps> = ({ href, content, download }) => (
  <Link href={href} className={styles.navLink}>
    {content}
    {download && <DropdownIcon />}
  </Link>
);

export default NavLink;
