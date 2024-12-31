import React from "react";
import { Users, MessageSquare, Briefcase, Award, Flower2 } from "lucide-react";
import styles from "./landing.module.scss";

const Landing = () => {
    const features = [
        {
            icon: <Users size={32} />,
            title: "Community",
            description: "Connect with experienced beekeepers and enthusiasts",
        },
        {
            icon: <MessageSquare size={32} />,
            title: "Expert Advice",
            description: "Get answers to your beekeeping questions",
        },
        {
            icon: <Briefcase size={32} />,
            title: "Services",
            description: "Offer and find beekeeping services",
        },
        {
            icon: <Award size={32} />,
            title: "Knowledge",
            description: "Learn from the best in the field",
        },
    ];
    return (
        <div className={styles.landing}>
            <section className={styles.hero}>
                <div className={styles.heroContent}>
                    <h1>Welcome to TheHive</h1>
                    <p>Connecting Beekeepers and Enthusiasts Worldwide</p>
                    <div className={styles.heroButtons}>
                        <button className={styles.primaryButton}>
                            Join Community
                        </button>
                        <button className={styles.secondaryButton}>
                            Learn More
                        </button>
                    </div>
                </div>
                {/* <Flower2
                    className={styles.heroIcon}
                    size={48}
                    color="#FFE0B2"
                /> */}
            </section>
            <section className={styles.features}>
                <h2>Why Join Our Community?</h2>
                <div className={styles.featureGrid}>
                    {features.map((feature, index) => (
                        <div key={index} className={styles.featureCard}>
                            <div className={styles.featureIcon}>
                                {feature.icon}
                            </div>
                            <h3>{feature.title}</h3>
                            <p>{feature.description}</p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Landing;
