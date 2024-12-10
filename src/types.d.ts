type Id = number | string;

export interface CardType {
  id: Id;
  title: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High';
}

export interface ListType {
  id: Id;
  title: string;
  cards?: Array<CardType>
}