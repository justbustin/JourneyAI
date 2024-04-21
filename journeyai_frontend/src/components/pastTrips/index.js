import dynamic from 'next/dynamic';

const PastMap = dynamic(() => import('./pastMap'), {
    ssr: false 
});

export default PastMap;