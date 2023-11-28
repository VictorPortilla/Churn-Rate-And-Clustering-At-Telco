'use client'
import styles from "./page.module.css";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import React, { useState, useEffect } from 'react';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Typography from '@mui/material/Typography';
import { makeStyles } from '@material-ui/core/styles';




export default function PageHome(){
    
    const supabase = createClientComponentClient();

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
      setUserData(data[0]);
    }
    const [teamCollaboration, setTeamCollaboration] = useState([]);
    const getTeamCollaborationRows = async () => {
      const {data, error}  = await supabase.from("posts")
                                            .select(`
                                              id,
                                              user_id!inner(
                                                username
                                              ),
                                              type,
                                              body,
                                              cluster_id(
                                                title
                                              )
                                            `).eq("user_id.team_id", userData?.team_id);

      if(error) {
        alert("Unable to fetch user collaborations.");
        return
      }
      setTeamCollaboration(data);
    }
    const [userCollaborations, setUserCollaborations] = useState([]);
    const getUserCollaborations = async () => {
      const {data, error} = await supabase.from("posts")
                                            .select(`
                                              id,
                                              user_id!inner(
                                                username
                                              ),
                                              type,
                                              body,
                                              cluster_id(
                                                title
                                              )
                                            `).eq("user_id", userData.id);
      setUserCollaborations(data);
    }
    
    useEffect(() => {
      getSession();
    }, [])

    useEffect(() => {
      if(userData) {
        getTeamCollaborationRows(); 
        getUserCollaborations();
      }
    }, [userData]);


    const cellsPadding = {padding: "1px", 
                          width:"16.6%", 
                          textOverflow: 'ellipsis', 
                          overflow: 'hidden',
                          my: 2,
                          p: 1,
                          };
    return(
        <div className={styles.body}>
            <div className={styles.twoDivs}>
                <div className={styles.card}>
                    <p className={styles.textStyle}>Welcolme {userData ? userData.username : "usuario"} ! 👋</p>
                </div>
                <div className={styles.cardTable}>
                    <p className={styles.textStyle}>Team Work 👨‍💻 👨‍💻 👨‍💻</p>

                    
                    <TableContainer
                      sx={{
                        margin:"0 0 0 10px", 
                        height: "82%", 
                        overflow: "auto", 
                        width:"95%", 
                        scrollbarWidth:"thin",
                        "&::-webkit-scrollbar": {
                          width:3
                        },
                        "&::-webkit-scrollbar-track": {
                          backgroundColor: "white"
                        },
                        "&::-webkit-scrollbar-thumb": {
                          backgroundColor: "#D9D9D9",
                          borderRadius: 2
                        }
                      }} 
                      component={Paper}
                    >
                        <Table>
                            <TableHead >
                            <TableRow 
                              sx={{
                                backgroundColor:"#D9D9D9",
                              }}
                            >
                                <TableCell sx={cellsPadding} align="center">ID</TableCell>
                                <TableCell sx={cellsPadding} align="center">Cluster</TableCell>
                                <TableCell sx={cellsPadding} align="center">Date</TableCell>
                                <TableCell sx={cellsPadding} align="center">User</TableCell>
                                <TableCell sx={cellsPadding} align="center">Type</TableCell>
                                <TableCell sx={cellsPadding} align="center">Description</TableCell>
                                
                            </TableRow>
                            </TableHead>
                            <TableBody 
                            >

                            {teamCollaboration.map((row) => (
                                <TableRow
                                  key={row.id}
                                >
                                <TableCell sx={cellsPadding} align="center">{row.id}</TableCell>
                                <TableCell sx={cellsPadding} align="center">{row.cluster_id.title}</TableCell>
                                <TableCell sx={cellsPadding} align="center">date</TableCell>
                                <TableCell sx={cellsPadding} align="center">{row.user_id.username}</TableCell>
                                <TableCell sx={cellsPadding} align="center">{row.type}</TableCell>
                                <TableCell sx={cellsPadding} align="center">
                                  <Typography 
                                    sx={{
                                      maxWidth: 100, // percentage also works
                                      whiteSpace: 'nowrap',
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis',
                                      fontSize: "12px"
                                    }}
                                  > 
                                    {row.body}
                                  </Typography>
                                </TableCell>
                                
                                </TableRow>
                            ))}
                            
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            </div>
            <div className={styles.cardLonely}>
                <p className={styles.textStyle}>Your Contributions 🏋️</p>

                
                    <TableContainer sx={{margin:"0 0 0 10px",  height: "85%", overflow: "auto", width:"95%", scrollbarWidth:"thin"}} component={Paper}>
                        <Table >
                            <TableHead >
                            <TableRow sx={{backgroundColor:"#D9D9D9"}}>
                                <TableCell className={styles.text2TableHeader} align="center">ID </TableCell>
                                <TableCell className={styles.text2TableHeader}  align="center">Date</TableCell>
                                <TableCell className={styles.text2TableHeader} align="center">Type</TableCell>
                                <TableCell className={styles.text2TableHeader} align="center">Cluster</TableCell>
                                
                            </TableRow>
                            </TableHead>
                            <TableBody>
                            {userCollaborations.map((row) => (
                                <TableRow
                                key={row.id}
                                
                                >
                                <TableCell className={styles.text2TableSize} align="center">{row.id}</TableCell>
                                <TableCell className={styles.text2TableSize} align="center">date</TableCell>
                                <TableCell className={styles.text2TableSize} align="center">{row.type}</TableCell>
                                <TableCell className={styles.text2TableSize} align="center">{row.cluster_id.title}</TableCell>
                                
                                </TableRow>
                            ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                
                
                
                
            </div>
            
        </div>
        
    )

}
