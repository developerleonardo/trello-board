import {supabase} from './supabase/client';
import { Id } from './types';

export const fetchBoards = async () => {
    const { data, error } = await supabase.from('boards').select('*')
    if (error) throw error
    return data
};
export const fetchLists = async (currentUser: Id) => {
    const { data, error } = await supabase.from("lists").select("*").eq("userId", currentUser).order("order", { ascending: true })
    if (error) throw error
    return data
}
export const fetchCards = async (currentUser: Id) => {
    const { data, error } = await supabase.from("cards").select("*").eq("userId", currentUser)
    if (error) throw error
    return data
}