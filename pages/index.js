import Link from 'next/link';
import { Layout } from '../components/layout';
import styles from "../styles/pages/home.module.css";

export default function Home() {
  
  return (
    <Layout alwaysFitScreen={false}>
      <div className='bg-sky-100 flex-grow'>
      <p className="mb-4 md:mb-2 ml-2 mr-2 md:ml-8 md:mr-8 font-light text-gray-800 first-line:uppercase first-line:tracking-widest first-letter:text-7xl first-letter:font-bold first-letter:text-gray-900 first-letter:mr-3 first-letter:float-left">
        I love data visualizations! I have some years of javascript experience under my belt, and creating interactive eye catching
        visualizations is something I cerish for! Here you can enjoy on some of my achievements.
      </p>
      
      <div className="w-full flex items-start justify-center pb-8 md:pb-0 flex-wrap">
        <div className='basis-full md:basis-1/2 lg:basis-1/3 p-2 flex justify-center items-center'>
          <div className="h-80 rounded overflow-hidden shadow-lg  relative">
            <img className="w-full h-40" src="/images/famTree2.png" alt="Sunset in the mountains" />
            <div className="px-4 py-2">
              <div className="font-bold text-base mb-1">Interactive Family Tree</div>
              <p className="text-gray-700 text-[12px] sm:text-[14px]">              
                British Monarch family tree where you can search a family member and see relations between 
                houses and family members.
              </p>
            </div>
            <div className="px-6 pt-4 pb-2 absolute right-0 bottom-0">
              <Link 
                href={"/family-tree"}
                className="inline-block cursor-pointer bg-cyan-500 hover:bg-cyan-700 rounded-full px-3 py-1 text-xs font-semibold text-white mr-2 mb-2">
                Visit
              </Link>            
            </div>
          </div>
        </div>

        <div className='basis-full md:basis-1/2 lg:basis-1/3 p-2 flex justify-center items-center'>
          <div className="h-80 rounded overflow-hidden shadow-lg  relative">
            <img className="w-full h-40" src="/images/loanVis.png" alt="Sunset in the mountains" />
            <div className="px-4 py-2">
              <div className="font-bold text-base mb-1">Bank Loan Data Visualization</div>
              <p className="text-gray-700 text-[12px] sm:text-[14px]">
                My first freelance job for a bank client. This Visualization displays bank loan data based on country and cities, 
                along with various data such as Loan Products and collectibility risk within regions.
              </p>
            </div>
            <div className="px-6 pt-4 pb-2 absolute right-0 bottom-0">
              <Link 
                href={"/loan-vis"}
                className="inline-block cursor-pointer bg-cyan-500 hover:bg-cyan-700 rounded-full px-3 py-1 text-xs font-semibold text-white mr-2 mb-2"
              >
                Visit
              </Link>            
            </div>
          </div>
        </div>
        
        
      </div>
      </div>
    </Layout>
  )
}