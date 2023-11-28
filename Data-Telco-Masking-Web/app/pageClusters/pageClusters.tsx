'use client'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import styles from "./pageClusters.module.css"
import IconButton from '@mui/material/IconButton';
import ShareIcon from '@mui/icons-material/Share';
import InfoIcon from '@mui/icons-material/Info';
import { blue, purple } from '@mui/material/colors';
import { useState, useEffect } from 'react';


import Modal from '@mui/material/Modal';
import ModalInfo from '@/components/modalInfo/modalInfo';
import ModalDistribute from '@/components/modalDistribute/modalDistribute';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function PageClusters(){ 

  const supabase = createClientComponentClient();

    const [clustersCounts, setClustersCounts] = useState();
    const featchKMeansCounts = async () => {
      await fetch("https://www.becode.software/api/churn_category_counts", {
        method: "POST",
        headers: {
          'content-type': 'application/json'
        },
      }).then((res)=>{
        if (!res.ok) {
          // Check for 404 or other error status
          if (res.status !== 404) {
            throw new Error('Not Found');
          } else {
            throw new Error(`HTTP error! Status: ${res.status}`);
          }
        }
        return res.json()
      }).then((data) => {
        console.log(data);
        setClustersCounts(data);
      })
    }

    const [clusterDescription, setClusterDescription] = useState<any>();
    const [clusterTitle, setClusterTitle] = useState<any>();
    const [userData, setUserData] = useState();
    const getSession = async () => {
    const { data: { user } } = await supabase.auth.getUser();
      if(!user){
        alert("Unable to fetch session");
        return
      }
      const {data, error} = await supabase
                                    .from("users")
                                    .select()
                                    .eq("id", user.id);
      if(error) {
        alert("Unable to fetch user data.");
        return
      }
      console.log(data[0]);
      setUserData(data[0]);
    }
    const [clusterInfo, setClusterInfo] = useState<any[]>([]);
    const getClustersInfo = async  () => {
      const { data, error } = await supabase
      .from("kmeans_clusters")
      .select()
      .eq("team_id", userData?.team_id);
    setClusterInfo(data);
    console.log(data);
    }
    
    const [modalDescriptionOpen, setModalDescriptionOpen] = useState(false);
    const [modalDistributeOpen, setModalDistributeOpen] = useState(false);

    
    const [theClusterId, setTheClusterId] = useState();
    const openModalDescription = (description: string, title: string, clusterId: number) => {
      setModalDescriptionOpen(true);
      setClusterDescription(description);
      setClusterTitle(title);
      setTheClusterId(clusterId);
    };
    
    const closeModalDescription = () => {
      setModalDescriptionOpen(false);
    };
    const [selectedClusterId, setSelectedClusterId] = useState();
    const openModalDistribute = (cluster_id_prop?: number) => {
      setModalDistributeOpen(true);
      setSelectedClusterId(cluster_id_prop); 
    };
    
    const closeModalDistribute = () => {
      setModalDistributeOpen(false);
    };

    useEffect(() => {
      getSession();
      featchKMeansCounts();
    }, [])

    useEffect(() => {
    }, [clustersCounts])

    useEffect(() => {
      if(userData) {
        getClustersInfo();
      }
    }, [userData]);

    return(
        <div className={styles.cardTable}>

            
            
            <p className={styles.textStyle}>Clusters</p>

            
            <TableContainer  sx={{margin:"0 0 0 10px", height: "82.5%", overflow: "auto", width:"calc(99% - 10px)", scrollbarWidth:"thin"}} component={Paper}>
                <Table >
                    <TableHead >
                    <TableRow sx={{backgroundColor:"#D9D9D9"}}>
                        <TableCell className={styles.textTableHeader} align="center">ID </TableCell>
                        <TableCell className={styles.textTableHeader}  align="center">Low</TableCell>
                        <TableCell className={styles.textTableHeader}  align="center">Moderate</TableCell>
                        <TableCell className={styles.textTableHeader}  align="center">High</TableCell>
                        <TableCell className={styles.textTableHeader} align="center">Critical</TableCell>
                        <TableCell className={styles.textTableHeader} align="center">Label</TableCell>
                        <TableCell className={styles.textTableHeader} align="center">Actions</TableCell>                        
                        
                    </TableRow>
                    </TableHead>
                    <TableBody >
                    
                    {clusterInfo.map((row) => (
                        <TableRow
                          key={row.ID}
                        >
                        <TableCell className={styles.textTableSize} align="center">{row.cluster_number}</TableCell>
                        <TableCell className={styles.textTableSize} align="center">{clustersCounts?.kCounts?.[row.cluster_number-1]?.low || 'default value'}</TableCell>
                        <TableCell className={styles.textTableSize} align="center">{clustersCounts?.kCounts?.[row.cluster_number-1]?.moderate || 'default value'}</TableCell>
                        <TableCell className={styles.textTableSize} align="center">{clustersCounts?.kCounts?.[row.cluster_number-1]?.high || 'default value'}</TableCell>
                        <TableCell className={styles.textTableSize} align="center">{clustersCounts?.kCounts?.[row.cluster_number-1]?.critical || 'default value'}</TableCell>
                        <TableCell className={styles.textTableSize} align="center">{row.title}</TableCell>
                        <TableCell className={styles.textTableSize} align="center">
                        <IconButton aria-label="info" onClick={() => openModalDescription(row.description, row.title, row.cluster_number)}>
                            <InfoIcon style={{color:purple[500]}}  />
                        </IconButton>
                        <IconButton onClick={() => openModalDistribute(row.id)}>
                          <ShareIcon style={{color:blue[500]}}/>
                        </IconButton>

                        </TableCell>

                        
                        </TableRow>
                    ))}
                    
                    </TableBody>
                </Table>
            </TableContainer>
            
            
        
            <Modal
            open={modalDescriptionOpen}
            onClose={closeModalDescription}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
            }}
          >
              <ModalInfo clusterDescription={clusterDescription} clusterTitle={clusterTitle} clusterId={theClusterId - 1}/>
            </Modal>
            <Modal
            open={modalDistributeOpen}
            onClose={closeModalDistribute}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
            }}
            
          >
              <ModalDistribute
                cluster_id_prop={selectedClusterId} 
              />
            </Modal>

        
        </div>  
    );
}
