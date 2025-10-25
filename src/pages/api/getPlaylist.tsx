// /pages/api/getPlaylist.ts
import scdl from 'soundcloud-downloader';
import { v4 as uuidv4 } from 'uuid';
import { toNodeReadable } from '@/lib/utils';
import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';
import path from 'path';

type ApiResult = { status: number; message: string; data?: any };

const SONGS_DIR = path.join(process.cwd(), 'songs');
const ensureDir = () => {
  if (!fs.existsSync(SONGS_DIR)) fs.mkdirSync(SONGS_DIR, { recursive: true });
};
const sanitize = (s: string) =>
  (s ?? 'track').replace(/[^\w\- ]+/g, '_').slice(0, 100);

async function convertToWav(input: NodeJS.ReadableStream, outPath: string) {
  const tmpPath = `${outPath}.tmp`;

  await new Promise<void>((resolve, reject) => {
    const out = fs.createWriteStream(tmpPath);

    ffmpeg(input)
      .audioCodec('pcm_s16le') // enforce correct WAV codec
      .format('wav')
      .addOption('-ar', '44100') // sample rate
      .addOption('-ac', '2') // stereo
      .addOption('-loglevel', 'error')
      .on('end', () => {
        fs.rename(tmpPath, outPath, (err) => {
          if (err) return reject(err);
          resolve();
        });
      })
      .on('error', (err) => {
        if (fs.existsSync(tmpPath)) fs.unlinkSync(tmpPath);
        reject(err);
      })
      .pipe(out, { end: true });
  });
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');
  const url: string | undefined = req.body?.url;
  if (!url)
    return res.status(400).json({ status: 400, message: 'No URL provided' });

  ensureDir();

  try {
    // Get playlist info
    const setInfo: any = await scdl.getSetInfo(url);
    const tracks: any[] = Array.isArray(setInfo?.tracks) ? setInfo.tracks : [];
    if (!tracks.length)
      return res.status(404).json({ status: 404, message: 'no_tracks' });

    const files: string[] = [];
    const skipped: { title: string; reason: string }[] = [];
    const failures: { title: string; error: string }[] = [];

    // Filter tracks
    const valid = tracks.filter((t) => {
      const transcodings = t?.media?.transcodings ?? [];
      const hasTranscodings =
        Array.isArray(transcodings) && transcodings.length > 0;
      const hasFull = transcodings.some(
        (tc: any) => !tc.url.includes('/preview')
      );
      const ok = !!t?.permalink_url && hasTranscodings && hasFull;

      if (!ok) {
        skipped.push({
          title: t?.title ?? '(untitled)',
          reason: !hasTranscodings
            ? 'no_transcodings'
            : !hasFull
              ? 'preview_only'
              : !t?.permalink_url
                ? 'missing_permalink'
                : 'unknown',
        });
      }
      return ok;
    });

    // Sequential conversion for simplicity
    for (const t of valid) {
      const title = t.title ?? `track_${t.id}`;
      const outPath = path.join(
        SONGS_DIR,
        `${sanitize(title)}_${uuidv4()}.wav`
      );

      try {
        const read = await scdl.download(t.permalink_url);
        const nodeReadable = await toNodeReadable(read);
        await convertToWav(nodeReadable, outPath);
        files.push(outPath);
      } catch (e: any) {
        if (fs.existsSync(outPath)) fs.unlinkSync(outPath);
        failures.push({ title, error: e?.message ?? String(e) });
      }
    }

    return res.status(200).json({
      status: 200,
      message: 'success',
      data: {
        processed: files.length,
        skipped,
        failures,
        files,
      },
    });
  } catch (e: any) {
    console.error('[DEBUG] playlist failed:', e?.message ?? e);
    return res
      .status(500)
      .json({ status: 500, message: 'stream_error', error: e?.message });
  }
}
