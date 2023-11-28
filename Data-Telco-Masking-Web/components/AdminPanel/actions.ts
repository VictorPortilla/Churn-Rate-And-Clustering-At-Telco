'use server'
import { createClient } from '@supabase/supabase-js'

export async function myAction(email: string) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY;
  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  const { data, error } = await supabase.auth.admin.createUser({
    email: email,
    password: '123456789',
  });
  return {data, error};
}

export async function removeTeamAction(selected_team_id: string) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY;
  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  const {data, error} = await supabase
                                .from('users')
                                .update({team_id: null, role: 'none'})
                                .eq('team_id', selected_team_id);
  if(error){
    return {data, error};
  }
  const {dataTemas, errorTeams} = await supabase
                                          .from('teams')
                                          .delete()
                                          .eq('id', selected_team_id);
  return {data, error};
}
