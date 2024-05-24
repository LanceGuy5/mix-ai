const spectro = require('spectro')
const fs = require('fs')
const PNG = require('pngjs').PNG
import * as path from 'path';

// Setup spectrogram generator
const colorMap = {
	'130': '#fff',
	'90': '#f00',
	'40': '#00f',
	'10': '#000',
}

const cFunc = spectro.colorize(colorMap)
const wFunc = 'Blackman'

const sp = new spectro({
	overlap: 0.5,
	wFunc: wFunc // Method of generating spectrogram
})

/**
 * A method to convert a list of .wav filepaths to spectrographs.
 * @param songs list of song filepaths to download as spectrograms.
 * @returns either the first string that does not download properly, or null if all work properly.
 */
export function ConvertSongsToSpectrographs(songs) {
    for (const song of songs) {
		console.log(song)
        var audioFile = fs.createReadStream("songs\\" + song, {start: 44}) // first 44 bytes are the wav-header
        audioFile.pipe(sp)
    
        var fileRead = false
        audioFile.on('end', () => fileRead = true)
    
        sp.on('data', (err, frame) => {
            if (err) console.error('Spectro data event has an error', err)
        })
    
        sp.on('end', (err, data) => {
            if (err) return console.error('Spectro ended with an error', err)
    
            // Make sure file was read entirely
            if (fileRead !== true) return song
    
            sp.stop()
    
            // Draw spectrogram
            createImage(data, `${song.substring(0, song.length - 4)}_spectrogram`)

			// clear
			sp.clear()
        })
    }
    return null
}

/**
 * Method to generate an image given spectrogram data.
 * @param spectrogram the data provided by spectro.
 * @param name the name of the file to save the image as.
 */
function createImage(spectrogram, name) {
	// Create a png
	var png = new PNG({
		width: spectrogram.length,
		height: spectrogram[0].length,
		filterType: -1
	})
	for (var y = 0; y < png.height; y++) {
		for (var x = 0; x < png.width; x++) {

			// Get the color
			var intensity = spectrogram[x][png.height - y - 1]
			// Now we can use the colorize function to get rgb values for the amplitude
			var col = cFunc(intensity)

			// Draw the pixel
			var idx = (png.width * y + x) << 2
			png.data[idx  ] = col[0]
			png.data[idx+1] = col[1]
			png.data[idx+2] = col[2]
			png.data[idx+3] = 255
		}
	}
	png.pack().pipe(fs.createWriteStream(path.join('images', `${name}.png`)));
	console.log(`Spectrogram written to ${name}.png`)
}
