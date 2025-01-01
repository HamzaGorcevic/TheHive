import React, { useEffect, useState } from "react";
import axiosClient from "../../axios";
import styles from "./usersList.module.scss";
import { Link } from "react-router-dom";

const UsersList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axiosClient.get("/users");
                setUsers(response.data.users);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className={styles.usersList}>
            <h1>Users List</h1>
            <div className={styles.usersGrid}>
                {users.map((user) => (
                    <div key={user.id} className={styles.userCard}>
                        <h2>{user.name}</h2>
                        <p>Points: {user.points}</p>
                        {user.city && <p>City: {user.city}</p>}
                        <Link
                            to={`/user/view/${user.id}/profile`}
                            className={styles.viewProfileBtn}
                        >
                            View Profile
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UsersList;
