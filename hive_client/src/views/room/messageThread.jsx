import React from "react";
import Message from "./message";
import styles from "./rooms.module.scss";

const MessageThread = ({
    message,
    onReply,
    onDelete,
    setIsReply,
    level = 0,
}) => {
    return (
        <div
            className={styles.messageThread}
            style={{ marginLeft: `${level * 20}px` }}
        >
            <Message
                message={message}
                onReply={onReply}
                onDelete={onDelete}
                setIsReply={setIsReply}
                isReply={level > 0}
            />
            {message.replies?.map((reply) => (
                <MessageThread
                    key={reply.id}
                    message={reply}
                    onReply={onReply}
                    onDelete={onDelete}
                    setIsReply={setIsReply}
                    level={level + 1}
                />
            ))}
        </div>
    );
};

export default MessageThread;
