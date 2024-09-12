import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

const finishWrittenStream = (
  inputStream: NodeJS.ReadableStream,
  fileName: string
): Promise<String> => {
  return new Promise(async (resolve, reject) => {
    const outputStream = fs.createWriteStream(`${fileName}_${uuidv4()}.mp3`);
    inputStream.pipe(outputStream);
    outputStream.on('finish', resolve);
    outputStream.on('error', reject);
  });
};

export { finishWrittenStream };
