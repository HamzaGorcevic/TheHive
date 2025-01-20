import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, MapPin, Award, User } from "lucide-react";
import axiosClient from "../../axios";
import { toast } from "react-toastify";
import StateContext from "../../contexts/authcontext";
import CustomLoader from "../../components/loader/loader";
import styles from "./usersList.module.scss";

const UsersList = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const { authData } = useContext(StateContext);

    const [filters, setFilters] = useState({
        nameFilter: "",
        cityFilter: "",
        pointsFilter: "",
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axiosClient.get("/users");
            setUsers(response.data.users);
            setFilteredUsers(response.data.users);
            console.log(response.data.users);
        } catch (err) {
            toast.error("Failed to fetch users");
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (filterName, value) => {
        setFilters((prev) => ({
            ...prev,
            [filterName]: value,
        }));
    };

    useEffect(() => {
        let filtered = users;

        if (filters.nameFilter) {
            filtered = filtered.filter((user) =>
                user.name
                    ?.toLowerCase()
                    .includes(filters.nameFilter.toLowerCase())
            );
        }

        if (filters.cityFilter) {
            filtered = filtered.filter((user) =>
                user.city
                    ?.toLowerCase()
                    .includes(filters.cityFilter.toLowerCase())
            );
        }

        if (filters.pointsFilter) {
            filtered = filtered.filter(
                (user) => user.points >= parseInt(filters.pointsFilter)
            );
        }

        setFilteredUsers(filtered);
    }, [filters, users]);

    const handleDeleteUser = async (e, userId) => {
        e.stopPropagation();

        if (window.confirm("Are you sure you want to delete this user?")) {
            try {
                await axiosClient.delete(`/user/${userId}`);
                setUsers(users.filter((user) => user.id !== userId));
                toast.success("User deleted successfully");
            } catch (err) {
                toast.error("Failed to delete user");
            }
        }
    };
    const navigate = useNavigate();
    if (loading) return <CustomLoader />;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Beekeepers Directory</h1>
                <p>Connect with our community of experienced beekeepers</p>
            </div>

            <div className={styles.filters}>
                <div className={styles.filterGroup}>
                    <Search className={styles.filterIcon} />
                    <input
                        type="text"
                        placeholder="Search by name"
                        value={filters.nameFilter}
                        onChange={(e) =>
                            handleFilterChange("nameFilter", e.target.value)
                        }
                        className={styles.filterInput}
                    />
                </div>

                <div className={styles.filterGroup}>
                    <MapPin className={styles.filterIcon} />
                    <input
                        type="text"
                        placeholder="Filter by city"
                        value={filters.cityFilter}
                        onChange={(e) =>
                            handleFilterChange("cityFilter", e.target.value)
                        }
                        className={styles.filterInput}
                    />
                </div>

                <div className={styles.filterGroup}>
                    <Award className={styles.filterIcon} />
                    <input
                        type="number"
                        placeholder="Min points"
                        value={filters.pointsFilter}
                        onChange={(e) =>
                            handleFilterChange("pointsFilter", e.target.value)
                        }
                        className={styles.filterInput}
                    />
                </div>
            </div>

            <div className={styles.grid}>
                {filteredUsers.map((user) =>
                    authData?.user.id != user.id && user.role == "beekeeper" ? (
                        <div
                            key={user.id}
                            className={styles.card}
                            onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/user/view/${user.id}/profile`);
                            }}
                        >
                            <div className={styles.cardHeader}>
                                <div className={styles.avatar}>
                                    <User size={32} />
                                </div>
                                <h2>{user.name}</h2>
                            </div>

                            <div className={styles.cardContent}>
                                <div className={styles.infoRow}>
                                    <Award className={styles.icon} />
                                    <span>{user.points} Points</span>
                                </div>
                                {user.city && (
                                    <div className={styles.infoRow}>
                                        <MapPin className={styles.icon} />
                                        <span>{user.city}</span>
                                    </div>
                                )}
                            </div>

                            <div className={styles.cardActions}>
                                {/* <Link
                                    to={`/user/view/${user.id}/profile`}
                                    className={styles.viewButton}
                                >
                                    View Profile
                                </Link> */}
                                {authData?.user?.role === "admin" && (
                                    <button
                                        onClick={(e) =>
                                            handleDeleteUser(e, user.id)
                                        }
                                        className={`${styles.deleteButton} ${styles.viewButton}`}
                                    >
                                        Delete User
                                    </button>
                                )}
                            </div>
                        </div>
                    ) : (
                        ""
                    )
                )}
            </div>
        </div>
    );
};

export default UsersList;
