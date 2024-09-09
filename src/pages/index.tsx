import FormBox from '@/components/ui/FormBox';
import Head from 'next/head';

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
    <>
      <Head>
        <title>mix-ai</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <header>
        <div className='flex flex-col items-center'>
          <h1 className='text-title text-white'>mix-ai</h1>
          <p className='font-consolas font-thin text-white'>
            ❤️ from CS @ UPenn 😊
          </p>
        </div>
      </header>

      <main>
        <FormBox />
      </main>
    </>
  );
}
