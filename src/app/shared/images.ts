export function toGrayScale(rgbBuffer: Int32Array): Uint8Array {
  const grayBuffer = rgbBuffer.map(value => {
    return 0.34 * ((value >> 24) & 0xFF) + 0.5 * ((value >> 16) & 0xFF) + 0.16 * ((value >> 8) & 0xFF);
  });

  return new Uint8Array(grayBuffer);
}
