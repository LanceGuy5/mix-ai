import scdl from 'node-fetch-sd';
import { v4 as uuidv4 } from 'uuid';
import { finishWrittenStream } from '@/lib/utils';

const GetPlaylistWithURL = async (
  req: any,
  res: any
): Promise<{ status: number; message: string }> => {
  const SOUNDCLOUD_URL = req.body.url;
  scdl
    .downloadPlaylist(SOUNDCLOUD_URL)
    .then(async (stream: [NodeJS.ReadableStream[], String[]]) => {
      const writePromises = stream[0].map((inputStream, index) => {
        const fileName = `songs/${stream[1][index]}_${uuidv4()}.mp3`;
        console.log('[DEBUG] writing to audio file: ' + fileName);
        return finishWrittenStream(inputStream, fileName)
          .then(() => console.log('[DEBUG] FINISHED: ' + stream[1][index]))
          .catch((err) => console.log('[DEBUG] ERROR: ' + err));
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
