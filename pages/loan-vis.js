import { Layout } from '../components/layout';
import Image from 'next/image';

export default function LoanVis() {    
    
    return (
        <Layout alwaysFitScreen={true}>
            
            <div className='w-screen h-full flex-grow bg-sky-200 relative'>
                <a target="_blank" href="https://viscene.vercel.app/loan-vis" rel="noopener noreferrer">    
                    <Image
                        alt='Mountains'
                        src='/images/loanVisScreenShot.png'
                        fill                    
                    />
                </a>
            </div>
        </Layout>
    );
}