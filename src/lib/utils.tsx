// FUNCTIONS MUST HAVE NO SIDE EFFECTS

import { Readable } from 'node:stream';

// TODO SHITTY ASS FUNCTION
function toNodeReadableStream(readableStream: ReadableStream<any>): Readable {
  return new Readable({
    read() {
      const reader = readableStream.getReader();
      const pump = () => {
        reader.read().then(({ done, value }) => {
          if (done) {
            this.push(null);
            return;
          }
          this.push(value);
          pump();
        });
      };
      pump();
    },
  });
}

export { toNodeReadableStream };
