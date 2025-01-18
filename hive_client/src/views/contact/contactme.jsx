import React, { useState } from "react";
import styles from "./contactme.module.scss";
import axiosClient from "../../axios";
import { toast } from "react-toastify";

const ContactMe = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axiosClient.post("/contact-me", formData);
            setFormData({ name: "", email: "", subject: "", message: "" });
            if (response.status == 200) {
                toast.success("Succesfully sent mail !");
            }
        } catch (err) {
            toast.error("Failed to send mail");
            setError("Failed to send message. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    return (
        <div className={styles.contactContainer}>
            <div className={styles.contactCard}>
                <h2 className={styles.title}>Get in Touch</h2>
                <p className={styles.subtitle}>
                    I'd love to hear from you. Send me a message!
                </p>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Name:</label>
                        <input
                            className={styles.input}
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            placeholder="Your name"
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Email:</label>
                        <input
                            className={styles.input}
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="your.email@example.com"
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Subject:</label>
                        <input
                            className={styles.input}
                            type="text"
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            required
                            placeholder="What's this about?"
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Message:</label>
                        <textarea
                            className={`${styles.input} ${styles.textarea}`}
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            required
                            placeholder="Your message here..."
                            rows={5}
                        />
                    </div>

                    {error && <p className={styles.error}>{error}</p>}

                    <button
                        className={`${styles.submitButton} ${
                            loading ? styles.loading : ""
                        }`}
                        type="submit"
                        disabled={loading}
                    >
                        {!loading && "Send Message"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ContactMe;
