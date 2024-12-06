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
export interface BookDataArgs {
  bookId: string;
  title: string;
  authors: string[];
  description: string;
  image: string;
  link: string;
}
