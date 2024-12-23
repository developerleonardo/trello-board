type Id = number | string;
type Priority = 'Low' | 'Medium' | 'High';

export interface BoardType {
  id: Id;
  title: string;
  lists: Array<ListType>;
}

export interface ListType {
  boardId: Id;
  id: Id;
  title: string;
  cards?: Array<CardType>
}

export interface CardType {
  id: Id;
  title: string;
  description: string;
  priority: Priority;
}