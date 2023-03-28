import { useEffect } from "react";
import Head from "next/head";
import "../styles/global.css";

export default function App({ Component, pageProps }) {
    useEffect(()=>{
        // Remove the server-side injected CSS.
        const jssStyles = document.querySelector('#jss-server-side');
        if (jssStyles) {
            jssStyles.parentElement.removeChild(jssStyles);
        }
    }, []);

    useEffect(() => {
        setCusomVh();
        window.addEventListener('resize', setCusomVh);
    
        return ()=>window.removeEventListener('resize', setCusomVh);
    }, []);

    /*
    * create custom '--vh' unit which based on windows.innerHeight
    * to make sure link bar on mobile devices height is also calculated
    * when a container height unit is vh
    */
    const setCusomVh = () => {
        const vh = window?window.innerHeight * 0.01:0;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
        const vw = window?window.innerWidth * 0.01:0;
        document.documentElement.style.setProperty('--vw', `${vh}px`);
    }

    return( 
        <>
            <Head>
                <title>UI Demo</title>
                <meta 
                    name='viewport' 
                    content='minimum-scale=1, initial-scale=1, width=device-width' 
                />
            </Head>
            <Component {...pageProps} />
        </>
    );
}