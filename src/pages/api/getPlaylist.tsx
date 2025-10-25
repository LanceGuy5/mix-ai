// /pages/api/getPlaylist.ts
import scdl from 'soundcloud-downloader';
import { v4 as uuidv4 } from 'uuid';
import { toNodeReadable } from '@/lib/utils';
import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';
import path from 'path';

type ApiResult = { status: number; message: string; data?: any };

const SONGS_DIR = path.join(process.cwd(), 'songs');
const ensureDir = () => { if (!fs.existsSync(SONGS_DIR)) fs.mkdirSync(SONGS_DIR, { recursive: true }); };
const sanitize = (s: string) => (s ?? 'track').replace(/[^\w\- ]+/g, '_').slice(0, 100);

async function convertToWav(input: NodeJS.ReadableStream, outPath: string) {
  await new Promise<void>((resolve, reject) => {
    const out = fs.createWriteStream(outPath);
    ffmpeg(input)
      .toFormat('wav')
      .addOption('-loglevel', 'error')
      .on('end', resolve)
      .on('error', reject)
      .pipe(out, { end: true });
  });
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');
  const url: string | undefined = req.body?.url;
  if (!url) return res.status(400).json({ status: 400, message: 'No URL provided' });

  ensureDir();

  try {
    // Get playlist info (tracks array with ids/permalinks)
    const setInfo: any = await scdl.getSetInfo(url); // playlist metadata
    const tracks: any[] = Array.isArray(setInfo?.tracks) ? setInfo.tracks : [];
    if (!tracks.length) return res.status(404).json({ status: 404, message: 'no_tracks' });

    const valid = tracks.filter(t => {
      const hasTranscodings = Array.isArray(t?.media?.transcodings) && t.media.transcodings.length > 0;
      return !!(t?.permalink_url) && hasTranscodings; // skip private/preview/deleted
    });

    const skipped = tracks.filter(t => !valid.includes(t)).map(t => ({
      title: t?.title ?? '(untitled)',
      reason: `transcodings=${t?.media?.transcodings?.length ?? 0}, permalink=${!!t?.permalink_url}`
    }));

    const files: string[] = [];
    const failures: { title: string; error: string }[] = [];

    // sequential for simplicity; parallelize if you want
    for (const t of valid) {
      const title = t.title ?? `track_${t.id}`;
      const outPath = path.join(SONGS_DIR, `${sanitize(title)}_${uuidv4()}.wav`);
      try {
        const read = await scdl.download(t.permalink_url); // single-track stream
        const nodeReadable = await toNodeReadable(read);
        await convertToWav(nodeReadable, outPath);
        files.push(outPath);
      } catch (e: any) {
        failures.push({ title, error: e?.message ?? String(e) });
      }
    }

    return res.status(200).json({
      status: 200,
      message: 'success',
      data: { processed: files.length, skipped, failures, files }
    });
  } catch (e: any) {
    console.error('[DEBUG] playlist failed:', e?.message ?? e);
    return res.status(500).json({ status: 500, message: 'stream_error' });
  }
}
