import axios from 'axios';
import React, { useState } from 'react';

const getPlaylist = async (id: string) => {
  const playlist = await axios.request({
    method: 'POST',
    url: `/api/getPlaylist`,
    data: {
      url: id,
    },
  });
};

export default function FormBox() {
  const [playlistId, setPlaylistId] = useState('');

  const handleSubmit = async () => {
    if (playlistId) {
      await getPlaylist(playlistId);
      setPlaylistId('');
    }
  };

  return (
    <div className='form-box'>
      <input
        type='text'
        value={playlistId}
        onChange={(e) => setPlaylistId(e.target.value)}
        placeholder='Enter playlist ID'
        className='mr-4 rounded border px-4 py-2'
      />
      <button
        onClick={handleSubmit}
        className='rounded bg-blue-500 px-4 py-2 font-bold text-white transition-colors duration-300 hover:bg-blue-700'
      >
        Submit
      </button>
    </div>
  );
}
