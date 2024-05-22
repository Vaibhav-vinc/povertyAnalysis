const MAPBOX_URL =
    "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1Ijoiam9ubnltY2N1bGxhZ2giLCJhIjoiY2xsYzdveWh4MGhwcjN0cXV5Z3BwMXA1dCJ9.QoEHzPNq9DtTRrdtXfOdrw"; //! Someone Else's ACCESS TOKEN 💀
const LYR_STREETS = new L.tileLayer(MAPBOX_URL, {
    id: "mapbox/streets-v11",
    maxZoom: 28,
    tileSize: 512,
    zoomOffset: -1,
});

const ESRI_URL =
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
const LYR_SATELLITE = new L.tileLayer(ESRI_URL, {
    id: "MapID",
    maxZoom: 20,
    tileSize: 512,
    zoomOffset: -1,
});

const TILE_LAYER_URL = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const LYR_OPEN_STREET = new L.tileLayer(TILE_LAYER_URL, {});

// Bangladesh Capital: Dhaka
let latitude = 23.7807527;
let longitude = 90.254534;

const MARKER = new L.marker({ lat: latitude, lng: longitude }, {});

const bindDefaultMarkerPopup = () => {
    MARKER.bindPopup("Dhaka, Bangladesh");
};
const CORNER1 = new L.latLng(20.57, 88.02);
const CORNER2 = new L.latLng(26.6, 92.68);
const MAP_BOUNDS = new L.latLngBounds(CORNER1, CORNER2);

let MAP = null;
const initMap = async () => {
    MAP = new L.map("map", {
        center: [latitude, longitude],
        crs: L.CRS.EPSG3857, // Co-ordinate Reference System
        zoom: 5,
        minZoom: 1,
        maxZoom: 19,
        zoomControl: true,
        preferCanvas: true,
        layers: [LYR_OPEN_STREET, LYR_SATELLITE],
        worldCopyJump: true,
        maxBounds: MAP_BOUNDS,
    });
    MAP.setZoom(MAP.getBoundsZoom(MAP_BOUNDS));

    MARKER.addTo(MAP);

    const baseMaps = {
        Streets: LYR_OPEN_STREET,
        Satellite: LYR_SATELLITE,
    };

    L.control.layers(baseMaps).addTo(MAP);
    document.querySelector(".leaflet-control-attribution").remove();
};

const setMapLocation = (latitude, longitude) => {
    MARKER.setLatLng([latitude, longitude]).update();
    MAP.flyTo(MARKER.getLatLng(), 12);
};

const setScreenshotterToMap = () => {
    return new L.simpleMapScreenshoter().addTo(MAP);
};
