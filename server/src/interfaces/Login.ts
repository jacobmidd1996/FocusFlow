export interface LoginUserArgs {
  username: string;
  email: string;
  password: string;
}
export interface AddUserArgs {
  username: string;
  email: string;
  password: string;
}
export interface TaskDataArgs {
  bookId: string;
  title: string;
  authors: string[];
  description: string;
  image: string;
  link: string;
}
