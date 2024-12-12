'use server'

import { auth, clerkClient } from "@clerk/nextjs/server"
import { ClassSchema, ExamSchema, StudentSchema, SubjectSchema, TeacherSchema } from "./formValidationSchema"
import prisma from "./prisma"

export const createSubject = async (prevState: { success: boolean, error: boolean }, data: SubjectSchema) => {
    try {
        await prisma.subject.create({
            data: {
                name: data.name,
                Teachers: {
                    connect: data.teachers.map(id => ({ id }))
                }
            }
        })
        return { success: true, error: false }
    } catch (error) {
        console.log(error)
        return { success: false, error: true }
    }
}
export const updateSubject = async (prevState: { success: boolean, error: boolean }, data: SubjectSchema) => {
    console.log("update subject", data)
    try {
        await prisma.subject.update({
            where: { id: data.id },
            data: {
                name: data.name,
                Teachers: {
                    set: data.teachers.map(id => ({ id }))
                }
            }
        })
        return { success: true, error: false }
    } catch (error) {
        console.log(error)
        return { success: false, error: true }
    }
}
export const deleteSubject = async (prevState: { success: boolean, error: boolean }, id: string | number) => {
    try {
        await prisma.subject.delete({ where: { id: Number(id) } })
        return { success: true, error: false }
    } catch (error) {
        console.log(error)
        return { success: false, error: true }
    }
}

export const createClass = async (prevState: { success: boolean, error: boolean }, data: ClassSchema) => {
    try {
        await prisma.class.create({
            data
        })
        return { success: true, error: false }
    } catch (error) {
        console.log(error)
        return { success: false, error: true }
    }
}
export const updateClass = async (prevState: { success: boolean, error: boolean }, data: ClassSchema) => {
    console.log("update subject", data)
    try {
        await prisma.class.update({
            where: { id: data.id },
            data: {
                capacity: data.capacity,
                name: data.name,
                gradeId: data.gradeId,
                supervisorId: data.supervisorId
            }
        })
        return { success: true, error: false }
    } catch (error) {
        console.log(error)
        return { success: false, error: true }
    }
}
export const deleteClass = async (prevState: { success: boolean, error: boolean }, id: string | number) => {
    try {
        await prisma.class.delete({ where: { id: Number(id) } })
        return { success: true, error: false }
    } catch (error) {
        console.log(error)
        return { success: false, error: true }
    }
}

export const createTeacher = async (prevState: { success: boolean, error: boolean }, data: TeacherSchema) => {
    try {

        const user = await (await clerkClient()).users.createUser({
            username: data.username,
            password: data.password,
            firstName: data.name,
            lastName: data.surname,
            publicMetadata: { role: 'teacher' }

        })
        await prisma.teacher.create({
            data: {
                id: user.id,
                username: data.username,
                name: data.name,
                surname: data.surname,
                email: data.email,
                phone: data.phone,
                address: data.address,
                bloodType: data.bloodType,
                birthday: data.birthday,
                sex: data.sex,
                img: data.img,
                subjects: {
                    connect: data.subjects?.map(id => ({ id }))
                }
            }
        })
        return { success: true, error: false }
    } catch (error) {
        console.log(error)
        return { success: false, error: true }
    }
}
export const updateTeacher = async (prevState: { success: boolean, error: boolean }, data: TeacherSchema) => {
    try {

        if (!data.id) return { success: false, error: true }
        const user = await (await clerkClient()).users.updateUser(data.id, {
            username: data.username,
            ...(data.password !== '' && { password: data.password }),
            firstName: data.name,
            lastName: data.surname,
            publicMetadata: { role: 'teacher' }

        })
        await prisma.teacher.update({
            where: { id: data.id },
            data: {
                username: data.username,
                name: data.name,
                surname: data.surname,
                email: data.email,
                phone: data.phone,
                address: data.address,
                bloodType: data.bloodType,
                birthday: data.birthday,
                sex: data.sex,
                img: data.img,
                subjects: {
                    set: data.subjects?.map(id => ({ id }))
                }
            }
        })
        return { success: true, error: false }
    } catch (error) {
        console.log(error)
        return { success: false, error: true }
    }
}
export const deleteTeacher = async (prevState: { success: boolean, error: boolean }, id: string) => {
    try {
        await (await clerkClient()).users.deleteUser(id)
        await prisma.teacher.delete({ where: { id: id } })
        return { success: true, error: false }
    } catch (error) {
        console.log(error)
        return { success: false, error: true }
    }
}

export const createStudent = async (prevState: { success: boolean, error: boolean }, data: StudentSchema) => {
    try {

        console.log(data)

        const classItem = await prisma.class.findUnique({
            where: {
                id: data.classId
            },
            include: { _count: { select: { Students: true } } }
        })

        if (classItem && classItem.capacity === classItem._count.Students)
            return { success: false, error: true }

        const user = await (await clerkClient()).users.createUser({
            username: data.username,
            password: data.password,
            firstName: data.name,
            lastName: data.surname,
            publicMetadata: { role: 'student' }

        })
        await prisma.student.create({
            data: {
                id: user.id,
                username: data.username,
                name: data.name,
                surname: data.surname,
                email: data.email,
                phone: data.phone,
                address: data.address,
                bloodType: data.bloodType,
                birthday: data.birthday,
                sex: data.sex,
                img: data.img,
                gradeId: data.gradeId,
                classId: data.classId,
                parentId: data.parentId,
            }
        })
        return { success: true, error: false }
    } catch (error) {
        console.log(error)
        return { success: false, error: true }
    }
}
export const updateStudent = async (prevState: { success: boolean, error: boolean }, data: StudentSchema) => {
    try {

        if (!data.id) return { success: false, error: true }
        const user = await (await clerkClient()).users.updateUser(data.id, {
            username: data.username,
            ...(data.password !== '' && { password: data.password }),
            firstName: data.name,
            lastName: data.surname,
            publicMetadata: { role: 'student' }

        })
        await prisma.student.update({
            where: { id: data.id },
            data: {
                username: data.username,
                name: data.name,
                surname: data.surname,
                email: data.email,
                phone: data.phone,
                address: data.address,
                bloodType: data.bloodType,
                birthday: data.birthday,
                sex: data.sex,
                img: data.img,
                gradeId: data.gradeId,
                classId: data.classId,
                parentId: data.parentId,

            }
        })
        return { success: true, error: false }
    } catch (error) {
        console.log(error)
        return { success: false, error: true }
    }
}
export const deleteStudent = async (prevState: { success: boolean, error: boolean }, id: string) => {
    try {
        await (await clerkClient()).users.deleteUser(id)
        await prisma.student.delete({ where: { id: id } })
        return { success: true, error: false }
    } catch (error) {
        console.log(error)
        return { success: false, error: true }
    }
}

export const createExam = async (prevState: { success: boolean, error: boolean }, data: ExamSchema) => {
    try {
        const { sessionClaims, userId } = await auth()
        const role = (sessionClaims?.metadata as { role: string })?.role

        if (role === "teacher") {
            const teacherLesson = await prisma.lesson.findFirst({
                where: {
                    teacherId: userId,
                    id: data.lessonId
                }
            })
            if (!teacherLesson) return { success: false, error: true }
        }

        await prisma.exam.create({ data })
        return { success: true, error: false }
    } catch (error) {
        console.log(error)
        return { success: false, error: true }
    }
}
export const updateExam = async (prevState: { success: boolean, error: boolean }, data: ExamSchema) => {
    try {
        const { sessionClaims, userId } = await auth()
        const role = (sessionClaims?.metadata as { role: string })?.role

        if (role === "teacher") {
            const teacherLesson = await prisma.lesson.findFirst({
                where: {
                    teacherId: userId,
                    id: data.lessonId
                }
            })
            if (!teacherLesson) return { success: false, error: true }
        }

        await prisma.exam.update({ where: { id: data.id }, data })
        return { success: true, error: false }
    } catch (error) {
        console.log(error)
        return { success: false, error: true }
    }
}
export const deleteExam = async (prevState: { success: boolean, error: boolean }, id: string | number) => {
    const { sessionClaims, userId } = await auth()
    const role = (sessionClaims?.metadata as { role: string })?.role
    try {
        await prisma.exam.delete({
            where: {
                id: Number(id),
                ...(role === "teacher" ? { Lesson: { teacherId: userId } } : {})

            }
        })
        return { success: true, error: false }
    } catch (error) {
        console.log(error)
        return { success: false, error: true }
    }
}