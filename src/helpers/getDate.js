export function getDate({ isoString, longDate = false }) {
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",

    ...(longDate
      ? { hour: "2-digit", minute: "2-digit", weekday: "long" }
      : {}),
  };

  return new Date(isoString).toLocaleString(undefined, options);
}
