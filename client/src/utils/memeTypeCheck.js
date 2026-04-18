/**
 *
 * @param {*} file  the file that is check against for those types
 * @param {*} AllowedTypes A list of types allow for your input stream
 * @returns true if the file is of an allowed type, false otherwise
 * This function checks if the provided file is of an allowed type based on its MIME type and file extension. It uses a predefined list of allowed MIME types and extensions, which can be overridden by the AllowedTypes parameter. The function returns true if the file's MIME type or extension matches the allowed types, and false otherwise.
 */
export function memeTypeCheck(file, AllowedTypes) {
  console.log(file);
  // Default allowed types
  const defaultTypes = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/jpg": "jpg",
    "image/x-png": "png",
    "application/octet-stream": "png",
  };

  let allowedMime = [];
  let allowedExt = ["jpg", "jpeg", "png"];

  // If AllowedTypes is an array → treat as MIME list
  if (Array.isArray(AllowedTypes)) {
    allowedMime = AllowedTypes;
  }
  // If AllowedTypes is an object → treat as MIME → ext map
  else if (AllowedTypes && typeof AllowedTypes === "object") {
    allowedMime = Object.keys(AllowedTypes);
    allowedExt = Object.values(AllowedTypes);
  }
  // Otherwise use defaults
  else {
    allowedMime = Object.keys(defaultTypes);
    allowedExt = Object.values(defaultTypes);
  }

  const ext = file.name.split(".").pop().toLowerCase();

  const mimeOK = allowedMime.includes(file.type);
  const extOK = allowedExt.includes(ext);

  return mimeOK || extOK;
}
