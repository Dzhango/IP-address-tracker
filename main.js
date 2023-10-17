window.addEventListener("load", init);
const map = L.map('map');

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

function init() {
    navigator.geolocation.getCurrentPosition((position) => {
        updateMap(position.coords)
    }, mapInit)
    initIpSearch();
};


function mapInit() {
    const map = L.map('map').setView([51.505, -0.09], 13);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    L.marker([51.5, -0.09]).addTo(map)
        .bindPopup('A pretty CSS popup.<br> Easily customizable.')
        .openPopup();
}

function initIpSearch() {
    const inputIP = document.querySelector("#ip-input");
    const submitBtn = document.querySelector("#submit");
    submitBtn.addEventListener('click', (e) => {
        fetchIP(inputIP.value);
    })
    fetchIP("");
}

function updateDOM(json) {
    console.log(json)
        // update output text
    const pTagArray = document.querySelectorAll('.result');
    pTagArray[0].innerText = json.ip;
    pTagArray[1].innerText = `${json.location.region}, ${json.location.country}`;
    pTagArray[2].innerText = `UTC ${json.location.timezone}`;
    pTagArray[3].innerText = json.isp;

}

function updateMap(coordinates) {
    map.setView({ lng: coordinates.longitude, lat: coordinates.latitude }, 13)
    L.marker({ lng: coordinates.longitude, lat: coordinates.latitude }).addTo(map)
        .bindPopup('IP Address Location')
        .openPopup();
}


async function fetchIP(ip) {
    try {
        const response = await fetch(
            `http://api.ipstack.com/${ip}?access_key=f71aa2c29208c9164be4bd0d782a3e18`);
        const json = await response.json();
        if (response.status === 200) {
            updateMap(json);
        } else {
            console.error(`Responded with status code: ${response.status}`)
        }
    } catch (error) {
        console.log(error)
    }

    try {
        const response = await fetch(
            `https://geo.ipify.org/api/v2/country?apiKey=at_Pje4dhNLiddNfP5Cr2rZpaHVbRvEz&ipAddress=${ip}`);
        const json = await response.json();
        if (response.status === 200) {
            updateDOM(json);
        } else {
            console.error(`Responded with status code: ${response.status}`)
        }
    } catch (error) {
        console.log(error)
    }
}