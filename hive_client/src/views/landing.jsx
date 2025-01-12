import React, { useContext } from "react";
import {
    Users,
    MessageSquare,
    Award,
    BookOpen,
    Share2,
    UserPlus,
} from "lucide-react";
import styles from "./landing.module.scss";
import StateContext from "../contexts/authcontext";
import { useNavigate } from "react-router-dom";

function Landing() {
    const { authData } = useContext(StateContext);
    const navigate = useNavigate();
    return (
        <div className={styles.landing}>
            <div className={styles.splitContainer}>
                {/* Left Section */}
                <div className={`${styles.splitSection} ${styles.left}`}>
                    <div className={styles.contentWrapper}>
                        <div className={styles.pill}>
                            <Users size={16} />
                            Beekeeping Community
                        </div>
                        <h1>Connect with Beekeepers Worldwide</h1>
                        <p>
                            Join our thriving community of beekeepers to share
                            knowledge, find services, and grow together
                        </p>
                        <div className={styles.featuresGrid}>
                            <div className={styles.feature}>
                                <Share2 size={24} />
                                <span>Share Expertise</span>
                            </div>
                            <div className={styles.feature}>
                                <MessageSquare size={24} />
                                <span>Get Advice</span>
                            </div>
                            <div className={styles.feature}>
                                <Award size={24} />
                                <span>Rate Services</span>
                            </div>
                            <div className={styles.feature}>
                                <BookOpen size={24} />
                                <span>Learn & Grow</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Section */}
                <div className={`${styles.splitSection} ${styles.right}`}>
                    <div className={styles.card}>
                        <h2>Join TheHive Today</h2>
                        <p>
                            Connect with experienced beekeepers, access
                            specialized services, and be part of a supportive
                            community
                        </p>
                        <div className={styles.statsContainer}>
                            <div className={styles.stat}>
                                <span className={styles.statNumber}>500+</span>
                                <span className={styles.statLabel}>
                                    Active Members
                                </span>
                            </div>
                            <div className={styles.stat}>
                                <span className={styles.statNumber}>50+</span>
                                <span className={styles.statLabel}>
                                    Expert Services
                                </span>
                            </div>
                            <div className={styles.stat}>
                                <span className={styles.statNumber}>24/7</span>
                                <span className={styles.statLabel}>
                                    Community Support
                                </span>
                            </div>
                        </div>
                        {!authData && (
                            <button
                                className={styles.button}
                                onClick={() => {
                                    navigate("/register");
                                }}
                            >
                                <UserPlus
                                    size={20}
                                    className={styles.buttonIcon}
                                />
                                Join Community
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Landing;
