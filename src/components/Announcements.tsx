import prisma from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"
import { Prisma } from "@prisma/client"

const Announcements = async () => {

    const { sessionClaims, userId } = await auth()
    const role = (sessionClaims?.metadata as { role: string })?.role

    const roleConditions = {
        teacher: { supervisorId: userId },
        student: { Students: { some: { id: userId } } },
        parent: { Students: { some: { parentId: userId } } }
    } as Record<typeof role, Prisma.ClassWhereInput>

    const data = await prisma.announcement.findMany({
        take: 3,
        orderBy: { date: "desc" },
        where: {
            ...(role !== "admin" && {
                OR: [{ classId: null }, { Class: roleConditions[role] }]
            })
        }
    })
    return (
        <div className="bg-white p-4 rounded-md">
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-semibold">{data.length ? 'Announcements' : 'No Announcements'}</h1>
                <span className="text-sm text-gray-400">{data.length ? 'View All' : ''}</span>

            </div>
            {
                data.map(item => (
                    <div key={item.id} className="flex flex-col gap-4 mt-4 even:bg-ProskyLight">
                        <div className="rounded-md p-4">
                            <div className="flex items-center justify-between">
                                <h2 className="font-medium">{item?.title || "No Title"}</h2>
                                <span
                                    className="text-xs text-gray-400 bg-white rounded-md px-1 py-1">
                                    {new Intl.DateTimeFormat('en-US').format(item.date)}
                                </span>
                            </div>
                            <p className="text-sm text-gray-400 mt-1">
                                {item.description}
                            </p>
                        </div>
                    </div>
                ))
            }
        </div>
    )
}

export default Announcements