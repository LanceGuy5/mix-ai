import axios from 'axios';

const scdl = require('soundcloud-downloader').default;
const fs = require('fs');

const GetPlaylistWithId = async (req: any, res: any) => {
  const SOUNDCLOUD_URL = `${process.env.SOUNDCLOUD_URL}`;
  const CLIENT_ID = `${process.env.SOUNDCLOUD_CLIENT_ID}`;
  scdl
    .download(SOUNDCLOUD_URL)
    .then((stream: any) => stream.pipe(fs.createWriteStream('audio.mp3')));
};

const handler = async (req: any, res: any): Promise<any> => {
  if (req.method === 'POST') {
    await GetPlaylistWithId(req, res);
    res.status(200).send('OK');
  } else {
    res.status(405).send('Method Not Allowed');
  }
};

export default handler;
