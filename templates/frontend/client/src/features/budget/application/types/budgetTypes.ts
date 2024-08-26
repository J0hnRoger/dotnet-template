export type TransactionDto = {
  id: string;
  name: string;
  amount: number;
  created: Date;
  category: CategoryDto;
};

export interface CategoryDto {
  name: string;
};
