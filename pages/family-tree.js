import { Layout } from '../components/layout';
import { ForceLayout } from '../components/charts/force-layout';
import styles from "../styles/pages/home.module.css";

export default function LoanVis({loans}) {    
    return (
        <Layout alwaysFitScreen={true}>
            <ForceLayout />      
        </Layout>
    );
}