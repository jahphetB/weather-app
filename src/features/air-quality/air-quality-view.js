import { getAqiCategory } from "./air-quality.js";

function element(tag, className, text) {
  const node = document.createElement(tag);
  node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function aqiBadge(value) {
  const category = getAqiCategory(value);
  const badge = element("span", "aqi-badge", category.label);
  badge.dataset.tone = category.tone;
  return badge;
}

function concentration(value) {
  return value == null ? "Unavailable" : `${value.toLocaleString(undefined, { maximumFractionDigits: 1 })} µg/m³`;
}

export function createAirQualitySummary(weather) {
  const quality = weather.current.airQuality ?? {};
  const fragment = document.createDocumentFragment();
  fragment.append(element("h3", "air-quality-title", "Current air quality"));
  fragment.append(element("p", "air-quality-location", weather.location));

  const metrics = element("dl", "air-quality-metrics");
  for (const [label, value] of [
    ["US AQI", quality.usAqi ?? "Unavailable"],
    ["PM2.5", concentration(quality.pm25)],
    ["PM10", concentration(quality.pm10)],
  ]) {
    const metric = element("div", "air-quality-metric");
    const reading = element("dd", "", value);
    metric.append(element("dt", "", label), reading);
    if (label === "US AQI" && quality.usAqi != null) reading.append(aqiBadge(quality.usAqi));
    metrics.append(metric);
  }
  fragment.append(metrics);

  const time = element("p", "air-quality-note");
  if (Number.isFinite(weather.current.observedAt)) {
    const date = new Date(weather.current.observedAt * 1000);
    const timestamp = element("time", "", new Intl.DateTimeFormat(undefined, {
      timeZone: weather.timezone, month: "short", day: "numeric",
      hour: "numeric", minute: "2-digit", timeZoneName: "short",
    }).format(date));
    timestamp.dateTime = date.toISOString();
    time.append("Conditions time: ", timestamp);
  } else {
    time.textContent = "Conditions time unavailable.";
  }
  fragment.append(time);

  if ([quality.usAqi, quality.pm25, quality.pm10].every((value) => value == null)) {
    fragment.append(element("p", "air-quality-note", "Air-quality data is unavailable for this location."));
  }
  const note = element("p", "air-quality-note", "Air-quality forecasts may cover fewer days than the weather forecast. ");
  const link = element("a", "", "About the US AQI");
  link.href = "https://www.airnow.gov/aqi/aqi-basics/";
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  note.append(link);
  fragment.append(note);
  return fragment;
}

export function createForecastAirQuality(quality = {}) {
  const container = element("div", "forecast-air-quality");
  if ([quality.usAqi, quality.pm25, quality.pm10].every((value) => value == null)) {
    container.append(element("p", "", "Air quality unavailable"));
    return container;
  }
  container.append(element("p", "", `US AQI: ${quality.usAqi ?? "Unavailable"}`));
  if (quality.usAqi != null) container.append(aqiBadge(quality.usAqi));
  container.append(element("p", "", `PM2.5: ${concentration(quality.pm25)}`));
  container.append(element("p", "", `PM10: ${concentration(quality.pm10)}`));
  return container;
}
