import axios from 'axios';
import React, {useState} from 'React';

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
  const [signedIn, setSignedIn]  = useState(false);
  const [playlist, setPlaylist] = useState("");
  const toggleSigned = () => {
    setSignedIn(curr => !curr);
  }
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  }
  return (
    <div className='form-box'>
      <form onSubmit={handleSubmit}>
        {!signedIn && <button
          onClick={async () => {
            await getPlaylist(1212781357);
            toggleSigned
          }}
          className='rounded bg-blue-500 px-4 py-2 font-bold text-white transition-colors duration-300 hover:bg-blue-700'
        >
          Sign In with SoundCloud
        </button>
        }
        {signedIn && <div>
          <input type="text" name="email" id="email" required placeholder="Enter your playlist URL" onChange = {(e: React.ChangeEvent<HTMLInputElement>) => {
            const value = e.target.value;
            setPlaylist(value);
          }}/>
          <button type="submit" className="bold-button rounded bg-blue-500 px-4 py-2 font-bold text-white transition-colors duration-300 hover:bg-blue-700">Mix</button>
          </div>}
      </form>
    </div>
  );
}
