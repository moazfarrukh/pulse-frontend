import React from "react";
import styles from "./WorkspaceLogo.module.scss";
import PulseLogo from "@/svgs/Images/PulseLogo";

const WorkspaceLogo: React.FC = () => {
    return (
        <div className={styles.workspaceLogo}>
            <PulseLogo className={styles.image} width={90} />
        </div>
    );
};

export default WorkspaceLogo;