export interface User {
  username: string | null;
  password: string | null;
  savedTasks: Tasks[];
}
