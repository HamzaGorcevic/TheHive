import React, { useState } from "react";
import { Lock } from "lucide-react";
import { toast } from "react-toastify";
import axiosClient from "../../axios";
import styles from "./user.module.scss";

const ChangePassword = () => {
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [passwordData, setPasswordData] = useState({
        current_password: "",
        new_password: "",
        new_password_confirmation: "",
    });

    const handlePasswordChange = async (e) => {
        e.preventDefault();

        if (
            passwordData.new_password !== passwordData.new_password_confirmation
        ) {
            toast.error("New passwords do not match");
            return;
        }

        if (passwordData.current_password === passwordData.new_password) {
            toast.error("New password must be different from current password");
            return;
        }
        setLoading(true);
        try {
            await axiosClient.post("/user/change-password", passwordData);
            toast.success("Password changed successfully");
            setIsChangingPassword(false);
            setPasswordData({
                current_password: "",
                new_password: "",
                new_password_confirmation: "",
            });
            setLoading(false);
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Failed to change password"
            );
            setLoading(false);
        }
    };

    return (
        <div className={styles.passwordSection}>
            <div className={styles.sectionHeader}>
                <div className={styles.headerContent}>
                    <h2>Password Settings</h2>
                    <p className={styles.subtitle}>
                        Update your password to keep your account secure
                    </p>
                </div>
                <button
                    onClick={() => setIsChangingPassword(!isChangingPassword)}
                    className={`${styles.actionButton} ${
                        isChangingPassword
                            ? styles.cancelButton
                            : styles.editButton
                    }`}
                >
                    <Lock size={20} />
                    {isChangingPassword ? "Cancel" : "Change Password"}
                </button>
            </div>

            {isChangingPassword && (
                <form
                    onSubmit={handlePasswordChange}
                    className={styles.passwordForm}
                >
                    <div className={styles.formGroup}>
                        <label htmlFor="current_password">
                            Current Password
                        </label>
                        <input
                            type="password"
                            id="current_password"
                            value={passwordData.current_password}
                            onChange={(e) =>
                                setPasswordData({
                                    ...passwordData,
                                    current_password: e.target.value,
                                })
                            }
                            className={styles.editInput}
                            required
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="new_password">New Password</label>
                        <input
                            type="password"
                            id="new_password"
                            value={passwordData.new_password}
                            onChange={(e) =>
                                setPasswordData({
                                    ...passwordData,
                                    new_password: e.target.value,
                                })
                            }
                            className={styles.editInput}
                            required
                            minLength={8}
                            pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$"
                            title="Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number"
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="new_password_confirmation">
                            Confirm New Password
                        </label>
                        <input
                            type="password"
                            id="new_password_confirmation"
                            value={passwordData.new_password_confirmation}
                            onChange={(e) =>
                                setPasswordData({
                                    ...passwordData,
                                    new_password_confirmation: e.target.value,
                                })
                            }
                            className={styles.editInput}
                            required
                            minLength={8}
                        />
                    </div>

                    {loading ? (
                        <button
                            disabled
                            className={`${styles.loading} ${styles.submitButton}`}
                        ></button>
                    ) : (
                        <button type="submit" className={styles.submitButton}>
                            Update Password
                        </button>
                    )}
                </form>
            )}
        </div>
    );
};

export default ChangePassword;
