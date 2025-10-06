// Author: Jad Mohi-El-Din, Carleton University
// Team members: Jad Mohi-El-Din, Chirs Ahouzi (University of Toronto)
// NASA INTERNATIONAL SPACE APPS HACKATON October 5th 2025
//This code takes part of the website through which users receive weather characteristics with respect to the date and city they inputed
// The use of Chat GPT is acknowledged in the preparation of this code; Fixing errors, discovering new libraries/API's, generating fake data

// GEOCODING API, RETURNING LATITUDE AND LONGITUDE OF INPUTED CITY
async function decode(city) {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(city)}`,
    { headers: { "User-Agent": "MyApp/1.0 (jadmohieldin@gmail.com)" } }
  );
  const data = await response.json();
  if (data.length > 0) return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
  throw new Error("City not found");
}

// FAKE DATA TO SIMULATE INTENDED DISPLAY OF INFORMATION
const fakeWeatherData = [
  // Spring
  { temp: 12, wind: 3, humidity: 65, precip: 2 },
  { temp: 15, wind: 5, humidity: 60, precip: 0 },
  { temp: 18, wind: 4, humidity: 55, precip: 1 },
  { temp: 20, wind: 6, humidity: 58, precip: 3 },
  { temp: 14, wind: 7, humidity: 70, precip: 5 },
  
  // Summer
  { temp: 28, wind: 2, humidity: 45, precip: 0 },
  { temp: 30, wind: 3, humidity: 40, precip: 0 },
  { temp: 32, wind: 5, humidity: 50, precip: 2 },
  { temp: 26, wind: 4, humidity: 55, precip: 1 },
  { temp: 35, wind: 6, humidity: 38, precip: 0 },

  // Autumn
  { temp: 16, wind: 5, humidity: 65, precip: 1 },
  { temp: 13, wind: 7, humidity: 70, precip: 2 },
  { temp: 10, wind: 8, humidity: 75, precip: 3 },
  { temp: 8,  wind: 6, humidity: 80, precip: 5 },
  { temp: 12, wind: 9, humidity: 68, precip: 2 },

  // Winter
  { temp: -2, wind: 4, humidity: 60, precip: 1 },
  { temp: -5, wind: 6, humidity: 50, precip: 0 },   
  { temp: 0,  wind: 3, humidity: 75, precip: 2 },   
  { temp: -8, wind: 5, humidity: 55, precip: 0 },
  { temp: -3, wind: 7, humidity: 65, precip: 1 },

  // Random
  { temp: 5,  wind: 10, humidity: 70, precip: 4 },  
  { temp: 22, wind: 6,  humidity: 55, precip: 0 },
  { temp: 18, wind: 9,  humidity: 60, precip: 2 },
  { temp: 25, wind: 7,  humidity: 52, precip: 1 },
  { temp: 27, wind: 4,  humidity: 47, precip: 0 },

  // Stormy
  { temp: 19, wind: 12, humidity: 85, precip: 10 },
  { temp: 21, wind: 15, humidity: 80, precip: 12 },
  { temp: 23, wind: 10, humidity: 75, precip: 8 },
  { temp: 17, wind: 11, humidity: 78, precip: 6 },
  { temp: 20, wind: 14, humidity: 82, precip: 15 }
];

// associate direct variables to their respective elements
window.addEventListener("DOMContentLoaded", () => {
  const initialPanel   = document.getElementById("InfoDisplay1");
  const resultPanel = document.getElementById("RetrievedDisplay");

  const searchBtn = document.getElementById("SearchButton");
  const sendBtn   = document.getElementById("send");
  const redBtn    = document.getElementById("results");
  const greenBtn  = document.getElementById("results2");
  const prevBtn   = document.getElementById("results3");

  const locInput  = document.getElementById("location");
  const dateInput = document.getElementById("timeline");

  // When search button is pressed, the default panel shows up
  searchBtn.addEventListener("click", () => {
    initialPanel.style.visibility   = "visible";
    sendBtn.style.visibility     = "visible";
    redBtn.style.visibility      = "hidden";
    greenBtn.style.visibility    = "hidden";
    resultPanel.style.visibility = "hidden";
  });

  // When the send button is pressed, the information is "sent" and a random data will be returned
  sendBtn.addEventListener("click", async () => {
    const location = locInput.value.trim();
    const date     = dateInput.value;
    if (!location || !date) {
      alert("Please make sure all of the information fields are properly filled!");
      return;
    }

    // visibility changes to the buttons, once the send is pressed, a red "results" button is shows up to indicate that the data is being fetched
    sendBtn.style.visibility = "hidden";
    redBtn.style.visibility  = "visible";
    greenBtn.style.visibility = "hidden";

    // delay to simulate fetching of data
    await new Promise(resolve => setTimeout(resolve, 3000));

    // visual design for a marker to be set on inputed location (decoded into latitude and longitude using the geocoding API) and to zoom on it
    try{
    const {lat, lon} = await decode(location);
    console.log("coords:", lat, lon);


    setMarker(lat, lon);
    setTimeout(() => flyTo(lat,lon,0.9), 750);
} catch (err){
  console.error(err);
  alert("Could not find that location.");
}


    // choose a random row
    const randomLine = Math.floor(Math.random() * fakeWeatherData.length);
    const row = fakeWeatherData[randomLine];

  
    document.getElementById("Tempurature").textContent   = `Tempurature: ${row.temp} °C`;
    document.getElementById("WindSpeed").textContent     = `Wind Speed: ${row.wind} m/s`;
    document.getElementById("Humidity").textContent      = `Humidity: ${row.humidity} %`;
    document.getElementById("Percipitation").textContent = `Percipitation: ${row.precip} mm`;

    // images to display in the results panel once the data has been fetched and evaluated
    const img = document.getElementById("image");
    if (row.precip >= 8 && row.humidity >= 70 && row.temp > 15) src = "rainy.png";
    else if (row.precip >= 8 && row.temp < 0) src = "snowy.png";
    else if (row.wind >= 10 && row.precip <= 4 && row.temp > 15) src = "windy.png";
    else if (row.temp >= 15) src = "sunny.png";
    else if (row.temp <= 5) src = "cold.png";
    img.src = src;

    // data retrieved, first panel disappears, results panel appears
    resultPanel.style.visibility = "visible";
    redBtn.style.visibility = "hidden";
    initialPanel.style.visibility   = "hidden";
    prevBtn.style.visibility     = "visible";
  });

  // When previous button is pressed, the entire results panel disappears and the initial panel appears
  prevBtn.addEventListener("click", () => {
    initialPanel.style.visibility   = "visible";
    sendBtn.style.visibility     = "visible";
    greenBtn.style.visibility    = "visible";
    redBtn.style.visibility      = "hidden";
    resultPanel.style.visibility = "hidden";
    prevBtn.style.visibility = "hidden";
  });

  // When the green results button is pressed, we go back to the results panel and are able to review the previously generated data
  greenBtn.addEventListener("click", () => {
    initialPanel.style.visibility   = "hidden";
    sendBtn.style.visibility     = "hidden";
    greenBtn.style.visibility    = "hidden";
    redBtn.style.visibility      = "hidden";
    resultPanel.style.visibility = "visible";
    prevBtn.style.visibility = "visible";
  });

  // When the search button is pressed, we go back to the initial (default) panel
  searchBtn.addEventListener("click", () => {
    initialPanel.style.visibility   = "visible";
    sendBtn.style.visibility     = "visible";
    greenBtn.style.visibility    = "hidden";
    redBtn.style.visibility      = "hidden";
    resultPanel.style.visibility = "hidden";
    prevBtn.style.visibility = "hidden";
  });
});

