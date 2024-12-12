'use client'

import { deleteClass, deleteExam, deleteStudent, deleteSubject, deleteTeacher } from "@/lib/actions"
import dynamic from "next/dynamic"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { useFormState } from "react-dom"
import { toast } from "react-toastify"
import { FormContainerProps } from "./FormContainer"

const deleteActionsMap = {
    subject: deleteSubject,
    class: deleteClass,
    teacher: deleteTeacher,
    student: deleteStudent,
    parent: deleteSubject,
    lesson: deleteSubject,
    exam: deleteExam,
    assignment: deleteSubject,
    result: deleteSubject,
    attendance: deleteSubject,
    event: deleteSubject,
    announcement: deleteSubject,
}


const TeacherForm = dynamic(() => import("./forms/TeacherForm"), {
    loading: () => <h1>...loading</h1>
})
const StudentForm = dynamic(() => import("./forms/StudentForm"), {
    loading: () => <h1>...loading</h1>
})
const SubjectForm = dynamic(() => import("./forms/SubjectForm"), {
    loading: () => <h1>...loading</h1>
})
const ClassForm = dynamic(() => import("./forms/ClassForm"), {
    loading: () => <h1>...loading</h1>
})
const ExamForm = dynamic(() => import("./forms/ExamForm"), {
    loading: () => <h1>...loading</h1>
})

const form: {
    [key: string]:
    (setOpen: Dispatch<SetStateAction<boolean>>, type: 'create' | 'update', data?: any, relatedData?: any) => JSX.Element
} = {
    teacher: (setOpen, type, data, relatedData) => <TeacherForm type={type} data={data} setOpen={setOpen} relatedData={relatedData} />,
    student: (setOpen, type, data, relatedData) => <StudentForm type={type} data={data} setOpen={setOpen} relatedData={relatedData} />,
    subject: (setOpen, type, data, relatedData) => <SubjectForm type={type} data={data} setOpen={setOpen} relatedData={relatedData} />,
    class: (setOpen, type, data, relatedData) => <ClassForm type={type} data={data} setOpen={setOpen} relatedData={relatedData} />,
    exam: (setOpen, type, data, relatedData) => <ExamForm type={type} data={data} setOpen={setOpen} relatedData={relatedData} />
}

const FormModal = ({ table, type, data, id, relatedData }: FormContainerProps & { relatedData?: any }) => {
    const size = type === "create" ? "w-8 h-8" : "w-7 h-7"
    const bgColor = type === "create" ? "bg-ProYellow" : type === "update" ? "bg-ProSky" : "bg-Propurple"
    const icon = type === "create" ? "/plus.png" : type === "update" ? "/edit.png" : "/delete.png"

    const [open, setOpen] = useState(false)

    const Form = () => {
        const [state, formAction] = useFormState(deleteActionsMap[table], {
            success: false,
            error: false
        })

        const router = useRouter()

        useEffect(() => {
            if (state.success) {
                toast(`${table} has been deleted`)
                setOpen(false)
                router.refresh()
            }
        }, [state])

        return type === 'delete' && id ?
            (
                <form className="p-4 flex flex-col gap-4" onSubmit={(e) => { e.preventDefault(); formAction(id) }}>
                    <span className="text-center font-medium">All data will lost. Are you sure you want to delete this {table}?</span>
                    <button
                        className="bg-red-700 text-white py-2 px-4 rounded-md border-none w-max self-center">Delete</button>
                </form>
            ) : (type === 'create' || type === 'update') ? form[table](setOpen, type, data, relatedData) : 'form not found'
    }

    return (
        <div>
            <button className={`${size} flex items-center justify-center rounded-full ${bgColor}`}
                onClick={() => setOpen(true)}
            >
                <Image src={`${icon}`} alt="" width={16} height={16} />
            </button>
            {open &&
                <div
                    className="w-full h-full absolute left-0 top-0 bg-black 
                    bg-opacity-60 z-50 flex items-center justify-center">
                    <div className="bg-white p-4 rounded-md relative 
                    w-[90%] md:w-[70%] lg:w-[60%] xl:w-[50%] 2xl:w-[40%]">
                        <Form />
                        <div
                            onClick={() => setOpen(false)}
                            className="absolute top-4 right-4 cursor-pointer">
                            <Image src="/close.png"
                                alt=""
                                width={14}
                                height={14}
                            />
                        </div>
                    </div>
                </div>}
        </div >
    )
}

export default FormModal