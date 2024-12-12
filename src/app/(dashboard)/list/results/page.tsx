import FormModal from "@/components/FormModal"
import Pagination from "@/components/Pagination"
import Table from "@/components/Table"
import TableSearch from "@/components/TableSearch"
import prisma from "@/lib/prisma"
import { ITEM_PER_PAGE } from "@/lib/settings"
import { auth } from "@clerk/nextjs/server"
import { Prisma } from "@prisma/client"
import Image from "next/image"

type ResultList = {
    id: number,
    title: string,
    studentName: string,
    studentSurName: string,
    teacherName: string,
    teacherSurName: string,
    score: number,
    className: string,
    startTime: Date,
}


const ResultListPage = async ({ searchParams }: { searchParams: { [key: string]: string | undefined } }) => {

    const { sessionClaims, userId: currentUserId } = await auth()
    const role = (sessionClaims?.metadata as { role: string })?.role

    const { page, ...queryParams } = searchParams
    const p = page ? Number(page) : 1

    const query: Prisma.ResultWhereInput = {}

    if (queryParams) {
        for (const [key, value] of Object.entries(queryParams)) {
            if (value != undefined)
                switch (key) {
                    case "studentId":
                        query.studentId = value
                        break;
                    case "search":
                        query.OR = [
                            { Exam: { title: { contains: value, mode: "insensitive" } } },
                            { Student: { name: { contains: value, mode: "insensitive" } } },
                        ]
                        break;
                    default:
                        break;
                }
        }
    }

    // ROLE CONDITONS
    switch (role) {
        case "admin":
            break;
        case "teacher":
            query.OR = [
                { Exam: { Lesson: { teacherId: currentUserId } } },
                { Assignment: { Lesson: { teacherId: currentUserId } } },
            ]
            break;
        case "student":
            query.studentId = currentUserId
            break;

        case "parent":
            query.Student = { parentId: currentUserId }
            break;
        default:
            break;
    }

    const [dataRes, count] = await prisma.$transaction([
        prisma.result.findMany({
            where: query,
            include: {
                Student: { select: { name: true, surname: true } },
                Exam: {
                    include: {
                        Lesson: {
                            select: {
                                Teacher: true,
                                Class: true
                            }
                        }
                    }
                },
                Assignment: {
                    include: {
                        Lesson: {
                            select: {
                                Teacher: true,
                                Class: true
                            }
                        }
                    }
                }

            },
            take: ITEM_PER_PAGE,
            skip: (p - 1) * ITEM_PER_PAGE,
        }),
        prisma.result.count({ where: query })
    ])

    const data = dataRes.map(item => {
        const assessment = item.Exam || item.Assignment
        if (!assessment) return null
        const isExam = "startTime" in assessment
        return {
            id: item.id,
            title: assessment.title,
            studentName: item.Student!!.name,
            studentSurName: item.Student!!.surname,
            teacherName: assessment.Lesson.Teacher!!.name,
            teacherSurName: assessment.Lesson.Teacher!!.surname,
            score: item.score,
            className: assessment.Lesson.Class!!.name,
            startTime: isExam ? assessment.startTime : assessment.startDate,
        }
    })

    const columns = [
        {
            header: "Title",
            accessor: "title"
        },
        {
            header: "Student",
            accessor: "student",
        },
        {
            header: "Score",
            accessor: "score",
            className: "hidden md:table-cell"
        },
        {
            header: "Teacher",
            accessor: "teacher",
            className: "hidden md:table-cell"
        },
        {
            header: "Class",
            accessor: "class",
            className: "hidden md:table-cell"
        },
        {
            header: "Date",
            accessor: "date",
            className: "hidden md:table-cell"
        },
        ...((role === "admin" || role === "teacher") ? [{
            header: "Actions", accessor: "actions"
        }] : [])
    ]

    const renderRow = (item: ResultList) => (
        <tr key={item.id}
            className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-PropurpleLight">

            <td className="flex items-center gap-4 p-4">{item.title}</td>

            <td>{item.studentName + " " + item.studentSurName}</td>

            <td className="hidden md:table-cell">{item.score}</td>

            <td className="hidden md:table-cell">{item.teacherName + " " + item.teacherSurName}</td>

            <td className="hidden md:table-cell">{item.className}</td>


            <td className="hidden md:table-cell">{new Intl.DateTimeFormat('en-US').format(item.startTime)}</td>

            <td className="flex items-center gap-2">
                {(role === "admin" || role === "teacher") &&
                    <>
                        <FormModal table="result" type="update" data={item} />
                        <FormModal table="result" type="delete" id={item.id} />
                    </>
                }
            </td>
        </tr>
    )

    return (
        <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0 h-full">

            {/* TOP */}
            <div className="flex items-center justify-between">
                <h1 className="hidden md:block text-lg font-semibold">All Results</h1>
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
                        {(role === "admin" || role === "teacher") &&
                            <FormModal table="result" type="create" />

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

export default ResultListPage