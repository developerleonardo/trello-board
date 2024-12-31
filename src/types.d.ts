type Id = number | string;
type Priority = 'Low' | 'Medium' | 'High';

export interface BoardType {
  id: Id;
  title: string;
}

export interface ListType {
  boardId: Id;
  id: Id;
  title: string;
  cards?: Array<CardType>;
  order: number;
}

export interface CardType {
  listId: Id;
  id: Id;
  title: string;
  description: string;
  priority: Priority;
  order: number;
}