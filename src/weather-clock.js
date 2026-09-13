let clockInterval;

function getWeatherEmoji(icon = "") {
	if (icon.includes("thunder")) return "⛈️";
	if (icon.includes("snow")) return "❄️";
	if (icon.includes("rain")) return "🌧️";
	if (icon.includes("fog")) return "🌫️";
	if (icon.includes("wind")) return "💨";
	if (icon.includes("partly-cloudy")) return "🌤️";
	if (icon.includes("cloudy")) return "☁️";
	if (icon.includes("clear")) return "✨";

	return "🌡️";
}

export function startCityClock(weather) {
	clearInterval(clockInterval);

	const clock = document.querySelector("#city-clock");
	const location = document.querySelector("#clock-location");
	const time = document.querySelector("#clock-time");
	const symbols = document.querySelector("#clock-symbols");

	const timeFormatter = new Intl.DateTimeFormat(undefined, {
		timeZone: weather.timezone,
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
	});

	const dateFormatter = new Intl.DateTimeFormat("en-US", {
		timeZone: weather.timezone,
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
	});

	location.textContent = weather.location;
	clock.hidden = false;

	function updateClock() {
		const now = new Date();
		const parts = dateFormatter.formatToParts(now);
		const getPart = (type) => parts.find((part) => part.type === type).value;
		const date = `${getPart("year")}-${getPart("month")}-${getPart("day")}`;
		const today = weather.forecast.find((day) => day.date === date);

		let dayEmoji = "🕒";
		let dayLabel = "Local time";

		if (today?.sunrise != null && today?.sunset != null) {
			const isDay =
				now.getTime() >= today.sunrise * 1000 &&
				now.getTime() < today.sunset * 1000;

			dayEmoji = isDay ? "☀️" : "🌙";
			dayLabel = isDay ? "Daytime" : "Nighttime";
		}

		time.textContent = timeFormatter.format(now);
		time.dateTime = now.toISOString();

		symbols.textContent = `${dayEmoji} ${getWeatherEmoji(weather.current.icon)}`;
		symbols.setAttribute("role", "img");
		symbols.setAttribute(
			"aria-label",
			`${dayLabel}; ${weather.current.conditions}`,
		);
	}

	updateClock();
	clockInterval = setInterval(updateClock, 1000);
}