const searchBtn = document.querySelector(".search button");
const searchBox = document.querySelector(".search input");
const weatherIcon = document.querySelector(".weather-icon");
const weatherSection = document.querySelector(".weather");
const errorSection = document.querySelector(".error");
const card = document.querySelector(".card");

const apiKey = "ae0a4d1b1c6e89076b37a592e7937940";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

let isLoading = false;

// Add loading state to search button
function setLoadingState(loading) {
	isLoading = loading;
	if (loading) {
		searchBtn.innerHTML = '<div class="loading-spinner"></div>';
		searchBtn.style.pointerEvents = 'none';
		searchBox.disabled = true;
	} else {
		searchBtn.innerHTML = '<img src="weather-app-img/images/search.png" />';
		searchBtn.style.pointerEvents = 'auto';
		searchBox.disabled = false;
	}
}

// Add loading spinner styles dynamically
const style = document.createElement('style');
style.textContent = `
	.loading-spinner {
		width: 20px;
		height: 20px;
		border: 2px solid rgba(255, 255, 255, 0.3);
		border-top: 2px solid #fff;
		border-radius: 50%;
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		0% { transform: rotate(0deg); }
		100% { transform: rotate(360deg); }
	}
`;
document.head.appendChild(style);

async function checkWeather(city) {
	if (!city.trim() || isLoading) return;

	setLoadingState(true);

	// Hide previous results with animation
	weatherSection.style.display = "none";
	errorSection.style.display = "none";

	try {
		const response = await fetch(apiUrl + city + `&appid=${apiKey}`);

		// Add slight delay for better UX
		await new Promise(resolve => setTimeout(resolve, 500));

		if (response.status == 404) {
			errorSection.style.display = "block";
			weatherSection.style.display = "none";
		} else {
			const data = await response.json();

			// Update weather data
			document.querySelector(".city").innerHTML = data.name;
			document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°c";
			document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
			document.querySelector(".wind").innerHTML = data.wind.speed + "km/h";

			// Update weather icon with animation
			const newIconSrc = getWeatherIcon(data.weather[0].main);
			weatherIcon.style.opacity = "0";
			weatherIcon.style.transform = "scale(0.8)";

			setTimeout(() => {
				weatherIcon.src = newIconSrc;
				weatherIcon.style.opacity = "1";
				weatherIcon.style.transform = "scale(1)";
			}, 200);

			weatherSection.style.display = "block";
			errorSection.style.display = "none";
		}
	} catch (error) {
		console.error('Weather fetch error:', error);
		errorSection.querySelector('p').textContent = 'Failed to fetch weather data';
		errorSection.style.display = "block";
		weatherSection.style.display = "none";
	} finally {
		setLoadingState(false);
	}
}

function getWeatherIcon(weatherMain) {
	const iconMap = {
		'Clouds': 'weather-app-img/images/clouds.png',
		'Clear': 'weather-app-img/images/clear.png',
		'Rain': 'weather-app-img/images/rain.png',
		'Mist': 'weather-app-img/images/mist.png',
		'Drizzle': 'weather-app-img/images/drizzle.png',
		'Snow': 'weather-app-img/images/snow.png'
	};
	return iconMap[weatherMain] || 'weather-app-img/images/clear.png';
}

// Enhanced event listeners
searchBtn.addEventListener("click", () => {
	checkWeather(searchBox.value);
});

searchBox.addEventListener("keydown", (e) => {
	if (e.key === "Enter") {
		checkWeather(searchBox.value);
	}
});

// Add input focus animations
searchBox.addEventListener("focus", () => {
	card.style.transform = "translateY(-5px)";
});

searchBox.addEventListener("blur", () => {
	card.style.transform = "translateY(0)";
});

// Add smooth weather icon transition
weatherIcon.style.transition = "opacity 0.3s ease, transform 0.3s ease";

// Initialize with default city
window.addEventListener('load', () => {
	setTimeout(() => {
		checkWeather('New York');
	}, 1000);
});
