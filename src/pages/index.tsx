const testOne = async () => {
  const res = await fetch('/api/mix', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ songs: ['sound1.wav', 'sound2.wav'] }),
  });
  const data = await res.json();
  console.log(data);
};

export default function Home() {
  return (
    <main className='flex min-h-screen flex-col items-center justify-between p-24'>
      <button
        className='rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700'
        onClick={() => testOne()}
      >
        Test
      </button>
    </main>
  );
}
