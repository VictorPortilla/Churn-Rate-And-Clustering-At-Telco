'use client'
import React, { useState, useEffect } from 'react';
import FormControl from "@mui/material/FormControl";
import styles from "./modalDistribute.module.css"
import InputLabel from "@mui/material/InputLabel";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import { ButtonGroup, Chip, IconButton, Input, OutlinedInput } from "@mui/material";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { sendWhats, sendEmail } from "@/app/pageClusters/call";

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import { Typography } from '@mui/material';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';


type ModalDistributeProps = {
  cluster_id_prop: number;
};
export default function ModalDistribute<ModalDistributeProps>({
  cluster_id_prop,
}){
  console.log( `cluster-id --> ${cluster_id_prop}`)

  const churnRateL = [
    "Unlikely",
    "Likely",
    "Most Likely",
    "Very likely",
  ]
  
  const typeUserL = [
    "Female",
    "Male",
    "North",
    "East",
    "West",
    "South",
    "Married",
    "Widow",
    "Single",
    "Employee",
    "Unemployment",
    "Self-Employed"
  ]

    const supabase = createClientComponentClient();
    const [mediaType, setMediaType]  = useState('10');
    const [churnRate, setChurnRate]  = useState<string[]>([]);
    const [typeUser, setTypeUser]  = useState<string[]>([]);
    const [sendOption,setSendOption] = useState('Email');
    const [valorInput, setValorInput] = useState('');
    const [selectedFile, setSelectedFile] = useState(undefined);
    const [selectedFileName, setSelectedFileName] = useState(null);
    const [img64,setImg64] = useState<any>(undefined);
    const [activeB, setActiveB] = useState(false);
    


    const handleChangeMediaType = (event: SelectChangeEvent) => {
        setMediaType(event.target.value as string);
        
    };
    
    const handleChangeChurnRate = (event: SelectChangeEvent<typeof churnRate>) => {
      const {
        target: { value },
      } = event;
      setChurnRate(
        // On autofill we get a stringified value.
        typeof value === 'string' ? value.split(',') : value,
      );
    };

    const handleChangeTypeUser = (event: SelectChangeEvent<typeof typeUser>) => {
      const {
        target: { value },
      } = event;
      setTypeUser(
        // On autofill we get a stringified value.
        typeof value === 'string' ? value.split(',') : value,
      );
    };

    const handleFileChange = (event:any) => {
        const file = event.target.files[0];
        let base64:any;
        //console.log(file);
        if (file) {
          // Aquí puedes realizar acciones con el archivo, como enviarlo a un servidor
          setSelectedFileName(file.name);
          setSelectedFile(file);
          const lector = new FileReader();
    
        // Configurar el evento de carga (cuando el lector termina de leer el archivo)
        lector.onloadend = function () {
          // Obtener la representación en base64 de la imagen
          const base64ImageData = lector.result;
          base64 = base64ImageData
    
          // Hacer lo que necesites con la representación base64 de la imagen
          //console.log(base64ImageData);
          setImg64(base64ImageData);
        }
        lector.readAsDataURL(file);
        
        
      
      }
      };
    

    
    const [clusterPosts, setClusterPosts] = useState([]);
    const getClusterHistory = async () => {
      const { data, error } = await supabase.from("posts")
                                              .select(`
                                                body,
                                                cluster_id,
                                                id,
                                                type,
                                                user_id
                                              `).eq("cluster_id", cluster_id_prop);
      if(error) {
       
        return
      }
      setClusterPosts(data);
    }

    const [smsRecommendation, setSmsRecommendation] = useState("");
    const fetchLLaMaMessage = async () => {
      
      if (churnRate.length !== 0 && mediaType==="10" && typeUser.length!== 0){
        const prompt = `Write me a promotion taking these aspects into account. The person churn rate ist ${churnRate.map(value =>{return value})}.The type of client is ${typeUser.map(value =>{return value})}`;
        console.log(prompt)

      }else{
        const prompt = `Type of traveling user, gender user filter, who spends a lot of money on roaming and is likely to abandon.`;
      }
      await fetch("https://www.becode.software/api/llama/message", {
        method: 'POST',
        body: JSON.stringify({
          "prompt": prompt
        }),
        headers: {
          'content-type': 'application/json'
        },
      }).then((res) => {
        if (!res.ok) {
          // Check for 404 or other error status
          if (res.status === 404) {
            throw new Error('Not Found');
          } else {
            throw new Error(`HTTP error! Status: ${res.status}`);
          }
        }
        return res.json()
      }).then((data) => {
        console.log(data);
        setSmsRecommendation(data.message);
      })
      
    }

    

    const [userId, setUserId] = useState("");
    const getSession = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if(!user){
        alert("Unable to fetch session");
        return
      }
      
      console.log( `Buenas ${user.id}`);
      
      setUserId(user.id);
    }
  // Función para manejar cambios en el input
  const historyUpdate = async () =>{
    const errorUser = await supabase
                                .from('posts')
                                .insert({

                                  user_id: userId,
                                  type: "text",
                                  body: valorInput===""?"Imagen":valorInput,
                                  cluster_id: cluster_id_prop,
                                })
    
    console.log(`Valor input ${valorInput}`)
    
  }

    const handleChange = (e:any) => {
    setValorInput(e.target.value);
    };

    const sendButtons = (selected:any) => {
        if (selected==1){
            setSendOption('Email');
        }else if(selected==2){
            setSendOption('Whats');
        }else{
            setSendOption('Facebook');
        }
    }
    
    const enviar = async () => {
        setActiveB(true);
        if(sendOption=="Email"){
            const response =  await sendEmail(valorInput,img64)
            if (response === 200){
              console.log("Enviar email")
              historyUpdate()
              setActiveB(false);
            }else{
              console.log("Fallo email")
              setActiveB(false);
            }        
        }else if(sendOption=="Whats"){
            const response =  await sendWhats(valorInput,img64)
            if (response === 200){
              console.log("Enviar whats")
              historyUpdate()
              setActiveB(false);
            }   else{
              console.log("Fallo whats")
              setActiveB(false);
            }
           
        }
        
        //

    }

    

    const choosenOption = () =>{
        if(mediaType =="10"){
            return(
                <input  placeholder="Ingresa tu texto"
                value={valorInput}
                onChange={handleChange}
                className={styles.selectMediaTInput}/>
            )

        }else{
        return(
            <div>
                <Button component="label" variant="contained" startIcon={<CloudUploadIcon />} size="small" >
                        Upload file
                        <input type="file" accept="image/*" onChange={handleFileChange} id="fileInput" style={{display:"none"}}/>
                </Button>
                <p style={{justifyContent:"center", display:"flex"}}>{selectedFileName}</p>
            
            
            
            </div>
        )
        }
    }
    useEffect(() => {
      fetchLLaMaMessage();
      getSession();
    }, [])
    useEffect(() => {
      if(cluster_id_prop){
        getClusterHistory();
      }
    }, [cluster_id_prop]);
    

    return(
        <div className={styles.structureModal}>
            <div className={styles.scrollableDiv}>

            <p className={styles.headers}>Distribute</p>

            <div className={styles.inputs}>

                <FormControl className={styles.input}>
                    <InputLabel id="demo-simple-select-label">Media Type</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={mediaType}
                        label="Media Type"
                        onChange={handleChangeMediaType}
                        
                    >
                        <MenuItem value={10}>Text</MenuItem>
                        <MenuItem value={20}>File</MenuItem>
                        <MenuItem value={30}>Video</MenuItem>
                    </Select>
                </FormControl>
                <FormControl className={styles.input} sx={{  width: 100 }}>
                  <InputLabel id="demo-multiple-chip-label">Churn rate</InputLabel>
                  <Select
                    labelId="demo-multiple-chip-label"
                    id="demo-multiple-chip"
                    multiple
                    value={churnRate}
                    onChange={handleChangeChurnRate}
                    input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex',  gap: 0.5, overflowX:"scroll", scrollbarWidth:"thin" }}>
                        {selected.map((value) => (
                          <Chip key={value} label={value} />
                        ))}
                      </Box>
                    )}
                    
                  >
                    {churnRateL.map((churn) => (
                      <MenuItem
                        key={churn}
                        value={churn}
                      
                      >
                        
                        {churn}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                

                <FormControl className={styles.input} sx={{  width: 100 }}>
                  <InputLabel id="demo-multiple-chip-label">Type user</InputLabel>
                  <Select
                    labelId="demo-multiple-chip-label"
                    id="demo-multiple-chip"
                    multiple
                    value={typeUser}
                    onChange={handleChangeTypeUser}
                    input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex',  gap: 0.5, overflowX:"scroll", scrollbarWidth:"thin" }}>
                        {selected.map((value) => (
                          <Chip key={value} label={value} />
                        ))}
                      </Box>
                    )}
                    
                  >
                    {typeUserL.map((type) => (
                      <MenuItem
                        key={type}
                        value={type}
                      
                      >
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                
                
            
            </div>

            <div className={styles.usersDiv}>
                <p className={styles.usersText}>87,000 users </p>
                <PeopleAltIcon className={styles.usersIcon}/>
                
            </div>
            <div className={styles.selectMediaT}>
                {choosenOption()}
            </div>
            <ButtonGroup  aria-label="outlined button group" className={styles.buttonGroup}>
                <Button variant={sendOption=="Email" ? "contained" : "outlined"} onClick={() => sendButtons(1)}>Email</Button>
                <Button variant={sendOption=="Whats" ? "contained" : "outlined"} onClick={() => sendButtons(2)}>Whats</Button>
                
            </ButtonGroup>

            <div className={styles.usersDiv}>
                <Button disabled={activeB} variant="outlined" className={styles.usersIcon} color="success" style={{width:"200px"}} onClick={() => enviar()} >Send</Button>
            </div>

            
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                height: "30%",
              }}
            >
              <IconButton onClick={fetchLLaMaMessage} >
                <AutorenewIcon color='success' />
              </IconButton>
             
              
              <Card
                variant="outlined"
                sx={{
                  height: "40%",
                  width: "80%",
                  backgroundColor: "#f7faf8",
                  borderColor: "#348139",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Typography 
                  variant="string" 
                  sx={{
                    width: "90%",
                    height: "80%",
                    color: "#348139",
                  }}
                >
                  {smsRecommendation} 
                </Typography>
              </Card>
            </Box>
             
            <p className={styles.headers}>History</p>
            
            <TableContainer  sx={{margin:"0 0 30px 80px", height: "auto", overflow: "auto", width:"67vw"}} component={Paper}>
                <Table >
                    <TableHead >
                    <TableRow sx={{backgroundColor:"#D9D9D9"}}>
                        <TableCell className={styles.textTableHeader} align="center">ID </TableCell>
                        <TableCell className={styles.textTableHeader}  align="center">Type</TableCell>
                        <TableCell className={styles.textTableHeader}  align="center">Date</TableCell>
                        <TableCell className={styles.textTableHeader}  align="center">Object</TableCell>
                        
                    </TableRow>
                    </TableHead>
                    <TableBody >
                    
                    {clusterPosts.map((row) => (
                        <TableRow
                          key={row.id}
                        >
                        <TableCell className={styles.textTableSize} align="center">{row.id}</TableCell>
                        <TableCell className={styles.textTableSize} align="center">{row.type}</TableCell>
                        <TableCell className={styles.textTableSize} align="center">date</TableCell>
                        <TableCell className={styles.textTableSize} align="center">{row.body}</TableCell>
                        </TableRow>
                    ))}
                    
                    </TableBody>
                </Table>
            </TableContainer>

            </div>

        </div>
        
    );
}
