/**
 *
 * @param {*} file  the file that is check against for those types
 * @param {*} AllowedTypes A list of types allow for your input stream
 * @returns true if the file is of an allowed type, false otherwise
 * This function checks if the provided file is of an allowed type based on its MIME type and file extension. It uses a predefined list of allowed MIME types and extensions, which can be overridden by the AllowedTypes parameter. The function returns true if the file's MIME type or extension matches the allowed types, and false otherwise.
 */

export function memeTypeCheck(file, AllowedTypes) {
  //enumerate allowed types and extensions for image validation select them by checking them against the AllowedTypes input, if provided, otherwise use the default allowed types
  /**
   * @param {*} AllowedTypes an object where the keys are MIME types and the values are file extensions. If not provided, a default set of allowed types is used. The function checks if the file's MIME type or extension matches any of the allowed types, returning true if a match is found and false otherwise.
   * The function first defines a default set of allowed MIME types and their corresponding file extensions. It then checks if the file's MIME type is in the allowed list or if the file's extension matches any of the allowed extensions. If either check passes, the function returns true; otherwise, it returns false.
   */
  const allowedTypes = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/jpg": "jpg",
    "image/x-png": "png", // common alt PNG type
    "application/octet-stream": "png", // Windows often reports PNG as this
  };
  const allowedMime = Object.keys(AllowedTypes || allowedTypes);

  // Allowed extensions (fallback when MIME is empty or wrong)
  const allowedExt = ["jpg", "jpeg", "png"];
  const ext = file.name.split(".").pop().toLowerCase();

  // MIME + extension check
  const mimeOK = allowedMime.includes(file.type);
  const extOK = allowedExt.includes(ext);

  if (!mimeOK && !extOK) {
    return false;
  }
  return true;
}
