"use client";
import React, { useState } from "react";
import FeaturesSection from "@/components/pages/Home/FeaturesSection";
import HeroSection from "@/components/pages/Home/HeroSection";
import TopNavBar from "@/components/pages/Home/TopNavBar";
import LoginModal from "@/components/pages/Home/LoginModal";
import SignupModal from "@/components/pages/Home/SignupModal";

export default function Home() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  

  const handleCreateAccount = () => {
    setIsLoginModalOpen(false);
    setIsSignupModalOpen(true);
  };
  const handleExistingAccount = () => {
    setIsSignupModalOpen(false);
    setIsLoginModalOpen(true);
  };


  return (
    <div>
      <TopNavBar />
      <HeroSection onLoginClick={() => setIsLoginModalOpen(true)} onSignUpClick={() => setIsSignupModalOpen(true)} />
      <FeaturesSection />
      <LoginModal
      isOpen={isLoginModalOpen}
      onClose={() => setIsLoginModalOpen(false)}    
      onCreateAccount={handleCreateAccount}
      />
      <SignupModal
      isOpen={isSignupModalOpen}
      onClose={() => setIsSignupModalOpen(false)}
      onExistingAccount={handleExistingAccount}
      />
    </div>
  );
}