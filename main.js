async function getLocation() {
    return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                const lat = position.coords.latitude;
                const long = position.coords.longitude;
                resolve({lat, long});
            });
        } else {
            console.log("Geolocation is not supported by this browser.");
            reject("Lat or Long has not been supplied.");
        }
    });
}


function formatTime(currentTime) {
    let hours = currentTime.getHours();
    const minutes = currentTime.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    setBackground(hours, ampm);
    return `${hours}:${minutes} ${ampm}`;
}

function setBackground(hours, ampm) {
    const greetingTxt = document.getElementById("greeting-txt");
    const body = document.getElementById("body");

    if (hours >= 5 && hours < 9 && ampm === 'AM') {
        greetingTxt.innerHTML = "Good Morning, Little Bird.";
        body.style.backgroundImage = "var(--sunrise-gradient)";
    } else if (hours >= 9 && hours < 12 && ampm === 'AM' || hours >= 0 && hours < 6 && ampm === 'PM') {
        greetingTxt.innerHTML = "Good Day, Little Bird.";
        body.style.backgroundImage = "var(--daytime-gradient)";
    } else if (hours >= 6 && hours < 8 && ampm === 'PM') {
        greetingTxt.innerHTML = "Good Evening, Little Bird.";
        body.style.backgroundImage = "var(--sunset-gradient)";
    } else {
        greetingTxt.innerHTML = "Good Night, Little Bird.";
        body.style.backgroundImage = "var(--nighttime-gradient)";
    };

}


window.addEventListener('load', async ()=> {

    // The API key for OpenWeather
    const APIkey ="8f9e84d034717c6f80388c02c984a4ea";
    
    // Gets coords
    const {lat, long} = await getLocation();

    // Uses coords to get City, Country and updates the Location Text in HTML
    const geoAPI =`https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${long}&limit=5&appid=${APIkey}`;
    const geoResponse = await fetch(geoAPI);
    const geoJson = await geoResponse.json();
    const city = geoJson[0].name;
    const country = geoJson[0].country;
    let locationTxt = document.getElementById("location-txt");
    locationTxt.innerHTML = `${city}, ${country}`;
    
    // Uses coords to get temp and updates the temp text in HTML    
    const tempTxt = document.getElementById("temp-number");
    const tempDescription = document.getElementById("description-txt");
    const weatherAPI =`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${APIkey}`;
    const weatherResponse = await fetch(weatherAPI);
    const weatherJson = await weatherResponse.json();

    // Calculate local time and updates the time text in HTML
    let currentTime = new Date();
    const formattedTime = formatTime(currentTime);
    const timeTxt = document.getElementById("time-txt");
    timeTxt.innerHTML = `Last Updated: ${formattedTime}`;

    // FUN TEXT BASED ON TEMP
    let tempKalvin = await weatherJson.main.temp;
    let tempCelcius = Math.round(tempKalvin - 273.15);

    if (tempCelcius <= 0) {
        tempDescription.innerHTML = "It's too cold, get back in the nest";
        tempTxt.innerHTML = `${tempCelcius}`;
    } else if (tempCelcius >= 0 && tempCelcius <= 25){
        tempDescription.innerHTML = "It's a good day for flying";
        tempTxt.innerHTML = `${tempCelcius}`;
    } else if (tempCelcius >= 25){
        tempDescription.innerHTML = "Stay in the shade, it's too hot";
        tempTxt.innerHTML = `${tempCelcius}`;
    } else {
        tempDescription.innerHTML = "I can't see, I don't know";
        tempTxt.innerHTML = `${tempCelcius}`;
    };

    // TEST SECTION     
    console.log(`Beginning of Testing Section`);
    console.log(`Latitude: ${lat}, Longitude: ${long}`);
    console.log(`Using API key: ${APIkey}`);
    console.log(geoJson);
    console.log(city);
    console.log(country);
    console.log(`${city}, ${country}`);

    
    console.log(weatherJson);
    console.log(tempCelcius);
    console.log(`End of Testing Section`);
});