import FormModal from "@/components/FormModal"
import Pagination from "@/components/Pagination"
import Table from "@/components/Table"
import TableSearch from "@/components/TableSearch"
import prisma from "@/lib/prisma"
import { ITEM_PER_PAGE } from "@/lib/settings"
import { auth } from "@clerk/nextjs/server"
import { Class, Event, Prisma } from "@prisma/client"
import Image from "next/image"

type EventList = Event & { Class: Class }


const EventListPage = async ({ searchParams }: { searchParams: { [key: string]: string | undefined } }) => {

    const { sessionClaims, userId: currentUserId } = await auth()
    const role = (sessionClaims?.metadata as { role: string })?.role


    const { page, ...queryParams } = searchParams
    const p = page ? Number(page) : 1

    const query: Prisma.EventWhereInput = {}

    if (queryParams) {
        for (const [key, value] of Object.entries(queryParams)) {
            if (value != undefined)
                switch (key) {
                    case "search":
                        query.title = { contains: value, mode: "insensitive" }
                        break;
                    default:
                        break;
                }
        }
    }

    const [data, count] = await prisma.$transaction([
        prisma.event.findMany({
            where: query,
            include: {
                Class: {
                    include: { Lessons: true }
                }

            },
            take: ITEM_PER_PAGE,
            skip: (p - 1) * ITEM_PER_PAGE,
        }),
        prisma.event.count({ where: query })
    ])

    //ROLE CONDITIONS

    const roleConditions = {
        teacher: { Lessons: { some: { teacherId: currentUserId } } } as Prisma.ClassWhereInput,
        student: { Students: { some: { id: currentUserId } } } as Prisma.ClassWhereInput,
        parent: { Students: { some: { parentId: currentUserId } } } as Prisma.ClassWhereInput,
    }

    query.OR = [
        { classId: null },
        { Class: roleConditions[role as keyof typeof roleConditions] }
    ]

    const columns = [
        {
            header: "Title",
            accessor: "title"
        },
        {
            header: "Class",
            accessor: "class",
        },
        {
            header: "Date",
            accessor: "date",
            className: "hidden md:table-cell"
        },
        {
            header: "Start Time",
            accessor: "startTime",
            className: "hidden md:table-cell"
        },
        {
            header: "End Time",
            accessor: "endTime",
            className: "hidden md:table-cell"
        },
        ...(role === "admin" ? [{
            header: "Actions", accessor: "actions"
        }] : [])
    ]
    const renderRow = (item: EventList) => (
        <tr key={item.id}
            className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-PropurpleLight">

            <td className="flex items-center gap-4 p-4">{item.title}</td>

            <td>{item.Class?.name || "-"}</td>

            <td className="hidden md:table-cell">{new Intl.DateTimeFormat('en-US').format(new Date(item.startTime))}</td>

            <td className="hidden md:table-cell">{item.startTime.toLocaleDateString('en-US', {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false
            })}</td>

            <td className="hidden md:table-cell">{item.endTime.toLocaleDateString('en-US', {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false
            })}</td>

            <td className="flex items-center gap-2">
                {role === "admin" &&
                    <>
                        <FormModal table="event" type="update" data={item} />
                        <FormModal table="event" type="delete" id={item.id} />
                    </>
                }
            </td>
        </tr>
    )


    return (
        <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0 h-full">

            {/* TOP */}
            <div className="flex items-center justify-between">
                <h1 className="hidden md:block text-lg font-semibold">All Events</h1>
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
                            <FormModal table="parent" type="create" />
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

export default EventListPage