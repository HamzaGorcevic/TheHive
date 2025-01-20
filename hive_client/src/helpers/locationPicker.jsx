import React, { useEffect, useState } from "react";
import {
    MapContainer,
    TileLayer,
    Marker,
    useMapEvents,
    useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import L from "leaflet"; // Import Leaflet for custom icon configuration
import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";
import "leaflet-geosearch/dist/geosearch.css";
import MarkerPng from "../assets/images/beemarker.png"; // Ensure the path to marker.png is correct

// Custom Marker Icon
const customMarkerIcon = L.icon({
    iconUrl: MarkerPng, // Path to your custom marker image
    iconSize: [100, 103], // Size of the icon [width, height]
    iconAnchor: [52, 103], // Anchor point of the icon [x, y]
    popupAnchor: [0, -41], // Position of the popup relative to the icon [x, y]
});

const LocationMarker = ({ onLocationSelect }) => {
    const [position, setPosition] = useState(null);

    useMapEvents({
        click: async (e) => {
            const { lat, lng } = e.latlng;
            setPosition([lat, lng]);

            try {
                const response = await axios.get(
                    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
                );

                const address = response.data.address;
                onLocationSelect({
                    lat,
                    lng,
                    country: address.country || "",
                    city: address.city || address.town || address.village || "",
                });
            } catch (error) {
                console.error("Error fetching location data:", error);
            }
        },
    });

    return position ? (
        <Marker position={position} icon={customMarkerIcon} />
    ) : null;
};

function LeafletgeoSearch() {
    const map = useMap();
    useEffect(() => {
        const provider = new OpenStreetMapProvider();

        const searchControl = new GeoSearchControl({
            provider,
            style: "bar",
            showMarker: false,
        });

        map.addControl(searchControl);
        return () => map.removeControl(searchControl);
    }, []);

    return null;
}

const LocationPicker = ({ onLocationSelect }) => {
    return (
        <MapContainer
            center={[51.505, -0.09]}
            zoom={13}
            style={{ height: "400px", width: "100%" }}
        >
            <LeafletgeoSearch />

            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <LocationMarker onLocationSelect={onLocationSelect} />
        </MapContainer>
    );
};

export default LocationPicker;
