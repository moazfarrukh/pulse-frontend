"use client";
import React from "react";
import styles from "./SideNav.module.scss";
import MainNavigation from "./MainNavigation";
import WorkspaceLogo from "./WorkspaceLogo";
import Profile from "./Profile";
import AddItem from "./AddItem";
import { useUIStore, useUserStore } from "@/store";

const SideNav: React.FC = () => {
  const { currentUser: user } = useUserStore();
  const { openProfileModal } = useUIStore();
  return (
    <div className={styles.sideNav}>
      <div className={styles.topItems}>
        <WorkspaceLogo />
        <MainNavigation />
      </div>
      <div className={styles.bottomItems}>
        <AddItem />
        <Profile src={user?.avatar_url || "/images/profile.jpg"} onClick={openProfileModal} />
      </div>
    </div>
  );
};

export default SideNav;
