import React, { useState, useEffect, useContext } from "react";
import { MessageSquare, Trash2, Reply, User, Clock } from "lucide-react";
import styles from "./roomMessages.module.scss";
import Vote from "./vote";
import StateContext from "../../contexts/authcontext";
import axiosClient from "../../axios";
import { toast } from "react-toastify";

const Message = ({
    message: initialMessage,
    onReply,
    onDelete,
    isReply,
    room,
}) => {
    const [showReplyForm, setShowReplyForm] = useState(false);
    const [replyContent, setReplyContent] = useState("");
    const [replies, setReplies] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMoreReplies, setHasMoreReplies] = useState(false);
    const [loadingReplies, setLoadingReplies] = useState(false);
    const [showReplies, setShowReplies] = useState(false);
    const [replyCount, setReplyCount] = useState(0);
    const { authData } = useContext(StateContext);
    const [deleted, setDeleted] = useState(false);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        const fetchReplyCount = async () => {
            try {
                const response = await axiosClient.get(
                    `/messages/${initialMessage.id}/replies?page=1&per_page=1`
                );
                const total = response.data.replies.total;
                setReplyCount(total);
                setHasMoreReplies(total > 0);
            } catch (error) {
                console.error("Error fetching reply count:", error);
            }
        };

        fetchReplyCount();
    }, [initialMessage.id]);

    const fetchReplies = async (page = 1) => {
        if (loadingReplies) return;

        try {
            setLoadingReplies(true);
            const response = await axiosClient.get(
                `/messages/${initialMessage.id}/replies?page=${page}&per_page=10`
            );
            const newReplies = response.data.replies.data;
            const total = response.data.replies.total;
            setReplyCount(total);

            setReplies(page === 1 ? newReplies : [...replies, ...newReplies]);
            setHasMoreReplies(
                response.data.replies.current_page <
                    response.data.replies.last_page
            );
            setCurrentPage(response.data.replies.current_page);
        } catch (error) {
            toast.error("Failed to load replies");
        } finally {
            setLoadingReplies(false);
        }
    };

    const handleViewReplies = () => {
        setShowReplies(true);
        if (replies.length === 0) {
            fetchReplies(1);
        }
    };
    const handleReplySubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onReply(initialMessage.id, replyContent, true);
            setReplyContent("");
            setLoading(false);
            setShowReplyForm(false);
            setReplyCount((prev) => prev + 1);
            setCurrentPage(1);
            await fetchReplies(1);
        } catch (error) {
            toast.error("Failed to post reply");
        }
    };

    const handleDelete = async (e, id) => {
        e.preventDefault();
        try {
            setDeleted(true);
            onDelete && onDelete(id);
        } catch (error) {
            toast.error(error.message || "Failed to delete message");
        }
    };
    if (deleted) return "";

    return (
        <div className={`${styles.message} ${isReply ? styles.reply : ""}`}>
            <div className={styles.messageHeader}>
                <div className={styles.userInfo}>
                    <User size={20} />
                    <span>{initialMessage?.user?.name}</span>
                    {initialMessage?.user?.role && (
                        <span className={styles.userRole}>
                            ({initialMessage.user.role})
                        </span>
                    )}
                </div>
                <div className={styles.messageTime}>
                    <Clock size={16} />
                    <span>
                        {new Date(initialMessage.created_at).toLocaleString()}
                    </span>
                </div>
            </div>

            <div className={styles.messageContent}>
                {!initialMessage.parent_message_id && (
                    <Vote
                        messageId={initialMessage.id}
                        initialPoints={initialMessage.points}
                        authorId={initialMessage.user_id}
                        userId={authData.user.id}
                    />
                )}
                {initialMessage.content}
            </div>

            <div className={styles.messageActions}>
                <button
                    className={styles.actionButton}
                    onClick={() => setShowReplyForm(!showReplyForm)}
                >
                    <Reply size={16} />
                    Reply
                </button>
                {replyCount > 0 && !showReplies && (
                    <button
                        className={styles.viewRepliesButton}
                        onClick={handleViewReplies}
                    >
                        <MessageSquare size={16} />
                        View Replies ({replyCount})
                    </button>
                )}
                {authData?.user?.id === initialMessage?.user_id ||
                    (authData?.user.role == "admin" && (
                        <button
                            className={styles.deleteBtn}
                            onClick={(e) => handleDelete(e, initialMessage.id)}
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
                        {loading ? (
                            <button
                                disabled
                                className={`${styles.button} ${styles.loading} `}
                            ></button>
                        ) : (
                            <button type="submit" className={styles.button}>
                                Post Reply
                            </button>
                        )}
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

            {showReplies && replies.length > 0 && (
                <div className={styles.repliesSection}>
                    {replies.map((reply) => (
                        <Message
                            key={reply.id}
                            message={reply}
                            onReply={onReply}
                            onDelete={onDelete}
                            isReply={true}
                            room={room}
                        />
                    ))}
                    {hasMoreReplies && replies.length < replyCount && (
                        <button
                            onClick={() => fetchReplies(currentPage + 1)}
                            className={styles.loadMoreButton}
                            disabled={loadingReplies}
                        >
                            {loadingReplies
                                ? "Loading..."
                                : "Load More Replies"}
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default Message;
