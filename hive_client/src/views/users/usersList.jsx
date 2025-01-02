import React, { useContext, useEffect, useState } from "react";
import axiosClient from "../../axios";
import styles from "./usersList.module.scss";
import { Link } from "react-router-dom";
import CustomLoader from "../../components/loader/loader";
import { toast } from "react-toastify";
import StateContext from "../../contexts/authcontext";

const UsersList = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { authData } = useContext(StateContext);

    // Filter states
    const [cityFilter, setCityFilter] = useState("");
    const [pointsFilter, setPointsFilter] = useState("");
    const [nameFilter, setNameFilter] = useState("");

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axiosClient.get("/users");
                setUsers(response.data.users);
                setFilteredUsers(response.data.users); // Initialize filtered users
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    // Apply filters whenever cityFilter or pointsFilter changes
    useEffect(() => {
        let filtered = users;

        if (cityFilter) {
            filtered = filtered.filter((user) =>
                user.city?.toLowerCase().includes(cityFilter.toLowerCase())
            );
        }

        if (pointsFilter) {
            filtered = filtered.filter(
                (user) => user.points >= parseInt(pointsFilter)
            );
        }
        if (nameFilter) {
            filtered = filtered.filter((user) =>
                user.name?.toLowerCase().includes(nameFilter)
            );
        }

        setFilteredUsers(filtered);
    }, [cityFilter, pointsFilter, users, nameFilter]);

    const handleDeleteUser = async (userId) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            try {
                await axiosClient.delete(`/user/${userId}`);
                setUsers(users.filter((user) => user.id !== userId));
                toast.success("User deleted successfully");
            } catch (err) {
                toast.error("Failed to delete user: " + err.message);
            }
        }
    };

    if (loading) return <CustomLoader />;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className={styles.usersList}>
            <h1>Users List</h1>

            {/* Filters */}
            <div className={styles.filters}>
                <input
                    type="text"
                    placeholder="Filter by city"
                    value={cityFilter}
                    onChange={(e) => setCityFilter(e.target.value)}
                    className={styles.filterInput}
                />
                <input
                    type="number"
                    placeholder="Filter by points (min)"
                    value={pointsFilter}
                    onChange={(e) => setPointsFilter(e.target.value)}
                    className={styles.filterInput}
                />
                <input
                    type="text"
                    placeholder="Filter by name"
                    value={nameFilter}
                    onChange={(e) => setNameFilter(e.target.value)}
                    className={styles.filterInput}
                />
            </div>

            {/* Users Grid */}
            <div className={styles.usersGrid}>
                {filteredUsers.map((user) => (
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
                        {authData?.user?.role === "admin" && (
                            <button
                                onClick={() => handleDeleteUser(user.id)}
                                className={styles.deleteBtn}
                            >
                                Delete User
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UsersList;
