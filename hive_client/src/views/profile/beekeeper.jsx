import React from "react";
import styles from "./beekeeper.module.scss";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//     iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
//     iconUrl: require("leaflet/dist/images/marker-icon.png"),
//     shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
// });

const BeekeeperCard = ({ beekeeper }) => {
    console.log(beekeeper);
    return (
        <div className={styles.beekeeperCard}>
            <h2>Beekeeper Details</h2>
            <div className={styles.stats}>
                <div className={styles.statItem}>
                    <i className="fas fa-archive"></i>
                    <span className={styles.label}>Hives</span>
                    <span className={styles.value}>
                        {beekeeper.number_of_hives}
                    </span>
                </div>
                <div className={styles.statItem}>
                    <i className="fas fa-calendar-alt"></i>
                    <span className={styles.label}>Experience</span>
                    <span className={styles.value}>
                        {beekeeper.years_of_experience} years
                    </span>
                </div>
                <div className={styles.statItem}>
                    <i className="fas fa-map-marker-alt"></i>
                    <span className={styles.label}>Location</span>
                    <span className={styles.value}>
                        {beekeeper.city}, {beekeeper.location}
                    </span>
                </div>
            </div>
            <div className={styles.mapContainer}>
                <MapContainer
                    center={[beekeeper.latitude, beekeeper.longitude]}
                    zoom={13}
                    style={{ height: "300px", width: "100%" }}
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <Marker
                        position={[beekeeper.latitude, beekeeper.longitude]}
                    >
                        <Popup>
                            {beekeeper.number_of_hives} hives in{" "}
                            {beekeeper.city}
                        </Popup>
                    </Marker>
                </MapContainer>
            </div>
        </div>
    );
};

export default BeekeeperCard;
