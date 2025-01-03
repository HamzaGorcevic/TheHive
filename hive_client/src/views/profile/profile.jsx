import React, { useContext } from "react";
import styles from "./Profile.module.scss";
import StateContext from "../../contexts/authcontext";
import BeekeeperCard from "./beekeeper";
import UserCard from "./user";
import UserServicesList from "./userServices";
import ReservationTable from "../reservations/reservationTable";

const Profile = () => {
    const { authData } = useContext(StateContext);

    return (
        <div className={styles.profileContainer}>
            <UserCard user={authData?.user} isViewMode={false} />
            {authData?.user?.beekeeper && (
                <>
                    <BeekeeperCard
                        beekeeper={authData?.user?.beekeeper}
                        isViewMode={false}
                    />
                    <UserServicesList isViewMode={false} />
                    <ReservationTable />
                </>
            )}
        </div>
    );
};

export default Profile;
