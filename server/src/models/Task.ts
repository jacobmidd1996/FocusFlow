import { Schema, type Document } from "mongoose";

export interface TaskDocument extends Document {
  taskId: string;
  title: string;
  description: string;
  status: string;
  dueDate: string;
}

const taskSchema = new Schema<TaskDocument>({
  description: {
    type: String,
    required: true,
  },
  taskId: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: ["Pending", "In Progress", "Completed"],
    default: "Pending",
  },
  dueDate: {
    type: String,
    required: true,
  },
});

export default taskSchema;
