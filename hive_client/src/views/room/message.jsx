import React, { useState, useEffect, useContext } from "react";
import {
    MessageSquare,
    ThumbsUp,
    Trash2,
    Reply,
    User,
    Clock,
    CheckCircle2,
} from "lucide-react";
import styles from "./rooms.module.scss";
import Vote from "./vote";
import StateContext from "../../contexts/authcontext";

const Message = ({ message, onReply, onDelete, setIsReply, isReply, room }) => {
    const [showReplyForm, setShowReplyForm] = useState(false);
    const [replyContent, setReplyContent] = useState("");
    const { authData } = useContext(StateContext);
    console.log("message", message);
    const handleReplySubmit = async (e) => {
        e.preventDefault();
        setIsReply(true);
        await onReply(message.id, replyContent);
        setReplyContent("");
        setShowReplyForm(false);
    };

    return (
        <div className={`${styles.message} ${isReply ? styles.reply : ""}`}>
            <div className={styles.messageHeader}>
                <div className={styles.userInfo}>
                    <User size={20} />
                    <span>{message?.user?.name}</span>
                </div>
                <div className={styles.messageTime}>
                    <Clock size={16} />
                    <span>{new Date(message.created_at).toLocaleString()}</span>
                </div>
            </div>

            <div className={styles.messageContent}>
                <Vote
                    messageId={message.id}
                    initialPoints={message.points}
                    authorId={message.user_id}
                    userId={authData.user.id}
                />
                {message.content}
            </div>

            <div className={styles.messageActions}>
                <button
                    className={styles.actionButton}
                    onClick={() => setShowReplyForm(!showReplyForm)}
                >
                    <Reply size={16} />
                    Reply
                </button>

                {authData?.user?.id === message.user_id ||
                    (authData?.user?.role == "admin" && (
                        <button
                            className={`${styles.actionButton} ${styles.deleteButton}`}
                            onClick={() => onDelete(message.id)}
                        >
                            <Trash2 size={16} />
                            Delete
                        </button>
                    ))}
            </div>

            {showReplyForm && (
                <form onSubmit={handleReplySubmit} className={styles.replyForm}>
                    <textarea
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        placeholder="Write your reply..."
                        className={styles.replyInput}
                        required
                    />
                    <div className={styles.replyFormActions}>
                        <button type="submit" className={styles.button}>
                            Post Reply
                        </button>
                        <button
                            type="button"
                            onClick={() => setShowReplyForm(false)}
                            className={`${styles.button} ${styles.cancelButton}`}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};
export default Message;
