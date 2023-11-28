import React, {useState, useEffect} from 'react';
import styles from "./pageManager.module.css"
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import IconButton from '@mui/material/IconButton';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import Modal from '@mui/material/Modal';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import ModalUser from '@/components/modalUser/modaluser';


const Manager = () => {

  const supabase = createClientComponentClient();
  const [teamInfo, setTeamInfo] = useState<any[]>([]);
  const [modalUserInfoOpen, setModalUserInfoOpen] = useState(false);
  const [selectedUsernname, setSelectedUsername] = useState<any>();
  const [selectedUserTeamId, setSelectedUserTeamId] = useState<any>();
  const [selectedUserRole, setSelectedUserRole] = useState<any>();
  const [selectedUserId, setSelectedUserId] = useState<any>();


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

  const getUsersWithPosts = async () => {
    try {
        const { data, error } = await supabase
            .from("manager_team_panel")
            .select("*")
            .eq("team_id", userData?.team_id);


        if (error) {
            console.error('Error fetching user information:', error.message);
            return;
        }

        console.log('Users info success');
        console.log(data)
        setTeamInfo(data)

    } catch (error) {
        console.error('An unexpected error occurred:', error.message);
    }
  };



  const openModalUserInfo = (username: any, team_id: any, Role: any, userId: any) => {
    setModalUserInfoOpen(true);
    setSelectedUsername(username);
    setSelectedUserTeamId(team_id);
    setSelectedUserRole(Role);
    setSelectedUserId(userId)
    
  }
  const closeModalUserInfo = () => {
    setModalUserInfoOpen(false);
  };

  useEffect(() => {
    getSession();
  }, [])

  useEffect(() => {
    if(userData) {
      getUsersWithPosts();
    }
  }, [userData, modalUserInfoOpen]);

  useEffect(() => {
    if(userData) {
      getUsersWithPosts();
    }
  }, [modalUserInfoOpen]);



  return(
    <div className={styles.cardTable}>
      <p className={styles.textStyle}>Team Members</p>

      <TableContainer sx={{margin:"0 0 0 10px", height: "82.5%", overflow: "auto", width:"calc(99% - 10px)", scrollbarWidth:"thin"}} component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{backgroundColor:"#D9D9D9"}}>
              <TableCell className={styles.textTableHeader} align='center'>User</TableCell>
              <TableCell className={styles.textTableHeader} align='center'>Team_ID</TableCell>
              <TableCell className={styles.textTableHeader} align='center'>Role</TableCell>
              <TableCell className={styles.textTableHeader} align='center'>number of post</TableCell>
              <TableCell className={styles.textTableHeader} align='center'>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {teamInfo.map((row) => (
              <TableRow key={row.ID}>
                <TableCell className={styles.textTableSize} align="center">{row.username}</TableCell>
                <TableCell className={styles.textTableSize} align="center">{row.team_id}</TableCell>
                <TableCell className={styles.textTableSize} align="center">{row.role}</TableCell>
                <TableCell className={styles.textTableSize} align="center">{row.number_posts}</TableCell>
                <TableCell className={styles.textTableSize} align="center">{row.cluster_number}
                  <IconButton onClick={() => openModalUserInfo(row.username, row.team_id, row.role, row.user_id)}>
                    <MoreHorizIcon style={{ color: 'rgba(169, 169, 169, 1)' }}/>
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      
      <Modal 
      open={modalUserInfoOpen} 
      onClose={closeModalUserInfo}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
      }}
      >
        <ModalUser username={selectedUsernname} teamId={selectedUserTeamId} role={selectedUserRole} user_id={selectedUserId} onClicClose={closeModalUserInfo}/>
      </Modal>

    </div>
  );
}
export default Manager;
