import FormContainer from "@/components/FormContainer"
import Pagination from "@/components/Pagination"
import Table from "@/components/Table"
import TableSearch from "@/components/TableSearch"
import prisma from "@/lib/prisma"
import { ITEM_PER_PAGE } from "@/lib/settings"
import { auth } from "@clerk/nextjs/server"
import { Class, Exam, Prisma, Subject, Teacher } from "@prisma/client"
import Image from "next/image"

type ExamList = Exam & {
    Lesson: {
        Subject: Subject,
        Class: Class,
        Teacher: Teacher,
    }
}


const ExamListPage = async ({ searchParams }: { searchParams: { [key: string]: string | undefined } }) => {

    const { sessionClaims, userId: currentUserId } = await auth()
    const role = (sessionClaims?.metadata as { role: string })?.role

    const { page, ...queryParams } = searchParams
    const p = page ? Number(page) : 1

    const query: Prisma.ExamWhereInput = {}

    query.Lesson = {}

    if (queryParams) {
        for (const [key, value] of Object.entries(queryParams)) {
            if (value != undefined)
                switch (key) {
                    case "classId":
                        query.Lesson.classId = Number(value)
                        break;
                    case "teacherId":
                        query.Lesson.teacherId = value
                        break;
                    case "search":
                        query.Lesson.OR = [
                            { Subject: { name: { contains: value, mode: "insensitive" } } },
                            { Teacher: { name: { contains: value, mode: "insensitive" } } },
                        ]
                        break;
                    default:
                        break;
                }
        }
    }

    // ROLE CONDITIONS

    switch (role) {
        case "admin":
            break;
        case "teacher":
            query.Lesson.teacherId = currentUserId
            break;
        case "student":
            query.Lesson.Class = { Students: { some: { id: currentUserId! } } }
            break;
        case "parent":
            query.Lesson.Class = { Students: { some: { parentId: currentUserId } } }
            break;
        default:
            break;
    }

    const [data, count] = await prisma.$transaction([
        prisma.exam.findMany({
            where: query,
            include: {
                Lesson: {
                    include: {
                        Subject: { select: { name: true } },
                        Teacher: { select: { name: true, surname: true } },
                        Class: { select: { name: true } }
                    }
                },

            },
            take: ITEM_PER_PAGE,
            skip: (p - 1) * ITEM_PER_PAGE,
        }),
        prisma.exam.count({ where: query })
    ])

    const columns = [
        {
            header: "Subject Name",
            accessor: "name"
        },
        {
            header: "Class",
            accessor: "class",
            className: "hidden md:table-cell"
        },
        {
            header: "Teacher",
            accessor: "teacher",
            className: "hidden md:table-cell"
        },
        {
            header: "Date",
            accessor: "date",
            className: "hidden md:table-cell"
        },
        ...(role === "admin" || role === "teacher" ? [{
            header: "Actions", accessor: "actions"
        }] : [])
    ]

    const renderRow = (item: ExamList) => (
        <tr key={item.id}
            className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-PropurpleLight">

            <td className="flex items-center gap-4 p-4">{item.Lesson.Subject.name}</td>

            <td >{item.Lesson.Class.name}</td>

            <td className="hidden md:table-cell">{item.Lesson.Teacher.name + "  " + item.Lesson.Teacher.surname}</td>

            <td className="hidden md:table-cell">{new Intl.DateTimeFormat('en-US').format(new Date(item.startTime))}</td>

            <td className="flex items-center gap-2">
                {(role === "admin" || role === "teacher") &&
                    <>
                        <FormContainer table="exam" type="update" data={item} />
                        <FormContainer table="exam" type="delete" id={item.id} />
                    </>

                }
            </td>
        </tr>
    )



    return (
        <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0 h-full">

            {/* TOP */}
            <div className="flex items-center justify-between">
                <h1 className="hidden md:block text-lg font-semibold">All Exams</h1>
                <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                    <TableSearch />
                    <div className="flex items-center gap-4 self-end">
                        <button className="w-8 h-8 flex items-center justify-center rounded-full
                        bg-ProYellow">
                            <Image src='/filter.png' alt="" width={14} height={14} />
                        </button>
                        <button className="w-8 h-8 flex items-center justify-center rounded-full
                        bg-ProYellow">
                            <Image src='/sort.png' alt="" width={14} height={14} />
                        </button>
                        {role === "admin" || role === "teacher" &&
                            <FormContainer table="exam" type="create" />
                        }
                    </div>
                </div>
            </div>

            {/* LIST */}
            <div className="">
                <Table columns={columns} renderRow={renderRow} data={data} />
            </div>

            {/* PAGINATION */}
            <div className="">
                <Pagination page={p} count={count} />
            </div>
        </div>
    )
}

export default ExamListPage