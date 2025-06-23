"use client";
import React, { useEffect, useState } from "react";
import styles from "./HeroSection.module.scss";

import Button from "@/components/common/Button";
import DropdownIcon from "@/svgs/Icons/DropdownIcon";
import Hero from "@/svgs/Images/Hero";
interface HeroSectionProps {
  onLoginClick: () => void;
  onSignUpClick: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onLoginClick,onSignUpClick }) => {
  const [atTop, setAtTop] = useState(true);
  

  useEffect(() => {
    const handleScroll = () => {
      setAtTop(window.scrollY === 0);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleScrollDown = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: "smooth",
    });
  };

  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.textContent}>
            <h1 className={styles.title}>
              Communicate, Anywhere, Anytime
            </h1>
            <p className={styles.description}>
              Connect effortlessly across all devices with Pulse. Break free
              from limitations and redefine communication, anytime, anywhere.
            </p>
            <div className={styles.buttonGroup}>
              <Button
                text="Get Started"
                action={onSignUpClick}
                padding="10px 60px"
                variant="primary"
              />
              <Button
                text="Login"
                action={onLoginClick}
                padding="10px 70px"
                variant="outline"
              />
            </div>
          </div>

          <div className={styles.visualContent}>
            <div className={styles.heroSvg}>
              <Hero />
            </div>
          </div>
        </div>
        {/* Dropdown Icon */}
        {atTop && (
          <button
            className={styles.dropdownIcon}
            onClick={handleScrollDown}
            aria-label="Scroll down"
          >
            <DropdownIcon />
          </button>
        )}
      </div>
    </section>
  );
};

export default HeroSection;
