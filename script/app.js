// _ = helper functions
let sun, timeLeft, timeLeftQuery, totalMins, passedMin, dateNu, riseandshine




function _parseMillisecondsIntoReadableTime(timestamp) {
	//Get hours from milliseconds
	const date = new Date(timestamp * 1000);
	// Hours part from the timestamp
	const hours = '0' + date.getHours();
	// Minutes part from the timestamp
	const minutes = '0' + date.getMinutes();
	// Seconds part from the timestamp (gebruiken we nu niet)
	// const seconds = '0' + date.getSeconds();

	// Will display time in 10:30(:23) format
	return hours.substr(-2) + ':' + minutes.substr(-2); //  + ':' + s
}

// 5 TODO: maak updateSun functie
const updateSun = function(){
	let dateNow = Date.now() / 1000	
	dateNu = dateNow
	let passedMinutes = (dateNu - riseandshine) / 60
	passedMin = passedMinutes
	let timeRemaining = Math.round((totalMins - passedMin))
	timeLeft = timeRemaining
	if (timeLeft < 0){
		timeLeftQuery.innerHTML = `No`
		document.querySelector(".js-muted").innerHTML = `more sunlight left today 😔, but tomorrow there will be more!`
		document.querySelector("html").classList.add("is-night")
	}
	else{
		timeLeftQuery.innerHTML = `${timeLeft} minutes`
	}
	let leftPercentage = ((passedMin / totalMins) * 100)
	if (leftPercentage > 50){
	bottomPercentage = (100 - leftPercentage) * 2
	}

	else{	
	bottomPercentage = (leftPercentage * 2);
	}

	// Nu zetten we de zon op de initiële goede positie ( met de functie updateSun ). Bereken hiervoor hoeveel procent er van de totale zon-tijd al voorbij is.
	sun.style["cssText"] = `bottom: ${bottomPercentage}%; left: ${leftPercentage}%`;
	sun.dataset["time"] = `${_parseMillisecondsIntoReadableTime(dateNu)}`
	console.log("data updated 👍")
}

// 4 Zet de zon op de juiste plaats en zorg ervoor dat dit iedere minuut gebeurt.
let placeSunAndStartMoving = (totalMinutes, sunrise) => {
	// In de functie moeten we eerst wat zaken ophalen en berekenen.
	// Haal het DOM element van onze zon op en van onze aantal minuten resterend deze dag.
	let sunQuery = document.querySelector(".js-sun")
	sun = sunQuery
	let LeftQuery = document.querySelector(".js-time-left")
	timeLeftQuery = LeftQuery
	let bottomPercentage;
	// Bepaal het aantal minuten dat de zon al op is.s
	let leftPercentage = ((passedMin / totalMinutes) * 100)

	if (leftPercentage > 50){
		bottomPercentage = (100 - leftPercentage) * 2
	}

	else{
		bottomPercentage = (leftPercentage * 2);
	}
	// Nu zetten we de zon op de initiële goede positie ( met de functie updateSun ). Bereken hiervoor hoeveel procent er van de totale zon-tijd al voorbij is.
	sun.style["cssText"] = `bottom: ${bottomPercentage}%; left: ${leftPercentage}%`;
	sun.dataset["time"] = `${_parseMillisecondsIntoReadableTime(dateNu)}`
	// We voegen ook de 'is-loaded' class toe aan de body-tag.
	document.querySelector("body").classList.add("is-loaded")
	// Vergeet niet om het resterende aantal minuten in te vullen.
	timeLeftQuery.innerHTML = `${timeLeft}`
	// Nu maken we een functie die de zon elke minuut zal updaten
	setInterval(updateSun, 30*1000)
	updateSun()
	// Bekijk of de zon niet nog onder of reeds onder is
	// Anders kunnen we huidige waarden evalueren en de zon updaten via de updateSun functie.
	// PS.: vergeet weer niet om het resterend aantal minuten te updaten en verhoog het aantal verstreken minuten.
};

// 3 Met de data van de API kunnen we de app opvullen
let showResult = queryResponse => {
	console.log(queryResponse)
	// We gaan eerst een paar onderdelen opvullen
	// Zorg dat de juiste locatie weergegeven wordt, volgens wat je uit de API terug krijgt.
	document.querySelector('.js-location').innerHTML = `${queryResponse.city.name}, ${queryResponse.city.country}`
	// Toon ook de juiste tijd voor de opkomst van de zon en de zonsondergang.
	document.querySelector('.js-sunrise').innerHTML = `${_parseMillisecondsIntoReadableTime(queryResponse.city.sunrise)}`
	document.querySelector('.js-sunset').innerHTML = `${_parseMillisecondsIntoReadableTime(queryResponse.city.sunset)}`
	// Hier gaan we een functie oproepen die de zon een bepaalde positie kan geven en dit kan updaten.
	// Geef deze functie de periode tussen sunrise en sunset mee en het tijdstip van sunrise.
	let minutes = ((queryResponse.city.sunset - queryResponse.city.sunrise) / 60)
	totalMins = minutes
	riseandshine = queryResponse.city.sunrise

	placeSunAndStartMoving(minutes, queryResponse.city.sunrise)

};

// 2 Aan de hand van een longitude en latitude gaan we de yahoo weather API ophalen.
let getAPI = (lat, lon) => {
		// Eerst bouwen we onze url op
		let APIKey = "f32e95f7ecef718c3db6cec4d8ffc22f";
		let uri = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${APIKey}&units=metric&lang=nl&cnt=1`;

		// Met de fetch API proberen we de data op te halen.
		fetch(uri)
			.then(function (response) {
				if (!response.ok) {
					throw Error(
						`Looks like there was a problem. Status Code: ${response.status}`
					);
				} else {
					return response.json();
				}
			})
			.then(function (jsonObject) {
				showResult(jsonObject);
			})
			.catch(function (error) {
				console.error(`fout bij verwerken json ${error}`);
			});

		// Als dat gelukt is, gaan we naar onze showResult functie.
};

document.addEventListener('DOMContentLoaded', function() {
	// 1 We will query the API with longitude and latitude.
	getAPI(50.8027841, 3.2097454);
});
