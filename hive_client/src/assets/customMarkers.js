import MarkerPng from "../assets/images/beemarker.png"; // Ensure the path to marker.png is correct

// Custom Marker Icon
export const customMarkerIcon = L.icon({
    iconUrl: MarkerPng, // Path to your custom marker image
    iconSize: [109, 103], // Size of the icon [width, height]
    iconAnchor: [52, 103], // Anchor point of the icon [x, y]
    popupAnchor: [0, -41], // Position of the popup relative to the icon [x, y]
});
