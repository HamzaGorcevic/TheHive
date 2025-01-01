import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosClient from "../../axios";
import styles from "./viewUser.module.scss";
import UserCard from "../profile/user";
import BeekeeperCard from "../profile/beekeeper";
import UserServicesList from "../profile/userServices";

const ViewUser = () => {
    const { user_id } = useParams();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await axiosClient.get(
                    `/user/view/${user_id}/profile`
                );
                setUser(response.data.user);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, [user_id]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!user) return <div>User not found</div>;

    return (
        <div className={styles.viewUser}>
            <UserCard user={user} />
            {user.beekeeper && (
                <>
                    <BeekeeperCard beekeeper={user.beekeeper} />
                    <UserServicesList />
                </>
            )}
        </div>
    );
};

export default ViewUser;