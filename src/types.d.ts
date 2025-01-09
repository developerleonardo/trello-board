type Id = number | string;
type Priority = 'Low' | 'Medium' | 'High';

export interface BoardType {
  userId: Id,
  id: Id;
  title: string;
}

export interface ListType {
  boardId: Id;
  id: Id;
  title: string;
  cards?: Array<CardType>;
  order: number;
  userId: Id;
}

export interface CardType {
  listId: Id;
  id: Id;
  title: string;
  description: string;
  priority: Priority;
  order: number;
  userId: Id;
}