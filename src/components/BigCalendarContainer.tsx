import prisma from "@/lib/prisma"
import { adjustScheduleToCurrentWeek } from "@/lib/utils"
import BigCalendar from "./BigCalendar"

const BigCalendarContainer = async ({ type, id }: { type: "teacherId" | "classId", id: any }) => {

    const dataRes = await prisma.lesson.findMany({
        where: {
            ...(type === 'teacherId' ? { teacherId: id } : { classId: id })
        }
    })

    const data = dataRes.map(lesson => ({
        title: lesson.name,
        start: lesson.startTime,
        end: lesson.endTime
    }))

    const schedule = adjustScheduleToCurrentWeek(data)

    return (
        <div><BigCalendar data={schedule} /></div>
    )


}

export default BigCalendarContainer