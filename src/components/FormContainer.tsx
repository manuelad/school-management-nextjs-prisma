import prisma from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"
import FormModal from "./FormModal"

export interface FormContainerProps {
    table: "teacher" | "student" | "parent" | "subject" | "class" | "result" | "event" | "announcement" | "lesson" | "attendance" | "assignment" | "exam"
    type: "create" | "update" | "delete"
    data?: any
    id?: any
}
const FormContainer = async ({ table, type, data, id }: FormContainerProps) => {

    let relatedData = {}
    if (type !== "delete") {
        switch (table) {
            case "subject":
                const subjectTeachers = await prisma.teacher.findMany({
                    select: { id: true, name: true, surname: true },
                })
                relatedData = { Teachers: subjectTeachers }

                break;

            case "class":
                const classGrades = await prisma.grade.findMany({
                    select: { id: true, level: true },
                })
                const classTeachers = await prisma.teacher.findMany({
                    select: { id: true, name: true, surname: true },
                })
                relatedData = { grades: classGrades, teachers: classTeachers }

                break;

            case "teacher":
                const teacherSubjects = await prisma.subject.findMany({
                    select: { id: true, name: true },
                })

                relatedData = { subjects: teacherSubjects }

                break;
            case "student":
                const studentGrades = await prisma.grade.findMany({
                    select: { id: true, level: true },
                })
                const studentClasses = await prisma.class.findMany({
                    include: { _count: { select: { Students: true } } }
                })

                const studentsParents = await prisma.parent.findMany({
                    select: { id: true, name: true, surname: true },
                })

                relatedData = { grades: studentGrades, classes: studentClasses, parents: studentsParents }

                break;
            case "exam":

                const { sessionClaims, userId } = await auth()
                const role = (sessionClaims?.metadata as { role: string })?.role

                const examLessons = await prisma.lesson.findMany({
                    where: {
                        ...(role === "teacher" ? { teacherId: userId } : {})
                    },
                    select: { id: true, name: true }
                })

                relatedData = { lessons: examLessons }

                break;

            default:
                break;
        }
    }
    return (
        <div><FormModal table={table} type={type} data={data} id={id} relatedData={relatedData} /></div>
    )
}

export default FormContainer