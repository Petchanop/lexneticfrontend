'use client'

import { todoStore } from "@/app/store/todoStore";
import { getLocalTimeZone, today } from "@internationalized/date";
import { Button } from "@nextui-org/button";
import { Card, CardBody, CardFooter, CardHeader } from "@nextui-org/card";
import { DatePicker } from "@nextui-org/date-picker";
import { Input, Textarea } from "@nextui-org/input";
import { DateValue } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useShallow } from "zustand/shallow";

export default function AddTask() {
    const [addTodoObject, setaddTodoObject] = useState<boolean>(false);
    const [task, setTask] = useState<string>("");
    const [comment, setComment] = useState<string>("");
    const [dueDate, setdueDate] = useState<DateValue>(today(getLocalTimeZone()).add({days: 1}));
    const [todos, addTodo] = todoStore(useShallow((state) => [state.todos, state.addTodo]));
    const router = useRouter()
    useEffect(() => {
        const addTodoObjectList = () => {
            if (addTodoObject) {
                const timenow = today(getLocalTimeZone()).toDate('Asia/Bangkok')
                const taskObject = {
                    id: todos.length.toString(),
                    task: task,
                    comment: comment,
                    completed: false,
                    dueDate: dueDate.toDate('Asia/Bangkok'),
                    createdAt: timenow,
                    updatedAt: timenow,
                }
                addTodo(taskObject);
                console.log(taskObject)
            }
        }
        addTodoObjectList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [addTodoObject])

    return (
        <div className="flex p-10 items-center justify-center h-screen">
            <Card className="p-10 w-6/12 h-4/5">
                <CardHeader className="flex justify-between items-center gap-3">
                    <h1 className="text-4xl font-bold tracking-wide p-4">Add Task</h1>
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
                        onValueChange={(value) => {
                            setComment(value)
                        }}
                    />
                    <DatePicker
                        labelPlacement="outside"
                        label="Due date"
                        className=""
                        isRequired
                        minValue={today(getLocalTimeZone()).add({days: 1})}
                        defaultValue={today(getLocalTimeZone()).add({days: 1})}
                        onChange={(value) => {
                            setdueDate(value)
                        }}
                    />
                </CardBody>
                <CardFooter className="w-full">
                    <Button className="w-full" onClick={(e) => {
                        e.preventDefault();
                        setaddTodoObject(true);
                        if (task && comment) {
                            router.back();
                        }
                    }}>
                        Add Task
                    </Button>
                </CardFooter>
            </Card>
        </div >
    )
}
