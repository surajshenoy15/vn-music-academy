const STORAGE_KEY = "vn-music-academy-session-validity";

export const normalizeValidityDate = (value) => {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toISOString().split("T")[0];
};

export const formatValidityDate = (value) => {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const getStoredSessionValidity = (student) => {
  if (!student) return "";

  if (student.session_validity_end) {
    return normalizeValidityDate(student.session_validity_end);
  }

  try {
    const rawValue = localStorage.getItem(STORAGE_KEY);
    if (!rawValue) return "";

    const storageData = JSON.parse(rawValue);
    if (student.id && storageData[student.id]) {
      return normalizeValidityDate(storageData[student.id]);
    }

    if (student.email && storageData[student.email]) {
      return normalizeValidityDate(storageData[student.email]);
    }
  } catch (error) {
    console.warn("Failed to read session validity from storage:", error);
  }

  return "";
};

export const saveStoredSessionValidity = (student, value) => {
  if (!student) return "";

  const normalizedDate = normalizeValidityDate(value);
  if (!normalizedDate) return "";

  try {
    const rawValue = localStorage.getItem(STORAGE_KEY);
    const storageData = rawValue ? JSON.parse(rawValue) : {};

    storageData[student.id] = normalizedDate;
    if (student.email) {
      storageData[student.email] = normalizedDate;
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(storageData));
    return normalizedDate;
  } catch (error) {
    console.warn("Failed to save session validity to storage:", error);
    return normalizedDate;
  }
};

export const clearStoredSessionValidity = (student) => {
  if (!student) return;

  try {
    const rawValue = localStorage.getItem(STORAGE_KEY);
    if (!rawValue) return;

    const storageData = JSON.parse(rawValue);
    delete storageData[student.id];
    if (student.email) {
      delete storageData[student.email];
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(storageData));
  } catch (error) {
    console.warn("Failed to clear session validity from storage:", error);
  }
};

export const buildValidityReminderText = (value) => {
  if (!value) return "";

  const normalizedDate = normalizeValidityDate(value);
  if (!normalizedDate) return "";

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const expiryDate = new Date(normalizedDate);
  expiryDate.setHours(0, 0, 0, 0);

  const isExpired = expiryDate < today;
  const label = isExpired ? "Your sessions validity expired on" : "Your sessions validity ends on";

  return `${label} ${formatValidityDate(normalizedDate)}.`;
};

export const isMissingColumnError = (error) => {
  const message = error?.message || "";
  return /column .* does not exist|could not find the .* column|does not exist in schema/i.test(message);
};
