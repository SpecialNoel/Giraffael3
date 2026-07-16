// ip-address-getter.js

// Call the external service (ipify) to get the public address of this running machine
async function getPublicIPAddress() {
    const response = await fetch("https://api.ipify.org?format=json");
    const { ip } = await response.json();
    return ip;
}

export { getPublicIPAddress };