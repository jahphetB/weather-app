export function getTimeOfDay(now, timeZone, sun = {}) {
  const hour = Number(new Intl.DateTimeFormat("en-US", {
    timeZone, hour: "numeric", hourCycle: "h23",
  }).format(now));
  const hasSunTimes = Number.isFinite(sun.sunrise) && Number.isFinite(sun.sunset)
    && sun.sunset > sun.sunrise;
  const isDay = hasSunTimes
    ? now.getTime() >= sun.sunrise * 1000 && now.getTime() < sun.sunset * 1000
    : hour >= 6 && hour < 18;
  if (!isDay) return "night";
  return hour < 12 ? "morning" : "day";
}
