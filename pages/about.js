import { SocialIcon } from "react-social-icons";
import { Layout } from '../components/layout';
import styles from "../styles/pages/home.module.css";

export default function About() {    
    return (
        <Layout alwaysFitScreen={true}>
            <div className='flex-grow bg-green-400 flex justify-center items-center'>
                <div className="w-full h-full flex items-center justify-center bg-sky-100">
                    <figure className="mx-2 md:mx-0 max-w-md flex flex-col justify-center items-center pt-8 text-center bg-white rounded-t-lg border-b border-gray-200 md:rounded-t-none md:rounded-tl-lg md:border-r">
                        <figcaption className="flex justify-center items-center space-x-3">
                            <img className="w-16 h-16 rounded-full" src={"/images/Elon.jpeg"} alt="profile picture" />
                            <div className="space-y-0.5 font-medium text-left">
                                <p className='text-sm font-semibold italic'>Created by:</p>
                                <div className='text-lg'>Your Name</div>
                                <div className="text-sm font-semibold text-gray-700">Web and Mobile App Developer</div>
                            </div>
                        </figcaption>
                        <blockquote className="mx-4 mb-4 max-w-2xl text-gray-600 lg:mb-8">
                            <p className="my-4 font-light">
                                Write description about yourself. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                            </p>
                        </blockquote>
                        <div className="w-full bg-cyan-200 flex items-center justify-end p-2">
                            <SocialIcon url='https://www.linkedin.com/in/petrando-richard/' />
                            <SocialIcon style={{ marginLeft:5 }} url='mailto:bangkitwisata@gmail.com' />
                        </div>    
                    </figure>
                </div>    
            </div>   
        </Layout>
    );
}