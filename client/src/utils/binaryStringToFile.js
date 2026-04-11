export function binaryStringToFile(fileObj) {
  if (!fileObj || !fileObj.content) {
    throw new Error("Invalid file object");
  }

  const binary = fileObj.content;
  const len = binary.length;
  const bytes = new Uint8Array(len);

  for (let i = 0; i < len; i++) {
    bytes[i] = binary.charCodeAt(i);
  }

  return new File([bytes], fileObj.name, { type: fileObj.type });
}
