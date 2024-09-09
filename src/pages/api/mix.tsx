import { DownloadSongs, MixSongs } from '@/helpers/Utils';

const handler = async (req: any, res: any): Promise<any> => {
  const { songs } = req.body;
  // const songFiles = await DownloadSongs(songs);
  const mixedSong = await MixSongs(songs);
  console.log(mixedSong);
  res.send(mixedSong);
};

export default handler;
