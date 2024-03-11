import {
  json,
  LoaderFunction,
  SerializeFrom,
  redirect,
  ActionFunction,
} from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import {
  Card,
  Heading,
  Box,
  Link,
  HStack,
  Button,
  VStack,
  Flex,
} from "@chakra-ui/react";
import { useState } from "react";
import { getTasks, createTask } from "../model/task.server";
import { AddTaskModal } from "../components/task.modal";

// 投稿の型を定義
type Task = {
  id: number;
  title: string;
  contents: string | null;
  dueDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
  status: string | null;
};

// loader関数の型をLoaderFunctionで明示的に指定
export const loader: LoaderFunction = async () => {
  const tasks: Task[] = []; // Post型の配列として初期化
  const resp = await getTasks();
  console.log(resp);
  if (resp) {
    tasks.push(...resp);
  }
  // tasks.push(
  //   {
  //     number: 1,
  //     title: "My First ToDo",
  //     contents: "First",
  //     dueDate: "2024-01-31",
  //     status: "Doing",
  //   },
  //   {
  //     number: 2,
  //     title: "My Second ToDo",
  //     contents: "aaaaaaa",
  //     dueDate: "2024-01-31",
  //     status: "Completed",
  //   },
  // );
  return json({ tasks });
};

// useLoaderDataの型を明示的に指定
interface LoaderData {
  tasks: Task[];
}

export const addTask: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const title = formData.get("title") as string;

  console.log(`title: ${title}`);

  await createTask();

  return redirect("/todos");
};

export function TaskCards(props: {
  selectedItemNumber: number;
  status: string;
  tasks: SerializeFrom<Task>[];
  onClick: React.Dispatch<React.SetStateAction<number>>;
}) {
  return (
    <>
      <Card
        key={props.status}
        p={4}
        width="250px"
        alignItems="center"
        height="650px"
        overflow="hidden"
        boxShadow="none"
        bgColor="gray.800"
        borderColor="gray.300"
      >
        <Heading size="md" textColor="gray.300">
          {props.status}
        </Heading>

        <Box overflowX="hidden">
          {props.tasks.map((task) =>
            props.status === task.status ? (
              <Card
                key={task.id}
                width="230px"
                m={2}
                onClick={() => props.onClick(task.id)}
                boxShadow={
                  props.selectedItemNumber === task.id ? "outline" : "none"
                }
                bgColor="gray.700"
                height="50px"
                cursor="pointer"
                borderRadius={5}
                z-index={1}
              >
                <Heading fontSize="xs" color="gray.400" m={1}>
                  id: {task.id}
                  <br />
                  <Link
                    href={task.id.toString()}
                    color="gray.200"
                    fontSize="md"
                  >
                    {task.title}
                  </Link>
                </Heading>
              </Card>
            ) : null,
          )}
        </Box>
      </Card>
    </>
  );
}

export default function Tasks() {
  // useLoaderDataの返り値の型をLoaderDataに指定
  const data = useLoaderData<LoaderData>();
  const tasks = data.tasks;
  console.log(tasks);
  const statuses = ["Not Ready", "Ready", "Doing", "Completed", "Stoped"];
  const [selectedItemNumber, setSelectedItemNumber] = useState(0);
  return (
    <main>
      <Box bgColor="gray.700">
        <Flex direction="column" h="100vh" maxH="100vh" overflowX="hidden">
          <Heading size="lg" textColor="gray.200">
            My ToDo List
          </Heading>
          <Box
            border="2px"
            borderColor="gray.400"
            bgColor="gray.700"
            w="full"
            h="full"
            m={2}
            p={2}
            overflow="hidden"
          >
            <HStack spacing={2}>
              {statuses.map((status) => {
                return (
                  <>
                    <VStack
                      key={status}
                      spacing={4}
                      position="sticky"
                      bottom="0"
                      overflowX="hidden"
                    >
                      <Box
                        w="full"
                        border="1px"
                        borderColor="gray.300"
                        borderRadius="10"
                        overflow="hidden"
                        justifyItems="center"
                      >
                        <TaskCards
                          key={status}
                          status={status}
                          tasks={tasks}
                          onClick={setSelectedItemNumber}
                          selectedItemNumber={selectedItemNumber}
                        />
                        <Box width="full" bgColor="gray.900">
                          <Button
                            key={status}
                            width="full"
                            position="sticky"
                            bottom={0}
                            bgColor="gray.900"
                            textStyle="sm"
                            textColor="gray.400"
                            borderRadius="10"
                            onClick={AddTaskModal}
                          >
                            + Add New Todo
                          </Button>
                        </Box>
                      </Box>
                    </VStack>
                  </>
                );
              })}
            </HStack>
          </Box>
        </Flex>
      </Box>
    </main>
  );
}
