import React, { useState, useEffect } from "react";
import { MessageSquare } from "lucide-react";
import { useParams } from "react-router-dom";
import axiosClient from "../../axios";
import styles from "./rooms.module.scss";
import Question from "./question";
import MessageThread from "./messageThread";

const Room = () => {
    const [room, setRoom] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isReply, setIsReply] = useState(false);
    const { id } = useParams();

    const fetchRoomData = async () => {
        try {
            const [roomResponse, messagesResponse] = await Promise.all([
                axiosClient.get(`/rooms/${id}`),
                axiosClient.get(`/rooms/${id}/messages`),
            ]);
            setRoom(roomResponse.data.room);
            setMessages(messagesResponse.data.messages);
            setError("");
        } catch (err) {
            setError("Failed to load room data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRoomData();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axiosClient.post(`/rooms/${id}/messages`, {
                content: newMessage,
                room_id: id,
            });
            setNewMessage("");
            fetchRoomData();
        } catch (err) {
            setError("Failed to post message");
        }
    };

    const handleReply = async (messageId, content) => {
        try {
            await axiosClient.post(`/messages/${messageId}/reply`, {
                content,
                room_id: id,
            });
            fetchRoomData();
        } catch (err) {
            setError("Failed to post reply");
        }
    };

    const handleDelete = async (messageId) => {
        try {
            await axiosClient.delete(`/messages/${messageId}`);
            fetchRoomData();
        } catch (err) {
            setError("Failed to delete message");
        }
    };

    if (loading) return <div className={styles.loading}>Loading room...</div>;
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
                        setIsReply={setIsReply}
                    />
                ))}
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
