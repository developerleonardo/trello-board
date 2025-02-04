import {supabase} from './supabase/client';
import { v4 as uuid } from "uuid";
import { Id } from './types';

const fetchBoards = async (currentUser: Id) => {
    const { data, error } = await supabase
      .from('boards')
      .select('*')
      .eq('userId', currentUser);
  
    if (error) throw error;
    return data;
  };
  const createDefaultBoard = async (currentUser: Id) => {
    const { data, error } = await supabase
      .from('boards')
      .insert([{ userId: currentUser, id: uuid(), title: 'My First Board', emoji: '🐹' }])
      .select()
      .single();
  
    if (error) throw error;
    return data;
  };

  export const fetchOrCreateBoards = async (currentUser: Id) => {
    const boards = await fetchBoards(currentUser);
  
    if (boards.length === 0) {
      // No boards exist; create a default board
      const defaultBoard = await createDefaultBoard(currentUser);
      return [defaultBoard]; // Return the newly created board in an array
    }
    return boards; // Return existing boards
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