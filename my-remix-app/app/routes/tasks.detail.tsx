import { ActionFunction, redirect } from "@remix-run/node";
import { Form, Link } from "@remix-run/react";
import { Box, Button, Input, VStack } from "@chakra-ui/react";
import { createTask } from "../model/task.server";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const title = formData.get("title") as string;
  if (title === "") {
    console.log("Title is required");
    return redirect("/todos/detail/${id}");
  } else {
    await createTask();
  }

  return redirect("/todos");
};

export default function NewTodo() {
  return (
    <main>
      <Box p={4}>
        <VStack spacing={4} as={Form} method="post">
          <Input placeholder="Todo title" name="title" />
          <Button type="submit">Add Todo</Button>
          <Link to="/todos">Back to list</Link>
        </VStack>
      </Box>
    </main>
  );
}
