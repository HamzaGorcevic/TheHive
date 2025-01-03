import React, { useContext, useState, useEffect } from "react";
import styles from "./beekeeper.module.scss";
import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    useMapEvents,
    useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Pencil, Trash2, X, Check } from "lucide-react";
import axiosClient from "../../axios";
import { toast } from "react-toastify";
import StateContext from "../../contexts/authcontext";
import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";
import "leaflet-geosearch/dist/geosearch.css";

// New component to handle map interactions
const LocationMarker = ({ position, setPosition, isEditing, setFormData }) => {
    const map = useMapEvents({
        click(e) {
            if (isEditing) {
                const newPosition = {
                    latitude: e.latlng.lat,
                    longitude: e.latlng.lng,
                };

                // Use reverse geocoding to get city and location
                fetch(
                    `https://nominatim.openstreetmap.org/reverse?lat=${e.latlng.lat}&lon=${e.latlng.lng}&format=json`
                )
                    .then((response) => response.json())
                    .then((data) => {
                        console.log(data);
                        setFormData((prev) => ({
                            ...prev,
                            latitude: e.latlng.lat,
                            longitude: e.latlng.lng,
                            city:
                                data.address.city ||
                                data.address.town ||
                                data.address.village ||
                                "",
                            location: data.address.country || "",
                        }));
                    });

                setPosition(newPosition);
            }
        },
    });

    return position ? (
        <Marker position={[position.latitude, position.longitude]}>
            <Popup>Selected location</Popup>
        </Marker>
    ) : null;
};

// Component to add the GeoSearch control to the map
const LeafletGeoSearch = () => {
    const map = useMap();

    useEffect(() => {
        const provider = new OpenStreetMapProvider();

        const searchControl = new GeoSearchControl({
            provider,
            style: "bar", // Search bar style
            showMarker: true, // Show marker for the searched location
            retainZoomLevel: false, // Retain zoom level after search
            animateZoom: true, // Animate zoom to the searched location
            autoComplete: true, // Enable autocomplete
            autoCompleteDelay: 250, // Autocomplete delay
        });

        map.addControl(searchControl);

        // Cleanup on unmount
        return () => {
            map.removeControl(searchControl);
        };
    }, [map]);

    return null;
};

const BeekeeperCard = ({ beekeeper, isViewMode }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        number_of_hives: beekeeper?.number_of_hives || 0,
        years_of_experience: beekeeper?.years_of_experience || 0,
        location: beekeeper?.location || "",
        city: beekeeper?.city || "",
        latitude: beekeeper?.latitude || 0,
        longitude: beekeeper?.longitude || 0,
    });
    const { updateUser } = useContext(StateContext);

    const [position, setPosition] = useState({
        latitude: beekeeper?.latitude || 0,
        longitude: beekeeper?.longitude || 0,
    });

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSave = async () => {
        try {
            const response = await axiosClient.put("/user/profile", {
                beekeeper_data: formData,
            });
            updateUser(response.data.token, response.data.user);
            setIsEditing(false);
            toast.success("Profile updated successfully");
        } catch (error) {
            toast.error("Failed to update beekeeper profile:" + error);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        setFormData({
            number_of_hives: beekeeper?.number_of_hives || 0,
            years_of_experience: beekeeper?.years_of_experience || 0,
            location: beekeeper?.location || "",
            city: beekeeper?.city || "",
            latitude: beekeeper?.latitude || 0,
            longitude: beekeeper?.longitude || 0,
        });
        setPosition({
            latitude: beekeeper?.latitude || 0,
            longitude: beekeeper?.longitude || 0,
        });
    };

    return (
        <div className={styles.beekeeperCard}>
            <div className={styles.cardHeader}>
                <h2>Beekeeper Details</h2>
                {!isViewMode && (
                    <div className={styles.actions}>
                        {!isEditing ? (
                            <button
                                onClick={handleEdit}
                                className={styles.editButton}
                            >
                                <Pencil size={20} />
                            </button>
                        ) : (
                            <>
                                <button
                                    onClick={handleSave}
                                    className={styles.saveButton}
                                >
                                    <Check size={20} />
                                </button>
                                <button
                                    onClick={handleCancel}
                                    className={styles.cancelButton}
                                >
                                    <X size={20} />
                                </button>
                            </>
                        )}
                    </div>
                )}
            </div>
            <div className={styles.stats}>
                <div className={styles.statItem}>
                    <i className="fas fa-archive"></i>
                    <span className={styles.label}>Hives</span>
                    {isEditing ? (
                        <input
                            type="number"
                            value={formData.number_of_hives}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    number_of_hives: parseInt(e.target.value),
                                })
                            }
                            className={styles.editInput}
                        />
                    ) : (
                        <span className={styles.value}>
                            {beekeeper.number_of_hives}
                        </span>
                    )}
                </div>
                <div className={styles.statItem}>
                    <i className="fas fa-calendar-alt"></i>
                    <span className={styles.label}>Experience</span>
                    {isEditing ? (
                        <input
                            type="number"
                            value={formData.years_of_experience}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    years_of_experience: parseInt(
                                        e.target.value
                                    ),
                                })
                            }
                            className={styles.editInput}
                        />
                    ) : (
                        <span className={styles.value}>
                            {beekeeper.years_of_experience} years
                        </span>
                    )}
                </div>
                <div className={styles.statItem}>
                    <i className="fas fa-map-marker-alt"></i>
                    <span className={styles.label}>Location</span>
                    <span className={styles.value}>
                        {formData.city
                            ? `${formData.city}, ${formData.location}`
                            : isEditing
                            ? "Click on map to set location"
                            : "No location set"}
                    </span>
                </div>
            </div>
            <div className={styles.mapContainer}>
                {isEditing && (
                    <div className={styles.mapInstructions}>
                        Click on the map to set your location
                    </div>
                )}
                <MapContainer
                    center={[position.latitude, position.longitude]}
                    zoom={13}
                    style={{ height: "400px", width: "100%" }}
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <LocationMarker
                        position={position}
                        setPosition={setPosition}
                        isEditing={isEditing}
                        setFormData={setFormData}
                    />
                    {isEditing && <LeafletGeoSearch />}
                </MapContainer>
            </div>
        </div>
    );
};

export default BeekeeperCard;
