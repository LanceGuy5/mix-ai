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

const testBackend = async () => {
  const value = await axios.request({
    method: 'GET',
    // url: `${process.env.BACKEND_URL}/backend/test`
    url: `http://127.0.0.1:5000/backend/test`,
    data: {}
  });
  return value;
}

export default function FormBox() {
  const [playlistId, setPlaylistId] = useState('');

  const handleSubmit = async () => {
    if (playlistId) {
      await getPlaylist(playlistId);
      setPlaylistId('');
    }
  };

  const handleBackendTest = async () => {
    const result = await testBackend();
    console.log(result);
  }

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
      <button
        onClick={handleBackendTest}
        className='rounded bg-blue-500 px-4 py-2 font-bold text-white transition-colors duration-300 hover:bg-blue-700'
      >
        Test
      </button>
    </div>
  );
}
