const spectro = require('spectro');
const fs = require('fs');
const PNG = require('pngjs').PNG;
const path = require('path');

const colorMap = {
  130: '#fff',
  90: '#f00',
  40: '#00f',
  10: '#000',
};

const cFunc = spectro.colorize(colorMap);

/**
 * A method to convert a list of .wav filepaths to spectrographs.
 * @param songs list of song filepaths to download as spectrograms.
 * @returns either the first string that does not download properly, or null if all work properly.
 */
async function ConvertSongsToSpectrographs(songs) {
  for (const song of songs) {
    console.log(song);
    const wFunc = 'Blackman';
    const sp = new spectro({
      overlap: 0.5,
      wFunc: wFunc,
    });

    const audioFile = fs.createReadStream(path.join('songs', song), {
      start: 44,
    }); // first 44 bytes are the wav-header
    audioFile.pipe(sp);

    await new Promise((resolve, reject) => {
      let fileRead = false;
      audioFile.on('end', () => (fileRead = true));

      sp.on('data', (err, frame) => {
        if (err) console.error('Spectro data event has an error', err);
      });

      sp.on('end', (err, data) => {
        if (err) {
          console.error('Spectro ended with an error', err);
          return reject(err);
        }

        // Make sure file was read entirely
        if (fileRead !== true) {
          return reject(new Error(`File ${song} was not read entirely`));
        }

        sp.stop();

        // Draw spectrogram
        createImage(data, `${song.substring(0, song.length - 4)}_spectrogram`)
          .then(() => {
            sp.clear();
            resolve();
          })
          .catch(reject);
      });
    }).catch((err) => {
      console.error(err);
      return song;
    });
  }
  return null;
}

/**
 * Method to generate an image given spectrogram data.
 * @param spectrogram the data provided by spectro.
 * @param name the name of the file to save the image as.
 */
async function createImage(spectrogram, name) {
  return new Promise((resolve, reject) => {
    // Create a png
    const png = new PNG({
      width: spectrogram.length,
      height: spectrogram[0].length,
      filterType: -1,
    });
    for (let y = 0; y < png.height; y++) {
      for (let x = 0; x < png.width; x++) {
        const intensity = spectrogram[x][png.height - y - 1];
        const col = cFunc(intensity);

        const idx = (png.width * y + x) << 2;
        png.data[idx] = col[0];
        png.data[idx + 1] = col[1];
        png.data[idx + 2] = col[2];
        png.data[idx + 3] = 255;
      }
    }
    const filePath = path.join('images', `${name}.png`);
    const writeStream = fs.createWriteStream(filePath);

    png
      .pack()
      .pipe(writeStream)
      .on('finish', () => {
        console.log(`Spectrogram written to ${filePath}`);
        resolve();
      })
      .on('error', reject);
  });
}

module.exports = { ConvertSongsToSpectrographs };
