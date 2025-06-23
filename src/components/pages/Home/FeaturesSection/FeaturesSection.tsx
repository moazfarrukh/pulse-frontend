import React from "react";
import Image from "next/image";
import  styles from "./FeaturesSection.module.scss";

const FeaturesSection = () => {
  const features = [
    {
      id: 1,
      image: '/images/features1.jpg',
      title: 'Connect seamlessly, chat effortlessly wherever you are.',
      alt: 'Person using mobile phone for seamless communication'
    },
    {
      id: 2,
      image: '/images/features2.jpg',
      title: 'Break barriers, bridge distances with our unified chat experience.',
      alt: 'Person working on desktop computer in modern workspace'
    },
    {
      id: 3,
      image: '/images/features1.jpg',
      title: 'Experience the power of cross-platform communication, simplified',
      alt: 'Cross-platform communication experience'
    }
  ];

return (
  <section className={styles.featuresSection}>
    <div className={styles.container}>
      <div className={styles.featuresGrid}>
        {features.map((feature) => (
          <div key={feature.id} className={styles.featureCard} >
              <Image
                src={feature.image}
                alt={feature.alt}
                className={styles.featureImage}
                width={400}
                height={300}
                style={{ objectFit: 'cover' }}
              />
              <div className={styles.overlay}></div>
              <div className={styles.content}>
                <h3 className={styles.title}>{feature.title}</h3>
              </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);
}

export default FeaturesSection;