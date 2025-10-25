 import scdl from 'node-fetch-sd';
import { v4 as uuidv4 } from 'uuid';
import { toNodeReadable } from '@/lib/utils';
import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';

const GetPlaylistWithURL = async (
  req: any,
  res: any
): Promise<{ status: number; message: string }> => {
  const SOUNDCLOUD_URL = req.body.url;
  if (!SOUNDCLOUD_URL) {
    res.status(400).json({ status: 400, message: 'No URL provided' });
    return { status: 400, message: 'no_url_provided' };
  }

  try {
    const stream = await scdl.downloadPlaylist(SOUNDCLOUD_URL);

    // stream[0] = array of ReadableStreams
    // stream[1] = array of track titles
    const writePromises = stream[0].map(async (inputStream, index) => {
      const nodeStream = await toNodeReadable(inputStream);
      const title = stream[1][index];
      const fileName = `songs/${title}_${uuidv4()}`;
      const outputPath = `${fileName}.wav`;

      console.log('[DEBUG] Converting:', title);

      return new Promise((resolve, reject) => {
        const outputFile = fs.createWriteStream(outputPath);

        ffmpeg(nodeStream)
          // let ffmpeg auto-detect input format
          .toFormat('wav')
          .addOption('-loglevel', 'error') // set to 'debug' if you want verbose ffmpeg output
          .on('start', (cmd) => {
            console.log('[DEBUG] ffmpeg started:', cmd);
          })
          .on('progress', (progress) => {
            console.log(`[DEBUG] Processing ${title}: ${progress.percent?.toFixed(2)}%`);
          })
          .on('end', () => {
            console.log('[DEBUG] Conversion complete:', fileName);
            resolve(fileName);
          })
          .on('error', (err) => {
            console.error('[DEBUG] ffmpeg error:', err.message);
            reject(err);
          })
          .pipe(outputFile, { end: true });
      });
    });

    await Promise.all(writePromises);
    console.log('[DEBUG] FINISHED WRITING ALL FILES');
    return { status: 200, message: 'success' };

  } catch (err) {
    console.error('[DEBUG] Playlist download or conversion failed:', err);
    return { status: 500, message: 'stream_error' };
  }
};

const handler = async (req: any, res: any): Promise<any> => {
  if (req.method === 'POST') {
    const result = await GetPlaylistWithURL(req, res);
    res.status(result.status).send(result.message);
  } else {
    res.status(405).send('Method Not Allowed');
  }
};

export default handler;
