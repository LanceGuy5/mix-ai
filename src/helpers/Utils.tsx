import { ConvertSongsToSpectrographs } from "./Audio";


/**
 * Given a list of song names, download songs as local audio files
 * @param songs 
 * @returns List of successfully downloaded songs
 */
export const DownloadSongs = async (songs: string[]): Promise<string[]> => {
    return songs.map((song) => {
        return `Downloaded ${song}`;
    });
}

/**
 * Given a list of file paths, produce spectrographs/feed into Transformer.tsx
 * Goal: play song for ~30 sec (rounded based on loop length), mix for approx. 15 sec, then play next song
 * @param songs File path names
 * @returns Mixed audio file
 */
export const MixSongs = async (songs: string[]): Promise<string> => {
    if (ConvertSongsToSpectrographs(songs) !== null) {
        return "Error in converting songs to spectrographs";
    }

    return songs.join(" + ");
}