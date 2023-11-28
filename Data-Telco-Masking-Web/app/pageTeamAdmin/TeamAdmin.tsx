import React, {useState, useEffect} from 'react';
import AdminPanel from '@/components/AdminPanel/AdminPanel';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

const TeamAdmin = () => {
  const supabase = createClientComponentClient();
  const [userData, setUserData] = useState();
  const [isAdmin, setIsAdmin] = useState(false);
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
    console.log(data[0].role);
    setUserData(data[0]);
    if (data[0].role === 'admin'){
      setIsAdmin(true);
    }else{
      console.log('is not admon');
    }
  }
  useEffect(() => {
    getSession();
  } ,[])
  return(
    <AdminPanel/>
  );
}
export default TeamAdmin;
