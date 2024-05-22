const datalist = document.getElementById("jsonList");

const MARKER_CLUSTER = new L.markerClusterGroup({});

const getJsonData = async () => {
    const response = await fetch(jsonFileUrl);
    const json = await response.json();
    return json;
};

const getOptionElement = (row) => {
    newOption = document.createElement("option");
    newOption.value = row["Location Name"];
    newOption.setAttribute("data-latitude", row["Latitude"]);
    newOption.setAttribute("data-longitude", row["Longitude"]);
    newOption.setAttribute("data-water", row["Access to water (in Hrs)"]);
    newOption.setAttribute("data-electricity", row["Access to electricity"]);
    newOption.setAttribute("data-cellphone", row["Access to cellphone"]);
    newOption.setAttribute("data-education", row["Education completed"]);
    newOption.setAttribute(
        "data-wealthIndex",
        row["Wealth Index Factor Score"]
    );
    return newOption;
};

const addOptionElementsToDatalist = async () => {
    const DATA = await getJsonData();
    for (const record in DATA) {
        let optionElement = getOptionElement(DATA[record]);
        datalist.appendChild(optionElement);
    }
};

const fillDataFromOptionAttributes = (option) => {
    document.getElementById("wealthIndex").textContent =
        option.getAttribute("data-wealthIndex");
    document.getElementById("accessToWater").textContent =
        option.getAttribute("data-water");
    document.getElementById("accessToElec").textContent =
        option.getAttribute("data-electricity");
    document.getElementById("accessToCell").textContent =
        option.getAttribute("data-cellphone");
    document.getElementById("education").textContent = Number(
        option.getAttribute("data-education")
    ).toFixed(2);
};

const showDataFields = () => {
    const annualData = document.getElementById("annualData");
    const annualDataHeading = document.getElementById("annualDataHeading");
    annualDataHeading.textContent = "Annual Data";
    annualDataHeading.classList.add("border-b-4", "border-dashed", "pb-3");
    annualData.classList.remove("hidden");
};

const addCircleMarkers = async () => {
    const data = await getJsonData();

    for (const record in data) {
        let latitude = parseFloat(data[record]["Latitude"]);
        let longitude = parseFloat(data[record]["Longitude"]);
        let waterDistance = parseFloat(
            data[record]["Access to water (in Hrs)"]
        );
        let circleRadius =
            waterDistance < 2 ? waterDistance * 6 : waterDistance * 2;
        let wealthIdxScore = data[record]["Wealth Index Factor Score"];

        let circleMarker = L.circleMarker([latitude, longitude], {
            radius: circleRadius,
            color: wealthIdxScore > 1 ? "blue" : "red",
            fillColor: wealthIdxScore > 1 ? "blue" : "red",
            fillOpacity: 0.25,
        });

        circleMarker
            .on("click", () => {
                let lat = parseFloat(circleMarker.getLatLng().lat)
                let lng = parseFloat(circleMarker.getLatLng().lng)
                console.log("lat", lat);
                console.log("lng", lng);
                setMapLocation(lat, lng);
                MARKER.setPopupContent(
                    `<b>Location:</b> ${data[record]["Location Name"]}`
                );
                fillDataFromOptionAttributes(getOptionElement(data[record]));
                document.getElementById(
                    "location-input"
                ).value = `${data[record]["Location Name"]}`;
                showDataFields();
            })
            .addTo(MARKER_CLUSTER);
    }
};

document.getElementById("location-input").addEventListener("input", () => {
    showDataFields();
    const value = document.getElementById("location-input").value;
    let selectedOption = null;
    const options = datalist.querySelectorAll("option");
    options.forEach((option) => {
        if (option.value === value) {
            selectedOption = option;
            fillDataFromOptionAttributes(selectedOption);
            latitude = parseFloat(selectedOption.getAttribute("data-latitude"));
            longitude = parseFloat(
                selectedOption.getAttribute("data-longitude")
            );
            setMapLocation(latitude, longitude);
        }
    });
});

document.addEventListener("DOMContentLoaded", async () => {
    bindDefaultMarkerPopup();
    await initMap();
    await addOptionElementsToDatalist();
    await addCircleMarkers();
    MARKER_CLUSTER.addTo(MAP);
});
