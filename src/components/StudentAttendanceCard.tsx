import prisma from "@/lib/prisma"

const StudentAttendanceCard = async ({ id }: { id: string }) => {

    const attendance = await prisma.attendance.findMany({
        where: {
            studentId: id,
            date: {
                gte: new Date(new Date().getFullYear(), 0, 1)
            }
        }
    })
    const totalDays = attendance.length
    const presentDays = attendance.filter(item => item.present).length
    const percetage = (presentDays / totalDays) * 100
    return (
        <div>
            <h1 className="text-xl font-semibold">{percetage}%</h1>
            <span className="text-sm text-gray-400">Attendances</span>
        </div>
    )
}

export default StudentAttendanceCard