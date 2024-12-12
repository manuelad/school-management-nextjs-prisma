import FormContainer from "@/components/FormContainer"
import Pagination from "@/components/Pagination"
import Table from "@/components/Table"
import TableSearch from "@/components/TableSearch"
import prisma from "@/lib/prisma"
import { ITEM_PER_PAGE } from "@/lib/settings"
import { auth } from "@clerk/nextjs/server"
import { Announcement, Class, Grade, Lesson, Prisma, Student, Teacher } from "@prisma/client"
import Image from "next/image"
import Link from "next/link"

type ListClass = Class &
{
    Lessons: Lesson[],
    Students: Student[],
    Grade: Grade,
    Events: Event[],
    Announcements: Announcement[],
    supervisor: Teacher
}



const ClassListPage = async ({ searchParams }: { searchParams: { [key: string]: string | undefined } }) => {

    const { sessionClaims } = await auth()
    const role = (sessionClaims?.metadata as { role: string })?.role

    const { page, ...queryParams } = searchParams
    const p = page ? Number(page) : 1

    const query: Prisma.ClassWhereInput = {}

    if (queryParams) {
        for (const [key, value] of Object.entries(queryParams)) {
            if (value != undefined)
                switch (key) {
                    case "supervisorId":
                        query.supervisorId = value
                        break;
                    case "search":
                        query.name = { contains: value, mode: "insensitive" }

                    default:
                        break;
                }
        }
    }

    const [data, count] = await prisma.$transaction([
        prisma.class.findMany({
            where: query,
            include: {
                supervisor: true,
                Grade: true
            },
            take: ITEM_PER_PAGE,
            skip: (p - 1) * ITEM_PER_PAGE,
        }),
        prisma.class.count({ where: query })
    ])

    // ROLE CONDITIONS

    const columns = [
        {
            header: "Class Name",
            accessor: "name"
        },
        {
            header: "Capacity",
            accessor: "capacity",
            className: "hidden md:table-cell"
        },
        {
            header: "Grade",
            accessor: "grade",
            className: "hidden md:table-cell"
        },
        {
            header: "Supervisor",
            accessor: "supervisor",
            className: "hidden md:table-cell"
        },
        ...(role === "admin" ? [{
            header: "Actions", accessor: "actions"
        }] : [])
    ]
    const renderRow = (item: ListClass) => (
        <tr key={item.id}
            className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-PropurpleLight">
            <td className="flex items-center gap-4 p-4">
                {item.name}
            </td>

            <td className="hidden md:table-cell">
                {item.capacity}
            </td>
            <td className="hidden md:table-cell">
                {item.Grade.level}
            </td>
            <td className="hidden md:table-cell">
                {item.supervisor.name}
            </td>
            <td className="flex items-center gap-2">
                <Link href={`/list/classes/${item.id}`}>
                    <button className="w-7 h-7 flex items-center justify-center rounded-full bg-ProSky">
                        <Image src='/view.png' alt="" width={16} height={16} />
                    </button>
                </Link>
                {role === "admin" &&
                    <>
                        <FormContainer table="class" type="update" data={item} />
                        <FormContainer table="class" type="delete" id={item.id} />
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
                        {role === "admin" &&
                            <FormContainer table="class" type="create" />
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

export default ClassListPage