import { getTimeOfDay } from "./features/appearance/time-theme.js";

let clockInterval;

function updateTimeTheme(now, timeZone, sun) {
  const theme = getTimeOfDay(now, timeZone, sun);
  if (document.body.dataset.timeOfDay !== theme) document.body.dataset.timeOfDay = theme;
  return theme;
}

export function startLocalTheme() {
  clearInterval(clockInterval);
  const timeZone = new Intl.DateTimeFormat().resolvedOptions().timeZone;
  const update = () => updateTimeTheme(new Date(), timeZone);
  update();
  clockInterval = setInterval(update, 60_000);
}

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

		const theme = updateTimeTheme(now, weather.timezone, today);
		const dayEmoji = theme === "night" ? "🌙" : "☀️";
		const dayLabel = theme === "night" ? "Nighttime" : theme === "morning" ? "Morning" : "Daytime";

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
