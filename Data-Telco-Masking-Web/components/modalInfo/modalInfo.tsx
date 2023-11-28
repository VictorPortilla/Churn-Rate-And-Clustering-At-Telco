'use client'
import Button from "@mui/material/Button";
import styles from "./modalInfo.module.css"
import IconButton from "@mui/material/IconButton";
import CodeIcon from '@mui/icons-material/Code';
import Image from 'next/image'
import graphicEx from '/public/graphicEx.png'
import { useState, useEffect } from 'react';
import { supabase } from "@/app/lib/initSupabase";



type ModalInfoProps = {
  clusterDescription: string;
  clusterTitle: string;
  clusterId: number;
}
export default function ModalInfo<ModalInfoProps>({
  clusterDescription="",
  clusterTitle="",
  clusterId=0,
}){

    const [newClusterDescription, setNewClusterDescription] = useState<any>();

    const handleInputDescription = (e: any) => {
        setNewClusterDescription(e.target.textContent);
    };

    const updateClusterInfo = async () => {
        try {
            const { data, error } = await supabase
                .from("kmeans_clusters")
                .update({
                    description: newClusterDescription,
                })
                .eq('id', clusterId);
    
            if (error) {
                console.error('Error updating cluster info:', error.message);
            } else {
                console.log('Cluster info updated successfully:', data);
            }
        } catch (error) {
            console.error('An unexpected error occurred:', error.message);
        }
    };
    

    return(
        <div className={styles.structureModal}>
            <div className={styles.section1}>
                <p className={styles.texth1}>{clusterTitle}</p>
            </div>
            
            <div className={styles.section1}>
                <p className={styles.texth2}>Description</p>
                <Button onClick={updateClusterInfo} variant="outlined" className={styles.saveButton} >
                Save
                </Button>
            </div>
            
            <div style={{display:"flex", justifyContent:"center"}}>
                <div className={styles.section2}>
                    <div style={{display:"flex",justifyContent:"end"}}>
                    </div>
                    <p className={styles.infoText} contentEditable={true} onInput={handleInputDescription}>{clusterDescription}</p>
                </div>
            </div>
            <div className={styles.section3}>
                <iframe src={`https://www.becode.software/cluster-report/${clusterId}`} height={"100%"} width={"100%"} frameBorder="0"  />
            </div>
        </div>
    );
}
