import React from "react";
import { Link } from "react-router-dom";
import { Home, Phone, Mail, Github, Twitter, Linkedin } from "lucide-react";
import styles from "./footer.module.scss";

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.section}>
                    <h3>About BeeHive</h3>
                    <p>
                        Your trusted platform for connecting beekeepers and
                        enthusiasts. Building a sweeter world, one hive at a
                        time.
                    </p>
                </div>

                <div className={styles.section}>
                    <h3>Quick Links</h3>
                    <div className={styles.links}>
                        <Link to="/" className={styles.link}>
                            <Home className={styles.icon} />
                            Home
                        </Link>
                        <Link to="/rooms" className={styles.link}>
                            Browse Rooms
                        </Link>
                        <Link to="/services" className={styles.link}>
                            Services
                        </Link>
                    </div>
                </div>

                <div className={styles.section}>
                    <h3>Contact</h3>
                    <div className={styles.links}>
                        <a href="tel:+1234567890" className={styles.link}>
                            <Phone className={styles.icon} />
                            (123) 456-7890
                        </a>
                        <a
                            href="mailto:contact@beehive.com"
                            className={styles.link}
                        >
                            <Mail className={styles.icon} />
                            contact@beehive.com
                        </a>
                    </div>
                </div>

                <div className={styles.section}>
                    <h3>Follow Us</h3>
                    <div className={styles.links}>
                        <a
                            href="https://github.com/HamzaGorcevic/TheHive"
                            className={styles.link}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Github className={styles.icon} />
                            GitHub
                        </a>

                        <a
                            href="https://www.linkedin.com/in/hamza-gor%C4%8Devi%C4%87-112951246/"
                            className={styles.link}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Linkedin className={styles.icon} />
                            LinkedIn
                        </a>
                    </div>
                </div>
            </div>

            <div className={styles.bottom}>
                <p>&copy; {currentYear} BeeHive. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
