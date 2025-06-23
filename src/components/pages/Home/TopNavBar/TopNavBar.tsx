"use client";
import React from "react";
import Link from "next/link";
import styles from "./TopNavBar.module.scss";
import NavDropdown from "./NavDropdown/NavDropdown";
import NavLink from "@/components/pages/Home/TopNavBar/NavLink/NavLink";
import Button from "@/components/common/Button/Button";
import Logo from "@/svgs/Images/Logo";

const TopNavBar: React.FC = () => {
  return (
    <nav className={styles["top-navbar"]}>
      <div className={styles["top-navbar__left"]}>
        <Link href="/" className={styles["top-navbar__logo"]}>
          <Logo />
        </Link>
      </div>
    <div className={styles["top-navbar__right"]}>
      <NavLink href="/privacy" content="Privacy" />
      <NavLink href="/help" content="Help Center" />
      <NavLink href="/pulse" content="Pulse Web" />
      
      <NavDropdown
        content="Download"
        options={[
        { href: "/download", content: "Download for Mac" },
        { href: "/download", content: "Download for Windows" },
        ]}
      />
      <Button
        text="Try Pulse"
        action={() => {          }}
        variant="primary"
      />  
    </div>
    </nav>
  );
};

export default TopNavBar;
