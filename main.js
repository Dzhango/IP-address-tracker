window.addEventListener("load", init);

const map = L.map('map');
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

function init() {
    initIpSearch();
};

function initIpSearch() {
    const inputIP = document.querySelector("#ip-input");
    const submitBtn = document.querySelector("#submit");
    submitBtn.addEventListener('click', (e) => {
        fetchIPMap(inputIP.value);
        fetchIPData(inputIP.value);
    });
    window.addEventListener('keyup', (e) => {
        if (e.keyCode === 13) {
            fetchIPMap(inputIP.value);
            fetchIPData(inputIP.value);
        }
    });
    // check is API flag for client's IP
    fetchIPMap("check");
    fetchIPData("");

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

async function fetchIPMap(ip) {
    const url = `http://api.ipstack.com/${ip}?access_key=f71aa2c29208c9164be4bd0d782a3e18`;

    const response = await fetch(url);
    const json = await response.json();
    if (response.status === 200) {
        updateMap(json);
    } else {
        console.error(`Responded with status code: ${response.status}`)
    }
}

async function fetchIPData(ip, domain) {
    const url = `https://geo.ipify.org/api/v2/country?apiKey=at_Pje4dhNLiddNfP5Cr2rZpaHVbRvEz&ipAddress=${ip}&domain=${ip}`;
    const response = await fetch(url);
    const json = await response.json();
    if (response.status === 200) {
        updateDOM(json);

    } else {
        console.error(`Responded with status code: ${response.status}`)
    }
}