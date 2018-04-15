export function toGrayScale(rgbBuffer: Int32Array): Uint8Array {
  const grayBuffer = rgbBuffer.map(value => {
    const red = (value >> 24) & 0xFF;
    const green = (value >> 16) & 0xFF;
    const blue = (value >> 8) & 0xFF;

    return (red + green + blue) / 3;
  });

  return new Uint8Array(grayBuffer);
}

export function toBinaryScale(rgbBuffer: Int32Array): Uint8Array {
  return new Uint8Array(rgbBuffer.map(value => (((value >> 8) & 0xFF) === 0) ? 0 : 1));
}

export function createImageFromRGBdata(width: number, height: number, data: Uint32Array): HTMLCanvasElement {
  let canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  let context = canvas.getContext('2d');
  let imageData = context.createImageData(width, height);

  let dstIndex = 0;

  for (let i = 0; i < data.length; i++) {
    imageData.data[dstIndex] = ((data[i] >> 24) & 0xFF);	// red
    imageData.data[dstIndex + 1] = ((data[i] >> 16) & 0xFF);	// green
    imageData.data[dstIndex + 2] = ((data[i] >> 8) & 0xFF);	// blue
    imageData.data[dstIndex + 3] = 255; // alpha
    dstIndex += 4;
  }
  context.putImageData(imageData, 0, 0);
  return canvas;
}

export function createImageToGrayScale(width: number, height: number, data: Uint8Array): HTMLCanvasElement {
  let canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  let context = canvas.getContext('2d');
  let imageData = context.createImageData(width, height);

  let dstIndex = 0;

  for (let i = 0; i < data.length; i++) {
    const value = data[i]; // red
    imageData.data[dstIndex] = value; // green
    imageData.data[dstIndex + 1] = value; // blue
    imageData.data[dstIndex + 2] = value; // alpha
    imageData.data[dstIndex + 3] = 255;
    dstIndex += 4;
  }

  context.putImageData(imageData, 0, 0);
  return canvas;
}
