export function profileImageValidation(file) {
  const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];

  if (!allowedTypes.includes(file.mimetype)) {
    return "Unsupported file type. Please upload a JPG, PNG, or PDF file.";
  }

  if (file.size > 5 * 1024 * 1024) {
    return "File size exceeds the limit. Please upload a file smaller than 5MB.";
  }
  return null; // No validation errors
}
