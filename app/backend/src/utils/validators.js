function validateEmail(email) {
  if (!email || typeof email !== "string") {
    throw new Error("Email es obligatorio");
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error("Email no válido");
  }
  return email;
}

function validatePassword(password) {
  if (!password || typeof password !== "string") {
    throw new Error("Contraseña es obligatoria");
  }
  if (password.length < 6) {
    throw new Error("Contraseña debe tener al menos 6 caracteres");
  }
  return password;
}

function validateRut(rut) {
  if (!rut || typeof rut !== "string") {
    throw new Error("RUT es obligatorio");
  }
  const rutRegex = /^\d{1,2}\.\d{3}\.\d{3}-[\dkK]$/;
  if (!rutRegex.test(rut)) {
    throw new Error("RUT no válido (formato: XX.XXX.XXX-X)");
  }
  return rut;
}

function validateRequiredFields(body, fields) {
  const missing = fields.filter((f) => !body[f] || (typeof body[f] === "string" && body[f].trim() === ""));
  if (missing.length > 0) {
    throw new Error("Campos obligatorios faltantes: " + missing.join(", "));
  }
}

function validateInput(body, rules) {
  if (rules.email) validateEmail(body.email);
  if (rules.password) validatePassword(body.password);
  if (rules.rut) validateRut(body.rut);
  if (rules.required) validateRequiredFields(body, rules.required);
}

module.exports = { validateEmail, validatePassword, validateRut, validateRequiredFields, validateInput };
