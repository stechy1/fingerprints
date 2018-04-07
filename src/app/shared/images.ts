export function toGrayScale(rgbBuffer: Int32Array): Uint8Array {
  const grayBuffer = rgbBuffer.map(value => {
    //return 0.34 * ((value >> 24) & 0xFF) + 0.5 * ((value >> 16) & 0xFF) + 0.16 * ((value >> 8) & 0xFF);
    return 0.2126 * ((value >> 24) & 0xFF) + 0.7152 * ((value >> 16) & 0xFF) + 0.0722 * ((value >> 8) & 0xFF);
  });

  return new Uint8Array(grayBuffer);
}

export function createImageFromRGBdata(data: Uint32Array, width, height): HTMLCanvasElement {
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

export function createImageToGrayScale(data: Uint8Array, width: number, height: number): HTMLCanvasElement {
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
