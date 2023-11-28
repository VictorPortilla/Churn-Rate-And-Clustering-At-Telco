import React, {useState, useEffect} from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

import { myAction } from './actions';
import { removeTeamAction } from './actions';


const generateRandomString = (length:any) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }

  return result;
};


const AdminPanel = () => {



  const supabase = createClientComponentClient();
  const cellsPadding = {padding: "1px", 
                        width:"16.6%", 
                        textOverflow: 'ellipsis', 
                        overflow: 'hidden',
                        my: 2,
                        p: 1,
                        };

  
  const [newTeamName, setNewTeamName] = useState('');
  const [newManagerEmail, setNewManagerEmail] = useState('');
  const [newManagerUsername, setNewManagerUsername] = useState('');
  const createManager = async (event:any) => {
    event.preventDefault();
    if(event.target.team_name.value === '' || event.target.username.value === '' || event.target.email.value === ''){
      alert('please fill the form.')
      return
    }
    const team_name = event.target.team_name.value;
    const username  = event.target.username.value;
    const email     = event.target.email.value;
    const {data, error} = await myAction(email);
    if(error){
      console.log(error);
      alert('error while trying to register new manager user.')
      return
    }
    const newTeamId = generateRandomString(5);
    const {errorTeam} = await supabase
                            .from('teams')
                            .insert({
                              id: newTeamId,
                              team: team_name 
                            })
    if(errorTeam){
      alert('error while creating new team.')
      return
    }
    const {errorUser} = await supabase
                                .from('users')
                                .insert({
                                  id: data.user.id,
                                  username: username,
                                  role: 'manager',
                                  rank: 2,
                                  team_id: newTeamId
                                })
    if(errorUser) {
      alert('error inserting new manager into users')
      return
    }
  }

  const [teamToRemove, setTeamToRemove] = useState();
  const removeTeam = async () => {
    const {data, error} = await removeTeamAction(teamToRemove);
    if(error){
      alert('Unable to delete selected team');
      return
    }
    setOpenDeleteModal(false);
  }

  const [managers, setManagers] = useState([]);
  const getManagers = async () => {
    const {data, error} = await supabase.from('users')
                                          .select(`
                                            id,
                                            username,
                                            role,
                                            team_id(
                                              id, 
                                              team
                                            )
                                          `)
                                          .eq('role', 'manager');
    if(error) {
      alert('Unable to fetch managers');
      return
    }
    console.log(data)
    setManagers(data);
    setOpenModal(false);
  }


  useEffect(() => {
    getManagers();
  }, []);

  const [openModal, setOpenModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  useEffect(() => {
    getManagers();
  }, [openModal, openDeleteModal]);
  return(
    <Grid
      container
      sx={{
        display:'flex',
        flexDirection:'column',
        alignItems:'center',
        height: '95%',
      }}
    >    
      <Grid
        item
        sx={{
          display:'flex',
          flexDirection:'row',
          alignItems:'center',
          height: '20%',
          width:'90%',
        }}
      > 
        <Typography
          variant='h3'
          gutterBottom
        >
          Administration Panel
        </Typography>
      </Grid>
      <Grid
        item
        sx={{
          display:'flex',
          flexDirection:'column',
          justifyContent:'center',
          alignItems:'center',
          height: '80%',
          width:'90%',
        }}
      > 
      <Grid
        sx={{
          width: '95%', 
          height: '10%', 
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'end',
        }}
      >
        <Button
          variant='contained'
          onClick={() => {
            setOpenModal(true);
          }}
        >
          New Manager 
        </Button>
        <Modal
          open={openModal}
          onClose={() => {
            setOpenModal(false);
          }}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          sx={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Card
            sx={{
              width: '50%',
              height: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Grid
              sx={{
                width: '95%',
                height: '90%',
                display: 'flex',
                flexDirection: 'column',
              }}
              component='form'
              onSubmit={createManager}
            >
              <Grid
                sx={{
                  width: '100%',
                  height: '15%',
                }}
              >
                <Box
                  sx={{
                    width: '100%',
                    height: '60%',
                    backgroundColor: '#e3e3e3',
                    borderRadius: '25px',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <Typography
                    variant='h6'
                    gutterBottom
                    sx={{
                      paddingLeft: '20px',
                    }}
                  > 
                    Create New Team 
                  </Typography>
                </Box>
              </Grid>
              <Grid
                sx={{
                  width: '100%',
                  height: '70%',
                  display: 'flex',
                  flexDirection: 'row',
                }}
              >
                <Box
                  sx={{
                    width: '50%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                > 
                  <Grid
                    sx={{
                      width: '100%',
                      height: '40%',
                      display: 'flex', 
                      flexDirection: 'column',
                      justifyContent: 'center',
                    }}
                  >
                    <Typography
                      variant='h6'
                      gutterBottom
                      sx={{
                        paddingBottom: '10px',
                      }}
                    > 
                     Team Name 
                    </Typography>
                    <TextField
                      required
                      id="team_name"
                      label="Team Name"
                      variant="outlined"
                      sx={{
                        width: '80%',
                      }}
                    />
                  </Grid>
                  <Grid
                    sx={{
                      width: '100%',
                      height: '40%',
                      display: 'flex', 
                      flexDirection: 'column',
                      justifyContent: 'center',
                    }}
                  >
                    <Typography
                      variant='h6'
                      gutterBottom
                      sx={{
                        paddingBottom: '10px',
                      }}
                    > 
                      Username
                    </Typography>
                    <TextField
                      required
                      id="username"
                      label="Username"
                      variant="outlined"
                      sx={{
                        width: '80%',
                      }}
                    />
                  </Grid>
                </Box>
                <Box
                  sx={{
                    width: '50%',
                    height: '100%',
                  }}
                > 
                  <Grid
                    sx={{
                      width: '100%',
                      height: '40%',
                      display: 'flex', 
                      flexDirection: 'column',
                      justifyContent: 'center',
                    }}
                  >
                    <Typography
                      variant='h6'
                      gutterBottom
                      sx={{
                        paddingBottom: '10px',
                      }}
                    > 
                      Email 
                    </Typography>
                    <TextField
                      required
                      id="email"
                      label="Email"
                      variant="outlined"
                      sx={{
                        width: '80%',
                      }}
                    />
                  </Grid>
                </Box>
              </Grid>
              <Box
                sx={{
                  width: '100%',
                  height: '15%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Button
                  type="submit"
                  variant='contained'
                >
                  Save 
                </Button>
              </Box>
            </Grid>
          </Card>
        </Modal>

        <Modal
          open={openDeleteModal}
          onClose={() => {
            setOpenDeleteModal(false);
          }}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          sx={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Card
            sx={{
              width: '50%',
              height: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Box
              sx={{
                width: '50%',
                height: '95%',
              }}
            >
              <Grid
                sx={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <Box
                  sx={{
                    width: '100%',
                    height: '80%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography
                    variant='h3'
                    gutterBottom
                    sx={{
                      fontWeight: 'bold',
                    }}
                  >
                    You sure ?
                  </Typography>
                </Box>
                <Box
                  sx={{
                    width: '100%',
                    height: '20%',
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                  }}
                >
                  <Button
                    variant= 'outlined'
                    color= 'error'
                    sx={{
                      height: '60%',
                      width: '40%',
                    }}
                    onClick={removeTeam}
                  >
                    Delete
                  </Button>
                </Box>
              </Grid>
            </Box>
          </Card>
        </Modal>
      </Grid>
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
                                <TableCell sx={cellsPadding} align="center">Name</TableCell>
                                <TableCell sx={cellsPadding} align="center">Role</TableCell>
                                <TableCell sx={cellsPadding} align="center">Team ID</TableCell>
                                <TableCell sx={cellsPadding} align="center">Team</TableCell>
                                <TableCell sx={cellsPadding} align="center">Delete</TableCell>
                            </TableRow>
                            </TableHead>
                            <TableBody 
                            >
                            { managers.map((row, index) => (
                                <TableRow
                                  key={1}
                                >
                                  <TableCell sx={cellsPadding} align="center">{index}</TableCell>
                                  <TableCell sx={cellsPadding} align="center">{row.username}</TableCell>
                                  <TableCell sx={cellsPadding} align="center">{row.role}</TableCell>
                                  <TableCell sx={cellsPadding} align="center">{row.team_id.id}</TableCell>
                                  <TableCell sx={cellsPadding} align="center">{row.team_id.team}</TableCell>
                                  <TableCell sx={cellsPadding} align="center">
                                    <Button
                                      variant='outlined'
                                      color='error'
                                      onClick={() => {
                                        setOpenDeleteModal(true);
                                        setTeamToRemove(row.team_id.id);
                                      }}
                                    >
                                      Delete
                                    </Button>
                                  </TableCell>
                                </TableRow>
                            ))}
                            
                            </TableBody>
                        </Table>
                    </TableContainer>
      </Grid>
    </Grid>
  );
}
export default AdminPanel;
