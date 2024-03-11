import { db } from "../utils/db.server";

export async function getTasks() {
  return db.task.findMany()
}

export async function createTask() {
  await db.task.create({
    data: {
      id: 3,
      title: "Third ToDo",
      dueDate: "2024-12-31",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: "Not Ready"
    },
  });
}
