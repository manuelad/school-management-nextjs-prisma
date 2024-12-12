import FormContainer from "@/components/FormContainer"
import Pagination from "@/components/Pagination"
import Table from "@/components/Table"
import TableSearch from "@/components/TableSearch"
import prisma from "@/lib/prisma"
import { ITEM_PER_PAGE } from "@/lib/settings"
import { auth } from "@clerk/nextjs/server"
import { Class, Prisma, Subject, Teacher } from "@prisma/client"
import Image from "next/image"
import Link from "next/link"

type TeacherList = Teacher & { subjects: Subject[] } & { Classes: Class[] }





const TeacherListPage = async ({ searchParams }: { searchParams: { [key: string]: string | undefined } }) => {

    const { sessionClaims } = await auth()
    const role = (sessionClaims?.metadata as { role: string })?.role

    const { page, ...queryParams } = searchParams
    const p = page ? Number(page) : 1

    const query: Prisma.TeacherWhereInput = {}

    if (queryParams) {
        for (const [key, value] of Object.entries(queryParams)) {
            if (value != undefined)
                switch (key) {
                    case "classId":
                        query.Lessons = { some: { classId: Number(value) } }
                        break;
                    case "search":
                        query.name = { contains: value, mode: "insensitive" }

                    default:
                        break;
                }
        }
    }

    const [data, count] = await prisma.$transaction([
        prisma.teacher.findMany({
            where: query,
            include: {
                subjects: true,
                Classes: true
            },
            take: ITEM_PER_PAGE,
            skip: (p - 1) * ITEM_PER_PAGE,
        }),
        prisma.teacher.count({ where: query })
    ])

    const columns = [
        {
            header: "info", accessor: "info"
        },
        {
            header: "Teacher Id",
            accessor: "teacherId",
            className: "hidden md:table-cell"
        },
        {
            header: "Subjects",
            accessor: "subjects",
            className: "hidden md:table-cell"
        },
        {
            header: "Classes",
            accessor: "Classes",
            className: "hidden md:table-cell"
        },
        {
            header: "Phone",
            accessor: "phone",
            className: "hidden lg:table-cell"
        },
        {
            header: "Address",
            accessor: "address",
            className: "hidden lg:table-cell"
        },
        ...(role === "admin" ?
            [{ header: "Actions", accessor: "actions" }] :
            [])
    ]

    const renderRow = (item: TeacherList) => (
        <tr key={item.id}
            className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-PropurpleLight">
            <td className="flex items-center gap-4 p-4">
                <Image
                    src={item.img || '/noAvatar.png'}
                    alt=""
                    width={40}
                    height={40}
                    className="md:hidden xl:block rounded-full w-10 h-10 object-cover" />
                <div className="flex flex-col">
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-xs text-gray-500">{item?.email}</p>
                </div>
            </td>
            <td className="hidden md:table-cell">{item.username}</td>
            <td className="hidden md:table-cell">{item.subjects.map(item => item.name).join(', ')}</td>
            <td className="hidden md:table-cell">{item.Classes.map(item => item.name).join(', ')}</td>
            <td className="hidden md:table-cell">{item.phone}</td>
            <td className="hidden md:table-cell">{item.address}</td>
            <td className="flex items-center gap-2">
                {/* <Link href={`/list/teachers/${item.id}`}>
                    <button className="w-8 h-8 flex items-center justify-center rounded-full bg-ProSky">
                        <Image src="/view.png" alt="" width={16} height={16} />
                    </button>
                </Link> */}
                {role === "admin" &&
                    <>
                        <Link href={`/list/teachers/${item.id}`}>
                            <button className="w-7 h-7 flex items-center justify-center rounded-full bg-ProSky">
                                <Image src="/edit.png" alt="" width={16} height={16} />
                            </button>
                        </Link>
                        <FormContainer table="teacher" type="delete" id={item.id} />
                    </>
                }
            </td>
        </tr>
    )



    return (
        <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0 h-full">

            {/* TOP */}
            <div className="flex items-center justify-between">
                <h1 className="hidden md:block text-lg font-semibold">All teachers</h1>
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
                            <FormContainer table="teacher" type="create" />
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

export default TeacherListPage