import React, { useState, useEffect } from "react";
import { useWindowDimensions } from "../../utils/hooks/useWindowDimensions";
import { Navbar } from "./Navbar";

//tailwind fit screen : https://stackoverflow.com/questions/64257049/how-to-fill-up-the-rest-of-the-screen-height-using-tailwindcss

export const Layout = ({alwaysFitScreen, children}) => {
    const [ navbarHeight, setNavHeight ] = useState(0);
    const {height} = useWindowDimensions();
    //overflow-auto md:overflow-hidden 
    //style={{width:"100vw", height:`calc((var(--vh, 1vh) * 100) - ${navbarHeight}px)`}}
    const contentHeight = height - navbarHeight;
    if(alwaysFitScreen){
        return (
            <div className="fitScreenContainer flex flex-col">
                <Navbar setNavHeight={setNavHeight}/>    
                <div className={`flex-grow fitScreenContent bg-red-200 flex`}>            
                {children}                
                </div>
                <style jsx>
                {
                    `
                    .fitScreenContainer {
                        height: calc((var(--vh, 1vh) * 100));
                        max-height: calc((var(--vh, 1vh) * 100));
                        overflow:hidden;
                    }
                    .fitScreenContent { 
                        height: calc((var(--vh, 1vh) * 100) - ${navbarHeight});
                        max-height: calc((var(--vh, 1vh) * 100) - ${navbarHeight});
                        overflow:hidden;
                    }
                    `
                }
            </style>
            </div>
        );
    }
    return (
        <div className="flex flex-col h-screen overflow-auto">
            <Navbar setNavHeight={setNavHeight}/>
            {
                navbarHeight > 0 &&
                <div                     
                    className={`flex-grow bg-red-200 flex`}
                >
                { children }
                </div>
            }
            {/*             
            <style jsx>{`                
                .container {
                    min-width:calc(var(--vh, 1vh) * 100)px;
                    min-height: calc((var(--vh, 1vh) * 100) - ${navbarHeight}px);
                    height: auto;
                }
                @media (min-width: 640px){
                    .container {
                        min-width:100vw;
                        height: calc((var(--vh, 1vh) * 100) - ${navbarHeight}px);
                    }
                }
            `}
            </style>
            */}
        </div>
    );
}