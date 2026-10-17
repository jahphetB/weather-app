function capitalizeName(value) {
  // Preserve the provider's mixed-case names and short regional abbreviations.
  if (value === value.toLocaleLowerCase() || (value === value.toLocaleUpperCase() && value.length > 3)) {
    value = value.toLocaleLowerCase().replace(/(^|[\s-])(\p{L})/gu,
      (_, separator, letter) => separator + letter.toLocaleUpperCase());
  }
  return value.replace(/^\p{L}/u, (letter) => letter.toLocaleUpperCase());
}

export function formatLocation(address = "") {
  const parts = address.split(",").map((part) => part.trim()).filter(Boolean);
  // Use the enclosing region when the resolved address also contains a county.
  const location = parts.length > 3 ? [parts[0], parts.at(-2), parts.at(-1)] : parts;
  return location.map(capitalizeName).join(", ");
}
