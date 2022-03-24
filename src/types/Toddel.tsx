export type ToddelMutate = Omit<Toddel, 'created_at' | 'updated_at'>;

export type Toddel = {
  edition: number;
  created_at: string;
  updated_at: string;
  title: string;
  image: string;
  pdf: string;
  published_at: string;
};
