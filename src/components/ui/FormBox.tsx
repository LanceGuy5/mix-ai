export default function FormBox() {
  return (
    <div className='form-box'>
      <button
        onClick={() => console.log('pressed!')}
        className='rounded bg-blue-500 px-4 py-2 font-bold text-white transition-colors duration-300 hover:bg-blue-700'
      >
        Sign In with SoundCloud
      </button>
    </div>
  );
}
