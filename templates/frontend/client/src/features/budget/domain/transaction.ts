export interface Transaction {
  id: string;
  name: string;
  amount: number;
  created: Date;
  category: Category;
};

export interface Category {
  name: string;
};
