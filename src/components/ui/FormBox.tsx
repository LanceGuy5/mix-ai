import axios from 'axios';

const getPlaylist = async (id: number) => {
  const playlist = await axios.request({
    method: 'POST',
    url: `/api/getPlaylist`,
    data: {
      id: id,
    },
  });
};

export default function FormBox() {
  return (
    <div className='form-box'>
      <button
        onClick={() => {
          getPlaylist(1212781357);
        }}
        className='rounded bg-blue-500 px-4 py-2 font-bold text-white transition-colors duration-300 hover:bg-blue-700'
      >
        Sign In with SoundCloud
      </button>
    </div>
  );
}
