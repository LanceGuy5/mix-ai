import scdl from 'node-fetch-sd';
import { v4 as uuidv4 } from 'uuid';
import { toNodeReadable } from '@/lib/utils';
import ffmpeg from 'fluent-ffmpeg'
import fs from 'fs'

const GetPlaylistWithURL = async (
  req: any,
  res: any
): Promise<{ status: number; message: string }> => {
  const SOUNDCLOUD_URL = req.body.url;
  if (!SOUNDCLOUD_URL) {
    res.status(400).json({ status: 400, message: 'No URL provided' });
    return { status: 400, message: 'no_url_provided' };
  }

  scdl
    .downloadPlaylist(SOUNDCLOUD_URL)
    .then(async (stream: [NodeJS.ReadableStream[], String[]]) => {

      const writePromises = stream[0].map(async (inputStream, index) => {
        const nodeStream = await toNodeReadable(inputStream);
        const fileName = `songs/${stream[1][index]}_${uuidv4()}`;
        console.log('[DEBUG] Writing to:', fileName);

        return new Promise((resolve, reject) => {
          const outputFile = fs.createWriteStream(`${fileName}.wav`);

          ffmpeg()
            .input(nodeStream)
            .inputFormat('mp3') // Convert MP3 if needed
            .toFormat('wav') // Output WAV
            .on('end', () => {
              console.log('[DEBUG] Conversion complete:', fileName);
              resolve(fileName);
            })
            .on('error', (err) => {
              console.error('[DEBUG] ERROR:', err);
              reject(err);
            })
            .pipe(outputFile, { end: true });
        });
      });
      await Promise.all(writePromises);
    })
    .then(() => {
      console.log('[DEBUG] FINISHED WRITING ALL FILES');
      return { status: 200, message: 'success' };
    })
    .catch(() => {
      return { status: 500, message: 'stream_error' };
    });
  return { status: 200, message: 'error' };
};

const handler = async (req: any, res: any): Promise<any> => {
  if (req.method === 'POST') {
    const result: { status: number; message: string } =
      await GetPlaylistWithURL(req, res);
    res.status(result.status).send(result.message);
  } else {
    res.status(405).send('Method Not Allowed');
  }
};

export default handler;
