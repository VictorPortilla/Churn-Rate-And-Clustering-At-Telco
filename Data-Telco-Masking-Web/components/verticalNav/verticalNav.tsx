'use client'
import styles from "./verticalNav.module.css"
import Image from 'next/image'
import BecodeLogo from '/public/BecodeLogo.png'
import Button from "@mui/material/Button";
import React, { useState, useEffect } from 'react';
import Link from 'next/link'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';

export default function VerticalNav(props:any){

    const [btHome, setBTHome] = useState(true);
    const [btGraphics, setBTGraphics] = useState(false);
    const [btClusters, setBTClusters] = useState(false);
    const [btLookOut, setBTLookOut]   = useState(false);
    const [btTeamAdmin, setBTTeamAdmin] = useState(false);
    const [btManager, setBTManager] = useState(false);

    const router = useRouter();

    const changeToSelectecBT = (page:any) => {
        props.changePage(page);
        
    };

    const buttonSelected = (numbers:number) =>{
        if(numbers==1){
            setBTHome(true);
            setBTGraphics(false);
            setBTClusters(false);
            setBTLookOut(false);
            setBTTeamAdmin(false);
            setBTManager(false);
            changeToSelectecBT("Home");
        }else if(numbers==2){
            setBTHome(false);
            setBTGraphics(true);
            setBTClusters(false);
            setBTLookOut(false);
            setBTTeamAdmin(false);
            setBTManager(false);
            changeToSelectecBT("Graphics");
        }else if(numbers == 3){
            setBTHome(false);
            setBTGraphics(false);
            setBTClusters(true);
            setBTLookOut(false);
            setBTTeamAdmin(false);
            setBTManager(false);
            changeToSelectecBT("Clusters");
        } else if(numbers == 4){
            setBTHome(false);
            setBTGraphics(false);
            setBTClusters(false);
            setBTLookOut(true);
            setBTTeamAdmin(false);
            setBTManager(false);
            changeToSelectecBT("LookOut");
        } else if (numbers == 5) {
            setBTHome(false);
            setBTGraphics(false);
            setBTClusters(false);
            setBTLookOut(false);
            setBTTeamAdmin(true);
            setBTManager(false);
            changeToSelectecBT("TeamAdmin");
        } else {
            setBTHome(false);
            setBTGraphics(false);
            setBTClusters(false);
            setBTLookOut(false);
            setBTTeamAdmin(false);
            setBTManager(true);
            changeToSelectecBT("Manager");
        }

    }

    const supabase = createClientComponentClient()
    const [userRole, setUserRole] = useState("manager");
    const fetchUserRole = async () => {
      const {data: {user}} = await supabase.auth.getUser();
      if(!user){
        alert("Unable to fetch session.")
        return
      }
      const {data, error} = await supabase.from("users").select("*").eq("id", user.id);
      if(error){
        alert("Error fetching associated clusters.")
        return
      }
      setUserRole(data[0].role);
    }

    useEffect(() => {
      fetchUserRole();
    }, []);

    useEffect(() => {
    }, [userRole]);
    useEffect(() => {
        // Este efecto se ejecuta cuando el estado de mostrarVista1 cambia
        // Puedes realizar tareas relacionadas con la vista aquí
      }, [btHome,btGraphics,btClusters]);

    const signOutUser = async () => {
      const { error } = await supabase.auth.signOut();
      if(error){
        alert("unable to sign out.")
        return
      }
      return router.push("/");
    }

    return(
        <div className={styles.structure}>
            <div className={styles.center}>
                <Image src={BecodeLogo} alt='Logo BeCode' className={styles.imageNav}></Image>
 
            </div>
            <button className={btHome ? styles.botonOpSe:styles.botonOp} onClick={()=>buttonSelected(1)}>INICIO</button>
            <button className={btGraphics ? styles.botonOpSe:styles.botonOp} onClick={()=>buttonSelected(2)}>GRAFICAS</button>
            <button className={btClusters ? styles.botonOpSe:styles.botonOp} onClick={()=>buttonSelected(3)}>CLUSTERS</button>
            <button className={btLookOut ? styles.botonOpSe:styles.botonOp} onClick={()=>buttonSelected(4)}>LOOKOUT</button>
            {userRole === "admin" && (
              <button className={btTeamAdmin ? styles.botonOpSe:styles.botonOp} onClick={()=>buttonSelected(5)}>ADMIN</button>
            )}
            {userRole === "manager" && (
              <button className={btManager ? styles.botonOpSe:styles.botonOp} onClick={()=>buttonSelected(6)}>MANAGER</button>
            )}
              <button 
                className={styles.botonOp}
                onClick={() => {
                  signOutUser();
                }}
              > LOGOUT</button>
        </div>  
    );

}
