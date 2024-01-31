const userTab= document.querySelector("[data-userWeather]");
const searchTab= document.querySelector("[data-searchWeather]");
const userContainer= document.querySelector(".weatherContainer");
const grantAccessContainer =document.querySelector(".grantLocationContainer");
const searchForm= document.querySelector("[data-searchForm]");
const loadingScreen= document.querySelector(".loading-Screen");
const userInfoContainer= document.querySelector(".user-info");
const notFoundContainer = document.querySelector("[notFoundSection]");
// INitial Variables
let currentTab= userTab;
currentTab.classList.add("current-Tab");
const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";
getFromSessionStorage();

function switchTabs(clickedTab){
    if(clickedTab!==currentTab){
        currentTab.classList.remove("current-Tab");
        currentTab=clickedTab;
        currentTab.classList.add("current-Tab");

        if(!searchForm.classList.contains("active")){
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        }

        else{
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            getFromSessionStorage();
        }
    }
    notFoundContainer.classList.remove("active");
    
}
function getFromSessionStorage(){
    const localCoodinates = sessionStorage.getItem("user-coordinates");
    if(!localCoodinates){
        grantAccessContainer.classList.add("active");
    }
    else{
        const coordinates=JSON.parse(localCoodinates);
        fetchWeatherInfo(coordinates);
    }
}

async function fetchWeatherInfo(coordinates){
    const {lat,lon}=coordinates;
    grantAccessContainer.classList.remove("active");
    loadingScreen.classList.add("active");

    //api call
    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        const data= await response.json();
        if (!data.sys) {
            throw data;
        }
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err){
        userInfoContainer.classList.remove("active");
        loadingScreen.classList.remove("active");
        notFoundContainer.classList.add("active");
        errorPara.innerText = `${err?.message}`;
        errorBtn.addEventListener("click", fetchWeatherInfo);
    }
}

function renderWeatherInfo(data){
    const cityName= document.querySelector("[city-name]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const weatherDescription = document.querySelector("[weather-Description]");
    const weatherIcon = document.querySelector("[data-WeatherIcon]");
    const temprature = document.querySelector("[data-temp]");

    const windSpeed= document.querySelector("[data-windSpeed]");
    const humidity = document.querySelector("[data-humidity]");
    const clouds = document.querySelector("[data-clouds]");
 
    cityName.innerText = data?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${data?.sys?.country.toLowerCase()}.png`;
    weatherDescription.innerText =  data?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${data?.weather?.[0]?.icon}.png`;
    temprature.innerText = `${data?.main?.temp}°C`;
    windSpeed.innerText = `${data?.wind?.speed} m/s`;
    humidity.innerText = `${data?.main?.humidity} %`;
    clouds.innerText = `${data?.clouds?.all}%`;
    
}

userTab.addEventListener("click",()=>{
    //pass parameter jis pr click kiya h
    switchTabs(userTab);
});

searchTab.addEventListener("click",()=>{
    //pass parameter jis pr click kiya h
    switchTabs(searchTab);
});

const grantAccessBtn = document.querySelector("[data-grantAccess]");
grantAccessBtn.addEventListener("click",getLocation);

function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        ///////////////
        grantAccessButton.style.display = "none";
    }
}

function showPosition(position){
    const userCoordinates={
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }
    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    fetchWeatherInfo(userCoordinates);
}

const cityInput = document.querySelector("[data-searchInput]");
searchForm.addEventListener("submit",(e)=>{
    e.preventDefault();
    let cityName = cityInput.value;
    
    if(cityName===""){
        return;
    }
    else{
        fetchCityWeatherInfo(cityName);
    }
})

const errorPara = document.querySelector("[data-errorText]");
const errorBtn = document.querySelector("[data-errorButton]");
async function fetchCityWeatherInfo(city){
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");
    try{
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
          );
        const data =await response.json();
        if (!data.sys) {
            throw data;
        }
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(e){

        userInfoContainer.classList.remove("active");
        loadingScreen.classList.remove("active");
        notFoundContainer.classList.add("active");
        errorPara.innerText = `${e?.message}`;
        errorBtn.style.display="none";
    }
}
