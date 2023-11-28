'use client'
import Button from "@mui/material/Button";
import styles from "./modaluser.module.css"
import IconButton from "@mui/material/IconButton";
import CodeIcon from '@mui/icons-material/Code';
import Image from 'next/image'
import graphicEx from '/public/graphicEx.png'
import { useState, useEffect } from 'react';
import { supabase } from "@/app/lib/initSupabase";

type ModalUserProps = {
    username: string;
    teamId: any;
    role: string;
    user_id: any;
    onClickdelete: () => void;
}

export default function ModalUser<ModalUserProps>({
    username,
    teamId,
    role,
    user_id,
    onClicClose,

}){

    const [newUserRole, setNewUserRole] = useState<any>();
    const handleRole = async (newRole: any) => {
        setNewUserRole(newRole.target.textContent)
    }


    const updateUserRole = async () => {
        try {
            const { data, error } = await supabase
                .from("users")
                .update({
                    role: newUserRole,
                })
                .eq('id', user_id);
    
            if (error) {
                console.error('Error updating user info:', error.message);
            } else {
                console.log('User Role updated successfully:', data);
            }
        } catch (error) {
            console.error('An unexpected error occurred:', error.message);
        }
    };

    const onClickdeleteUser = () => {
        cascadeDeleteUser();
        console.log("Remove")
        onClicClose();
    }

    const onClickUpdateUser = () => {
        updateUserRole();
        onClicClose();
    }

    const cascadeDeleteUser = async () => {
        try {    
            const deletePostsResponse = await supabase
                .from("posts")
                .delete()
                .eq('user_id', user_id);
    
            if (deletePostsResponse.error) {
                console.error('Error deleting posts:', deletePostsResponse.error.message);
                return;
            }

            const deleteUserResponse = await supabase
                .from("users")
                .delete()
                .eq('id', user_id);
    
            if (deleteUserResponse.error) {
                console.error('Error deleting user:', deleteUserResponse.error.message);
                return;
            }
    
            console.log('Cascading delete completed successfully.');
        } catch (error) {
            console.error('An unexpected error occurred:', error.message);
        }
    };
    

    return(
        <div className={styles.structureModal}>
            <div className={styles.section1}>
                <p className={styles.texth1}></p>
            
            </div>
            
            <div className={styles.section1}>
                <p className={styles.texth2}>{username} Information</p>
            </div>
            <div className={styles.section4}>
                <div className={styles.section3}>
                    <p className={styles.texth3}>Username</p>
                    <p className={styles.section3}>{username}</p>
                </div>
                <div className={styles.section3}>
                    <p className={styles.texth3}>Team Id</p>
                    <p className={styles.section3}>{teamId}</p>
                </div>
                <div className={styles.section3}>
                    <p className={styles.texth3}>Role</p>
                    <p className={styles.section2} contentEditable={true} onInput={handleRole}>{role}</p>
                </div>
                <div></div>
            </div>
        
            <div className={styles.section5}>
                <div className={styles.texth2}>
                <Button variant="outlined" className={styles.deleteButton} onClick={onClickdeleteUser}>
                Delete
                </Button>
                <Button variant="outlined" className={styles.saveButton} onClick={onClickUpdateUser}>
                Save
                </Button>
                </div>
                
            </div>
        </div>
    );
}
