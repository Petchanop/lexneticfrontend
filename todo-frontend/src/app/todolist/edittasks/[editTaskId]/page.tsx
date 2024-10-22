'use client'

import { todoStore, TtodoState } from "@/app/store/todoStore";
import { CalendarDate, getLocalTimeZone, today } from "@internationalized/date";
import { Button } from "@nextui-org/button";
import { Card, CardBody, CardFooter, CardHeader } from "@nextui-org/card";
import { DatePicker } from "@nextui-org/date-picker";
import { Input, Textarea } from "@nextui-org/input";
import { DateValue } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useShallow } from "zustand/shallow";

export default function EditTask({ params }: { params: { editTaskId: string } }) {
    const { editTaskId } = params;
    const [todo, setTodo] = useState<TtodoState>();
    const [addTodoObject, setaddTodoObject] = useState<boolean>(false);
    const [task, setTask] = useState<string>("");
    const [comment, setComment] = useState<string>("");
    const [dueDate, setdueDate] = useState<DateValue>();
    const [todos, updateTodo] = todoStore(useShallow((state) => [state.todos, state.updateTodo]));
    const router = useRouter()
    useEffect(() => {
        const updateTodoObjectList = () => {
            if (addTodoObject && todo) {
                const timenow = today(getLocalTimeZone()).toDate('Asia/Bangkok')
                const taskObject = {
                    id: todo.id.toString(),
                    task: task ? task : todo.task,
                    comment: comment ? comment : todo.comment,
                    completed: todo.completed,
                    dueDate: dueDate ? dueDate.toDate('Asia/Bangkok') : todo.dueDate,
                    createdAt: todo.createdAt,
                    updatedAt: timenow,
                }
                updateTodo(taskObject);
                console.log("update", taskObject)
            }
        }
        const getTodoValue = () => {
            if (editTaskId) {
                const todo = todos.find((item) => item.id === editTaskId)
                setTodo(todo)
                console.log(todo)
            }
        }
        getTodoValue();
        updateTodoObjectList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [addTodoObject, editTaskId])
    return (
        <>
            {
                todo ?
                    <div className="flex p-10 items-center justify-center h-screen">
                        <Card className="p-10 w-6/12 h-4/5" >
                            <CardHeader className="flex justify-between items-center gap-3">
                                <h1 className="text-4xl font-bold tracking-wide p-4">Edit Task</h1>
                                <Button size="md" onClick={(e) => {
                                    e.preventDefault();
                                    router.back();
                                }}>
                                    Back
                                </Button>
                            </CardHeader>
                            <CardBody className="flex flex-col justify-start p-4 space-y-4 h-fit mt-5">

                                <Input
                                    isRequired
                                    variant="flat"
                                    label="Title"
                                    labelPlacement="outside"
                                    placeholder="Enter task title"
                                    className="max-h-30 pt-5"
                                    size="lg"
                                    defaultValue={todo.task}
                                    onValueChange={(value) => {
                                        setTask(value)
                                    }}
                                />
                                <Textarea
                                    isRequired
                                    variant="flat"
                                    label="Description"
                                    labelPlacement="outside"
                                    placeholder="Type here"
                                    size="lg"
                                    defaultValue={todo.comment}
                                    onValueChange={(value) => {
                                        setComment(value)
                                    }}
                                />
                                <DatePicker
                                    labelPlacement="outside"
                                    label="Due date"
                                    className=""
                                    isRequired
                                    minValue={today(getLocalTimeZone()).add({ days: 1 })}
                                    defaultValue={
                                        todo ?
                                            new CalendarDate(todo.dueDate.getFullYear(), todo.dueDate.getMonth() + 1, todo.dueDate.getDate())
                                            : today(getLocalTimeZone()).add({ days: 1 })
                                    }
                                    onChange={(value) => {
                                        setdueDate(value)
                                    }}
                                />
                            </CardBody>
                            <CardFooter className="w-full">
                                <Button className="w-full" onClick={(e) => {
                                    e.preventDefault();
                                    setaddTodoObject(true);
                                    if (task || comment || dueDate) {
                                        router.back();
                                    }
                                }}>
                                    Edit Task
                                </Button>
                            </CardFooter>
                        </Card>
                    </div > : <></>
            }
        </>
    )
}