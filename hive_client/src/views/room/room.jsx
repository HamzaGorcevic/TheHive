import React, { useState, useEffect } from "react";
import { Loader, MessageSquare } from "lucide-react";
import { useParams } from "react-router-dom";
import axiosClient from "../../axios";
import styles from "./roomMessages.module.scss";
import Question from "./question";
import MessageThread from "./messageThread";
import CustomLoader from "../../components/loader/loader";
const Room = () => {
    const [room, setRoom] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const { id } = useParams();

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
        try {
            await axiosClient.post(`/rooms/${id}/messages`, {
                content: newMessage,
                room_id: id,
            });
            setNewMessage("");
            fetchRoomData(1); // Refresh from first page after new post
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
            await axiosClient.delete(`/messages/${messageId}`);
            fetchRoomData(1); // Refresh from first page after delete
        } catch (err) {
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
                <button type="submit" className={styles.button}>
                    <MessageSquare size={20} />
                    Post Answer
                </button>
            </form>
        </div>
    );
};

export default Room;
