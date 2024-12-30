import React, { useContext } from "react";
import styles from "./Profile.module.scss";
import StateContext from "../../contexts/authcontext";
import BeekeeperCard from "./beekeeper";
import UserCard from "./user";

const Profile = () => {
    const { authData } = useContext(StateContext);

    return (
        <div className={styles.profileContainer}>
            <UserCard user={authData?.user} />
            {authData?.user?.beekeeper && (
                <BeekeeperCard beekeeper={authData?.user?.beekeeper} />
            )}
        </div>
    );
};

export default Profile;
