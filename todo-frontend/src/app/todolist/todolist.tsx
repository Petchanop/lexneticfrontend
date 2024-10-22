'use client'

import { Button } from "@nextui-org/button";
import { Card, CardBody, CardFooter, CardHeader } from "@nextui-org/card";
import { Checkbox } from "@nextui-org/checkbox";
import { useRouter } from "next/navigation";
import { PencilIcon, Trash2Icon } from "lucide-react";
import { todoStore, TtodoState } from '../store/todoStore';
import { useEffect, useState } from "react";
import { Modal, ModalBody, ModalContent, ModalHeader, useDisclosure } from "@nextui-org/modal";
import { useShallow } from "zustand/shallow";

export default function TodoList() {
    const [taskLeft, setTaskLeft] = useState<number>()
    const [isCompleted, setIsCompleted] = useState<boolean>(false)
    const [todos, removeTodo, updateTodo] = todoStore(useShallow((state) => [state.todos, state.removeTodo, state.updateTodo]));
    const [todoList, setTodoList] = useState<TtodoState[]>(todos)
    const router = useRouter();

    function findTaskLeft(todoList: TtodoState[]): number {
        if (todoList) {
            const taskLeft = todoList.reduce((acc, item) => {
                return !item.completed ? acc + 1 : acc
            }, 0)
            console.log("task left", taskLeft)
            return taskLeft
        }
        return 0
    }
    useEffect(() => {
        const updateTodoList = () => {
            setTodoList(todos);
            const taskLeft = findTaskLeft(todos);
            setTaskLeft(taskLeft);
        }
        updateTodoList();
    }, [todos, todoList, isCompleted])

    return (
        <>
            <div className="flex  p-10 items-center justify-center h-screen" >
                < Card className="p-10 w-6/12 h-4/5" >
                    <CardHeader>
                        <div className="flex flex-col space-y-4 w-screen">
                            <h1 className="text-4xl font-bold tracking-wide p-4">To-Do List</h1>
                            <div className="flex justify-between items-center gap-3">
                                <h4 className="font-bold">My Tasks</h4>
                                <Button size="md" onClick={(e) => {
                                    e.preventDefault();
                                    router.push('/todolist/addtasks')
                                }
                                }>
                                    Add Task
                                </Button>
                            </div>
                            {
                                todoList ?
                                    <p>You have {taskLeft} tasks left.</p>
                                    : <p>You have no tasks left.</p>
                            }
                        </div>
                    </CardHeader>
                    <CardBody className="overflow-y-auto">
                        <div className="max-h-40 space-y-2">
                            {
                                todoList ?
                                    todoList.map((item: TtodoState) => {
                                        return (
                                            <div key={item.dueDate.toString()}>
                                                <Task todo={item}
                                                    removeTodo={removeTodo}
                                                    updateTodo={updateTodo}
                                                    isCompleted={isCompleted}
                                                    setIsCompleted={setIsCompleted}
                                                />
                                            </div>
                                        )
                                    })
                                    : <></>
                            }
                        </div>
                    </CardBody>
                </Card >
            </div >
        </>
    )
}

type TtaskProps = {
    todo: TtodoState;
    removeTodo: (todo: TtodoState) => void;
    updateTodo: (todo: TtodoState) => void;
    isCompleted: boolean;
    setIsCompleted: (value: boolean) => void;
}

function Task(props: TtaskProps) {
    const { todo, removeTodo, updateTodo, isCompleted, setIsCompleted } = props
    const { task, id, completed, comment, dueDate } = todo
    const [isClient, setIsClient] = useState(false)

    useEffect(() => {
        setIsClient(true)
    }, [])
    const router = useRouter()
    return (
        <Card className="p-5">
            <CardHeader>
                <div className="flex flex-row items-center w-screen space-x-4">
                    <div className="basis-3/5 text-xl tracking-wide">
                        <Checkbox lineThrough={completed} radius="sm" onChange={() => {
                            setIsCompleted(!isCompleted);
                            todo.completed = !completed;
                            console.log("check", todo.task, todo.completed, isCompleted)
                            updateTodo(todo);
                        }}
                        >{task}</Checkbox>
                    </div>
                    <div className="flex justify-end basis-2/5 space-x-2">
                        <Button isIconOnly size="sm" variant="ghost" className="border-none" onClick={(e) => {
                            console.log("task", id); e.preventDefault(); router.push(`/todolist/edittasks/${id}`)
                        }}>
                            <PencilIcon size={16} color="#39a030" fill="#39a030" />
                        </Button>
                        <DeleteModal todo={todo} removeTodo={removeTodo} />
                    </div>
                </div>
            </CardHeader>
            <CardBody className="p-4">
                <p>{comment}</p>
            </CardBody>
            <CardFooter suppressHydrationWarning>
                {isClient ? dueDate.toDateString() : ""}
            </CardFooter>
        </Card>
    )
}

function DeleteModal(props: { todo: TtodoState, removeTodo: (todo: TtodoState) => void }) {
    const { todo, removeTodo } = props
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    return (
        <>
            <Button onPress={onOpen} isIconOnly size="sm" variant="ghost" className="border-none">
                <Trash2Icon size={16} color="#f54343" fill="#f54343" />
            </Button>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="center" className="w-50">
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col justify-center items-center gap-3 text-black font-normal">
                                <h1 className="text-3xl tracking-wide p-2">Are you sure?</h1>
                                <p>Do you want to delete this item.</p>
                            </ModalHeader>
                            <ModalBody className="flex flex-row justify-center items-center gap-3 mb-2">
                                <Button onPress={onClose}>No</Button>
                                <Button onPress={() => removeTodo(todo)}>Yes</Button>
                            </ModalBody>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    )
}