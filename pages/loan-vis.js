import { Layout } from '../components/layout';
import Image from 'next/image';
import 'react-tooltip/dist/react-tooltip.css';
import { Tooltip } from 'react-tooltip';

export default function LoanVis() {    
    
    return (
        <Layout alwaysFitScreen={true}>
            
            <div className='picContainer w-screen h-full flex-grow bg-sky-200 relative'>
                <a target="_blank" href="https://viscene.vercel.app/loan-vis" rel="noopener noreferrer">    
                    <Image
                        alt='Mountains'
                        src='/images/loanVisScreenShot.png'
                        fill                    
                    />
                </a>
            </div>
            <Tooltip anchorSelect=".picContainer" place="top">
                Screenshot only. Click to visit.
            </Tooltip>
        </Layout>
    );
}