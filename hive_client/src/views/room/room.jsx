import React, { useState, useEffect, useContext } from "react";
import { Loader, MessageSquare } from "lucide-react";
import { useParams } from "react-router-dom";
import axiosClient from "../../axios";
import styles from "./roomMessages.module.scss";
import Question from "./question";
import MessageThread from "./messageThread";
import CustomLoader from "../../components/loader/loader";
import { toast } from "react-toastify";
import StateContext from "../../contexts/authcontext";
const Room = () => {
    const [room, setRoom] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [replyLoading, setReplyLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const { id } = useParams();
    const { authData } = useContext(StateContext);

    const handleDeleteRoom = async (e) => {
        e.stopPropagation();

        // Ask for user confirmation
        const isConfirmed = window.confirm(
            "Are you sure you want to delete this room?"
        );

        if (!isConfirmed) {
            return; // Stop the function if the user cancels the deletion
        }

        try {
            const response = await axiosClient.delete(`rooms/${id}`);
            if (response.status === 200) {
                toast.success("Room deleted successfully!");
                fetchUserRooms();
            }
        } catch (e) {
            toast.error("An error occurred while deleting the room.");
        }
    };

    const fetchRoomData = async (page = 1) => {
        try {
            const [roomResponse, messagesResponse] = await Promise.all([
                axiosClient.get(`/rooms/${id}`),
                axiosClient.get(`/rooms/${id}/messages?page=${page}`),
            ]);

            setRoom(roomResponse.data.room);

            if (page === 1) {
                setMessages(messagesResponse.data.messages.data);
            } else {
                setMessages((prev) => [
                    ...prev,
                    ...messagesResponse.data.messages.data,
                ]);
            }

            setHasMore(
                messagesResponse.data.messages.current_page <
                    messagesResponse.data.messages.last_page
            );
            setError("");
        } catch (err) {
            setError("Failed to load room data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setCurrentPage(1); // Reset page when room changes
        fetchRoomData(1);
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setReplyLoading(true);
        try {
            await axiosClient.post(`/rooms/${id}/messages`, {
                content: newMessage,
                room_id: id,
            });
            setReplyLoading(false);
            setNewMessage("");
            fetchRoomData(1);
        } catch (err) {
            setError("Failed to post message");
        }
    };

    const handleReply = async (messageId, content, isReply = false) => {
        try {
            await axiosClient.post(
                `/${isReply ? "messages" : "rooms"}/${messageId}/${
                    isReply ? "reply" : "messages"
                }`,
                {
                    content,
                    room_id: id,
                }
            );
            fetchRoomData(currentPage);
        } catch (err) {
            setError("Failed to post reply");
        }
    };

    const handleDelete = async (messageId) => {
        try {
            setMessages((preveMessage) => {
                return preveMessage.filter(
                    (message) => message.id != messageId
                );
            });
            await axiosClient.delete(`/messages/${messageId}`);
            toast.success("Successfully deleted message");
        } catch (err) {
            fetchRoomData(currentPage);
            toast.error("Failed to delete message");
            setError("Failed to delete message");
        }
    };

    const loadMore = () => {
        if (hasMore) {
            setCurrentPage((prev) => prev + 1);
            fetchRoomData(currentPage + 1);
        }
    };

    if (loading) return <CustomLoader />;
    if (error) return <div className={styles.error}>{error}</div>;
    if (!room) return <div className={styles.error}>Room not found</div>;

    return (
        <div className={styles.roomContainer}>
            {authData?.user?.id == room.user_id ||
            authData?.user?.role == "admin" ? (
                <button onClick={handleDeleteRoom} className={styles.deleteBtn}>
                    Delete room
                </button>
            ) : (
                ""
            )}
            <Question room={room} />

            <div className={styles.messageList}>
                {messages.map((message) => (
                    <MessageThread
                        key={message.id}
                        message={message}
                        onReply={handleReply}
                        onDelete={handleDelete}
                        room={room}
                        fetchRoomData={() => fetchRoomData(currentPage)}
                    />
                ))}

                {hasMore && (
                    <button onClick={loadMore} className={styles.loadMore}>
                        Load More
                    </button>
                )}
            </div>

            <form onSubmit={handleSubmit} className={styles.messageForm}>
                <div className={styles.formGroup}>
                    <textarea
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Write your answer..."
                        className={styles.messageInput}
                        required
                    />
                </div>
                {replyLoading ? (
                    <button
                        disabled
                        className={`${styles.button} ${styles.loading}`}
                    ></button>
                ) : (
                    <button type="submit" className={styles.button}>
                        <MessageSquare size={20} />
                        Post Answer
                    </button>
                )}
            </form>
        </div>
    );
};

export default Room;
