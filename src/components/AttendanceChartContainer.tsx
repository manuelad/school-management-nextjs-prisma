import prisma from "@/lib/prisma"
import Image from "next/image"
import AttendenceChart from "./AttendenceChart"

const AttendanceChartContainer = async () => {

    const today = new Date()
    const dayOfWeek = today.getDay()
    const daysSinceMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1
    const lastMonday = new Date(today)
    lastMonday.setDate(today.getDate() - daysSinceMonday)

    const resData = await prisma.attendance.findMany({
        where: {
            date: {
                gte: lastMonday
            }
        },
        select: {
            date: true,
            present: true
        }
    })
    // console.log(data)
    const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri"]
    const attendandeMap: { [day: string]: { present: number, absent: number } } = {
        Mon: { present: 0, absent: 0 },
        Tue: { present: 0, absent: 0 },
        Wed: { present: 0, absent: 0 },
        Thu: { present: 0, absent: 0 },
        Fri: { present: 0, absent: 0 },
    }
    resData.forEach(item => {
        const itemDate = new Date(item.date)
        const dayOfWeek = itemDate.getDay()
        if (dayOfWeek >= 1 && dayOfWeek <= 5) {
            const dayName = daysOfWeek[dayOfWeek - 1]
            if (item.present)
                attendandeMap[dayName].present++
            else
                attendandeMap[dayName].absent++
        }
    })
    const data = daysOfWeek.map(day => ({
        name: day,
        present: attendandeMap[day].present,
        absent: attendandeMap[day].absent
    }))
    return (
        <div className="bg-white rounded-lg p-4 h-full">
            <div className="flex justify-between items-center">
                <h1 className="text-lg font-semibold">Attendance</h1>
                <Image src='/moreDark.png' alt="" width={20} height={20} />
            </div>
            <AttendenceChart data={data} />
        </div>
    )
}

export default AttendanceChartContainer