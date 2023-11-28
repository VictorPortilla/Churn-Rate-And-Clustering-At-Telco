'use client'

import Image from 'next/image'
import styles from './page.module.css'
import Link from 'next/link'
import logoOr from '/public/logoOr.png'
import BecodeLogo from '/public/BecodeLogo.png'
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField'
import React, { useState, useEffect } from 'react';
import FormControlLabel from '@mui/material/FormControlLabel';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

import { useRouter } from 'next/navigation';


export default function Page() {

  const [action, setAction] = useState(true);
  const [page, setPage] = useState('Register');

  const supabase = createClientComponentClient()

  const router = useRouter();

  const changeModal = () => {
    if(action){
      setAction(false);
      setPage("Login");
    }else{
      setAction(true);
      setPage("Register");
    }
    
  };

  const checkLogged = async () => {
    const {data: {user}} = await supabase.auth.getUser();
      if(!user){
        return
      }
      return router.push("/home");
  }
  useEffect(() => {
    checkLogged();
  }, []);

  const handleSubmitRegister = async (event:any) => {
    event.preventDefault();

    const email = event.target.email.value;
    const username = event.target.username.value;
    const team_key = event.target.team_key.value;
    const {data:teamKeyData, error:teamKeyError} = await supabase
                                                  .from('teams')
                                                  .select()
                                                  .eq('id', team_key);
    console.log('im here');
    console.log(team_key)
    console.log(teamKeyData);
    if(teamKeyData?.length === 0 || teamKeyError) {
      alert('Not valid key.')
      console.log(teamKeyError);
      return
    }
    console.log('im over here');
    console.log(teamKeyData);
    console.log('donnit');
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: "123456789",
      options: {
        emailRedirectTo: `${location.origin}/auth/callback`,
      },
    });
    if(error){
      alert("Error on Log In");
      return;
    }
    await supabase
      .from("users")
      .insert([{
        id: data?.user?.id,
        username: username,
        team_id: team_key,
        role: "dsc",
        rank:1
      }]);
      alert("Go check your email.");
  }

  const handleSubmitSignIn = async (event:any) => {
    event.preventDefault();

    const email = event.target.email.value;
    const { data, error } = await supabase.auth.signInWithOtp({
      email: email,
      options: {
        shouldCreateUser: false,
        emailRedirectTo: `${location.origin}/auth/callback`,
      },
    });
    if(error){
      alert("Unable to fetch account.")
      return
    }
    alert("Go check your email.")
    
    // router.push('/home');
  }

  const activeModal = () => {
    if(action){
      return(
        <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                bgcolor: "white",
                width: "50%",
                minWidth: "300px",
                maxWidth: "330px",
                height: "80%",
                minHeight: "400px",
                maxHeight: "450px",
                borderRadius:"20px",
                boxShadow: 3,
              }}
        >
          <Box  component="form" 
                onSubmit={handleSubmitSignIn} 
                noValidate sx={{ 
                  width: "80%",
                }}
          >
            <Typography 
                variant="h4" 
                component="div" 
                sx={{ 
                  flexGrow: 1,
                  color: "#CC0841"
                }}
            >
              Log In 
            </Typography>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ 
                mt: 3, 
                mb: 2,
                bgcolor: "#CC0841",
                '&:hover': {
                  backgroundColor: '#A70433'
                }
              }}
            >
              Sign In
            </Button>
          </Box>
        </Box>
      );
    }else{
      return(
        <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                bgcolor: "white",
                width: "50%",
                minWidth: "300px",
                maxWidth: "330px",
                height: "80%",
                minHeight: "400px",
                maxHeight: "450px",
                borderRadius:"20px",
                boxShadow: 3,
              }}
        >
          <Box  component="form" 
                onSubmit={handleSubmitRegister} 
                noValidate sx={{ 
                  width: "80%",
                }}
          >
            <Typography 
                variant="h4" 
                component="div" 
                sx={{ 
                  flexGrow: 1,
                  color: "#CC0841"
                }}
            >
              Register 
            </Typography>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="team_key"
              label="Team Key"
              name="team_key"
              autoComplete="team_key"
              autoFocus
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ 
                mt: 3, 
                mb: 2,
                bgcolor: "#CC0841",
                '&:hover': {
                  backgroundColor: '#A70433'
                }
              }}
            >
              Register 
            </Button>
          </Box>
        </Box>
      );
    }
      
  };
  useEffect(() => {
    // Este efecto se ejecuta cuando el estado de mostrarVista1 cambia
    // Puedes realizar tareas relacionadas con la vista aquí
  }, [action]);

  return (
    <div className={styles.the_body}>
      <div className={styles.navBar}>
        <Image src={BecodeLogo} 
          alt='Logo BeCode' 
          className={styles.imageNav}
        />
        <div></div>
        <Button variant="text" className={styles.optionNav} onClick={changeModal}>{page}</Button>
      </div>

      <div className={styles.section}>
          <div className={styles.section_side}>
            <Image src={logoOr} alt='Logo oracle' className={styles.image}></Image>
          </div>
          <div className={styles.section_side}>
              {activeModal()}
          </div>
      </div>
      
    </div>
  )
}
