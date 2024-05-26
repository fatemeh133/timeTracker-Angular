export interface Task {
  taskId?: number;
  userId: number;
  taskName: string;
  duration: string;
  isChecked: boolean;
  date: string;
}
