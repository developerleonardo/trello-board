type Id = number | string;
type Priority = 'Low' | 'Medium' | 'High';

export interface CardType {
  id: Id;
  title: string;
  description: string;
  priority: Priority;
}

export interface ListType {
  id: Id;
  title: string;
  cards?: Array<CardType>
}