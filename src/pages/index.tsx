import Image from "next/image";

const testOne = async () => {
  const res = await fetch('/api/mix', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ songs: ['sound1.wav'] })
  })
  const data = await res.json()
  console.log(data)
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" 
      onClick={() => testOne()}>Test</button>
    </main>
  );
}
