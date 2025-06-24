import React from "react";
import styles from "./Profile.module.scss";
import Image from "next/image";

interface ProfileProps {
  src: string;
  alt?: string;
}
interface ProfileProps {
  src: string;
  alt?: string;
  onClick?: () => void;
}
const Profile: React.FC<ProfileProps> = ({ src, alt = 'User Profile', onClick }) => {
  return (
    <div className={styles.container} onClick={onClick}>
      <Image src={src} alt={alt} className={styles.image} height={44} width={44} />
      <span className={styles.status} />
    </div>
  );
};

export default Profile;
