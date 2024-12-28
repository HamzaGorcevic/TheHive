import React, { useState, useEffect } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import axiosClient from "../../axios";
import styles from "./vote.module.scss";

const Vote = ({
    messageId,
    initialPoints = 0,
    authorId,
    userId,
    initialVote = 0,
}) => {
    const [points, setPoints] = useState(initialPoints);
    const [userVote, setUserVote] = useState(initialVote);
    const [isAnimating, setIsAnimating] = useState(false);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchMessageVotes();
    }, [messageId]);

    const fetchMessageVotes = async () => {
        try {
            setIsLoading(true);
            const response = await axiosClient.get(
                `/messages/${messageId}/vote`
            );
            setPoints(response.data.count);
            setUserVote(response.data.user_vote || 0);
        } catch (err) {
            console.error("Failed to fetch votes:", err);
            setError("Failed to load votes");
        } finally {
            setIsLoading(false);
        }
    };

    const handleVote = async (voteType) => {
        if (!userId || userId === authorId) return;

        setIsAnimating(true);
        setError(null);

        const previousVote = userVote;
        const newVoteType = userVote === voteType ? 0 : voteType;

        try {
            setUserVote(newVoteType);

            const response = await axiosClient.post(
                `/messages/${messageId}/vote`,
                {
                    message_id: messageId,
                    vote_type: newVoteType,
                }
            );

            // Update with actual server data
            setPoints(response.data.new_score);
        } catch (err) {
            // Revert on error
            setPoints((prev) => prev + previousVote - newVoteType);
            setUserVote(previousVote);
            setError("Voting failed. Please try again.");
            console.error("Voting failed:", err);
        } finally {
            setTimeout(() => setIsAnimating(false), 300);
        }
    };

    if (isLoading) {
        return <div className={styles.loading}>Loading votes...</div>;
    }

    return (
        <div className={styles.voteContainer}>
            <button
                className={`${styles.voteButton} ${
                    userVote === 1 ? styles.active : ""
                } ${isAnimating ? styles.animate : ""}`}
                onClick={() => handleVote(1)}
                disabled={!userId || userId === authorId}
                aria-label="Upvote"
            >
                <ChevronUp className={styles.icon} />
            </button>

            <span
                className={`${styles.points} ${
                    isAnimating ? styles.bounce : ""
                }`}
            >
                {points}
            </span>

            <button
                className={`${styles.voteButton} ${
                    userVote === -1 ? styles.active : ""
                } ${isAnimating ? styles.animate : ""}`}
                onClick={() => handleVote(-1)}
                disabled={!userId || userId === authorId}
                aria-label="Downvote"
            >
                <ChevronDown className={styles.icon} />
            </button>

            {error && <p className={styles.error}>{error}</p>}
        </div>
    );
};

export default Vote;
