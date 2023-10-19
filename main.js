window.addEventListener("load", init);
const map = L.map('map');

function init() {
    initIpSearch();
    // add creds to map
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
};

function initIpSearch() {
    const inputIP = document.querySelector("#ip-input");
    const submitBtn = document.querySelector("#submit");
    submitBtn.addEventListener('click', (e) => {
        fetchIPData(inputIP.value);
    });
    window.addEventListener('keyup', (e) => {
        if (e.keyCode === 13) {
            fetchIPData(inputIP.value);
        }
    });
    //fetches client's ip address
    fetchIPData("");
}

function updateDOM(json) {
    // update map
    map.setView({ lng: json.location.lng, lat: json.location.lat }, 13)
    L.marker({ lng: json.location.lng, lat: json.location.lat }).addTo(map)
        .bindPopup('IP Address Location')
        .openPopup();
    // update output text
    const pTagArray = document.querySelectorAll('.result');
    pTagArray[0].innerText = json.ip;
    pTagArray[1].innerText = `${json.location.region}, ${json.location.country}`;
    pTagArray[2].innerText = `UTC ${json.location.timezone}`;
    pTagArray[3].innerText = json.isp;
}

async function fetchIPData(ip, domain) {
    const url = `https://geo.ipify.org/api/v2/country,city?apiKey=at_Pje4dhNLiddNfP5Cr2rZpaHVbRvEz&ipAddress=${ip}&domain=${ip}`;
    const response = await fetch(url);
    const json = await response.json();
    if (response.status === 200) {
        updateDOM(json);
    } else {
        console.error(`Responded with status code: ${response.status}`)
    }
}