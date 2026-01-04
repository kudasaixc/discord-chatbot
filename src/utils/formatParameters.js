export function formatParameters(parameters = {}) {
  const labels = {
    temperature: "temp",
    top_p: "top_p",
    presence_penalty: "presence_penalty",
    frequency_penalty: "frequency_penalty",
    max_tokens: "max_tokens"
  };

  const entries = Object.entries(labels)
    .map(([key, label]) => {
      const value = parameters[key];
      if (value === null || value === undefined) return null;
      return `${label}=${value}`;
    })
    .filter(Boolean);

  return entries.length ? entries.join(", ") : "";
}
