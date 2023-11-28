'use client'

import VerticalNav from '@/components/verticalNav/verticalNav';
import DataNav from '@/components/dataNav/dataNav';
import styles from "./page.module.css";
import React, { useState, useEffect } from 'react';
import PageHome from '../pageHome/page';
import PageGraphics from '../pageGraphics/pageGraphics';
import PageClusters from '../pageClusters/pageClusters';
import TeamAdmin from '../pageTeamAdmin/TeamAdmin';
import Manager from '../pageManager/pageManager';
import LookOut from '../pageLookOut/LookOut';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function Home(){

    const [page, setPage] = useState("Home")


    const changePage = (value:any) => {
        setPage(value);
    }

    const changeSection = () =>{
        if(page == "Home"){
            return(<PageHome/>);
        }else if(page=="Graphics"){
            return(<PageGraphics/>);
        }else if(page=="Clusters"){
          return(<PageClusters/>);
        }else if(page=="LookOut"){            return(<LookOut/>);
        }else if(page=="TeamAdmin"){
            return(<TeamAdmin/>);
        }else{
            return(<Manager/>)
        }
    }

    useEffect(() => {
        changeSection()
      }, [page]);

    return (
        <div className={styles.structure}>
            <VerticalNav changePage={changePage} />
            <div>
                <DataNav></DataNav>
                {changeSection()}
            </div>
            
            
        </div>
       
    );
}
