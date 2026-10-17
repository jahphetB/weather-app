export function getWeatherTheme(icon = "") {
  if (icon.includes("snow")) return "snowy";
  if (icon.includes("thunder")) return "stormy";
  if (icon.includes("rain") || icon.includes("showers")) return "rainy";
  if (icon.includes("fog")) return "foggy";
  if (icon.includes("wind")) return "windy";
  if (icon.includes("partly-cloudy")) return "partly-cloudy";
  if (icon.includes("clear")) return "sunny";
  return "cloudy";
}
