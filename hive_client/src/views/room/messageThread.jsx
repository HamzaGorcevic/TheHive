import React, { useContext } from "react";
import { CheckCircle2 } from "lucide-react";
import styles from "./roomMessages.module.scss";
import StateContext from "../../contexts/authcontext";
import axiosClient from "../../axios";
import Message from "./message";
import { toast } from "react-toastify";
const MessageThread = ({
    message,
    onReply,
    onDelete,
    room,
    fetchRoomData,
    level = 0,
}) => {
    const { authData } = useContext(StateContext);
    const handleMarkAsSolved = async () => {
        try {
            const response = await axiosClient.post("/messages/solved", {
                room_id: room.id,
                message_id: message.id,
            });
            toast.success("Successfully marked reponse as solved");
            fetchRoomData();
            // You might want to refresh the room data here or update the UI
        } catch (error) {
            console.error("Error marking message as solved:", error);
        }
    };
    const isRoomOwner = room?.user_id === authData.user.id;
    const isMessageSolved = room?.solved_message_id === message.id;
    return (
        <div
            className={styles.messageThread}
            style={{ marginLeft: `${level * 20}px` }}
        >
            <Message
                message={message}
                onReply={onReply}
                onDelete={onDelete}
                isReply={level > 0}
                room={room}
            />
            {message.replies?.map((reply) => (
                <MessageThread
                    key={reply.id}
                    message={reply}
                    onReply={onReply}
                    onDelete={onDelete}
                    level={level + 1}
                />
            ))}
            {isRoomOwner && !message.parent_id && (
                <button
                    className={`${styles.solveButton} ${
                        isMessageSolved ? styles.solved : ""
                    }`}
                    onClick={handleMarkAsSolved}
                    disabled={isMessageSolved}
                >
                    <CheckCircle2 size={16} />
                    {isMessageSolved ? "Solved" : "Mark as Solved"}
                </button>
            )}
        </div>
    );
};

export default MessageThread;
