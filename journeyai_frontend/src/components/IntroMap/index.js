import dynamic from 'next/dynamic';

const IntroMap = dynamic(() => import('./introMap'), {
    ssr: false 
});

export default IntroMap;