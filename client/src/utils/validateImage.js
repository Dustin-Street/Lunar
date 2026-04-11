export function validateImage(file, maxMB = 5) {
  const fileSizeMB = file.size / 1024 / 1024;
  if (fileSizeMB > maxMB) {
    return `This file ${fileSizeMB.toFixed(2)}MB exceeds the ${maxMB}MB limit.`;
  }

  return null;
}
