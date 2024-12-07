export interface LoginUserArgs {
  username: string;
  password: string;
}
export interface AddUserArgs {
  username: string;
  password: string;
}
export interface TaskDataArgs {
  taskId: string;
  title: string;
  description: string;
  dueDate?: string; //Optional
}
