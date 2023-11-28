'use client'
import styles from "./dataNav.module.css"
import React, { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function DataNav(){

    const supabase = createClientComponentClient();
    const [userData, setUserData] = useState();
    const getSession = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if(!user){
        alert("Unable to fetch session");
        return
      }
      console.log(user);
      const {data, error} = await supabase
                                    .from("users")
                                    .select()
                                    .eq("id", user.id);
      if(error) {
        alert("Unable to fetch user data.");
        return
      }
      setUserData(data[0]);
    }
    
    useEffect(() => {
      getSession();
    }, [])

    const months = [
        'January', 'February', 'March', 'April',
        'May', 'June', 'July', 'August',
        'September', 'October', 'November', 'December'
      ];
    
    const fechaActual = new Date();
    const monthName = months[fechaActual.getMonth()];

    // Formateamos la fecha
    const fechaFormateada = `${monthName} ${fechaActual.getDate()}, ${fechaActual.getFullYear()}`;
    
    return (


        <div className={styles.space}>
            <p className={styles.text}>{userData ? userData.username : "usuario"}</p>
            <p className={styles.text}>{fechaFormateada}</p>
        </div>
    );
    
}
