import FormModal from "@/components/FormModal"
import Pagination from "@/components/Pagination"
import Table from "@/components/Table"
import TableSearch from "@/components/TableSearch"
import prisma from "@/lib/prisma"
import { ITEM_PER_PAGE } from "@/lib/settings"
import { auth } from "@clerk/nextjs/server"
import { Class, Lesson, Prisma, Subject, Teacher } from "@prisma/client"
import Image from "next/image"

type LessonList = Lesson & { Teacher: Teacher, Subject: Subject, Class: Class }


const LessonListPage = async ({ searchParams }: { searchParams: { [key: string]: string | undefined } }) => {

    const { sessionClaims } = await auth()
    const role = (sessionClaims?.metadata as { role: string })?.role


    const { page, ...queryParams } = searchParams
    const p = page ? Number(page) : 1

    const query: Prisma.LessonWhereInput = {}

    if (queryParams) {
        for (const [key, value] of Object.entries(queryParams)) {
            if (value != undefined)
                switch (key) {
                    case "classId":
                        query.classId = Number(value)
                        break;
                    case "teacherId":
                        query.teacherId = value
                        break;
                    case "search":
                        query.OR = [
                            { Subject: { name: { contains: value, mode: "insensitive" } } },
                            { Teacher: { name: { contains: value, mode: "insensitive" } } },
                        ]

                    default:
                        break;
                }
        }
    }

    const [data, count] = await prisma.$transaction([
        prisma.lesson.findMany({
            where: query,
            include: {
                Class: { select: { name: true } },
                Subject: { select: { name: true } },
                Teacher: { select: { name: true, surname: true } },
            },
            take: ITEM_PER_PAGE,
            skip: (p - 1) * ITEM_PER_PAGE,
        }),
        prisma.lesson.count({ where: query })
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
        ...(role === "admin" ? [{
            header: "Actions", accessor: "actions"
        }] : [])
    ]

    const renderRow = (item: LessonList) => (
        <tr key={item.id}
            className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-PropurpleLight">
            <td className="flex items-center gap-4 p-4">
                {item.Subject.name}
            </td>

            <td >
                {item.Class.name}
            </td>
            <td className="hidden md:table-cell">
                {item.Teacher.name + "  " + item.Teacher.surname}
            </td>
            <td className="flex items-center gap-2">
                {role === "admin" &&
                    <>
                        <FormModal table="lesson" type="update" data={item} />
                        <FormModal table="lesson" type="delete" id={item.id} />
                    </>
                }
            </td>
        </tr>
    )



    return (
        <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0 h-full">

            {/* TOP */}
            <div className="flex items-center justify-between">
                <h1 className="hidden md:block text-lg font-semibold">All Classes</h1>
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
                        {role === "admin" &&
                            <FormModal table="lesson" type="create" />
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

export default LessonListPage