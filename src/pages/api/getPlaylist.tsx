import axios from 'axios';
import scdl from 'soundcloud-downloader';
import * as fs from 'fs';

const GetPlaylistWithURL = async (
  req: any,
  res: any
): Promise<{ status: number; message: string }> => {
  const SOUNDCLOUD_URL = `https://soundcloud.com/lance-hartman-129699056/sets/random/s-gKjL1NhvLie?si=d87af33719894805a2a8c565168d79d1&utm_source=clipboard&utm_medium=text&utm_campaign=social_sharing`;
  const CLIENT_ID = `${process.env.SOUNDCLOUD_CLIENT_ID}`;
  scdl
    .downloadPlaylist(SOUNDCLOUD_URL)
    .then((stream: any) => stream.pipe(fs.createWriteStream('audio.mp3')))
    .then(() => {
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
