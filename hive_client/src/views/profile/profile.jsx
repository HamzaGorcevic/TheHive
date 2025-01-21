import React, { useContext } from "react";
import styles from "./profile.module.scss";
import StateContext from "../../contexts/authcontext";
import BeekeeperCard from "./beekeeper";
import UserCard from "./user";
import UserServicesList from "./userServices";
import ReservationTable from "../reservations/reservationTable";
import ChangePassword from "./changePassword";

const Profile = () => {
    const { authData } = useContext(StateContext);

    return (
        <div className={styles.profileContainer}>
            <UserCard user={authData?.user} isViewMode={false} />
            <ChangePassword />

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
