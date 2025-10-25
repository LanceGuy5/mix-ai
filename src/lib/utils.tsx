import fs from 'fs';
import { Readable } from 'stream';

const finishWrittenStream = (
  inputStream: NodeJS.ReadableStream,
  fileName: string
): Promise<String> => {
  return new Promise(async (resolve, reject) => {
    const outputStream = fs.createWriteStream(`${fileName}.wav`);
    inputStream.pipe(outputStream);
    outputStream.on('finish', resolve);
    outputStream.on('error', reject);
  });
};

const toNodeReadable = (webStream: NodeJS.ReadableStream): Readable => {
  const nodeStream = new Readable({
    read() {},
  });

  webStream.on('data', (chunk) => nodeStream.push(chunk));
  webStream.on('end', () => nodeStream.push(null));
  webStream.on('error', (err) => nodeStream.destroy(err));

  return nodeStream;
};

export { finishWrittenStream, toNodeReadable };
