import Announcements from "@/components/Announcements";
import BigCalendarContainer from "@/components/BigCalendarContainer";
import EventCalendar from "@/components/EventCalendar";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

async function StudentPage() {
    const { userId } = await auth();
    const dataClass = await prisma.class.findMany({ where: { Students: { some: { id: userId! } } } })
    return (
        <div className="p-4 flex gap-4 flex-col md:flex-row">
            {/* LEFT */}
            <div className="w-full xl:w-2/3">
                <div className="h-full bg-white p-4 rounded-md">
                    <h1 className="text-xl font-semibold">Schedule (4A)</h1>
                    <BigCalendarContainer type="classId" id={dataClass[0].id} />
                </div>
            </div>
            {/* RIGHT */}
            <div className="w-full xl:w-1/3 fles flex-col gap-8">
                <EventCalendar />
                <Announcements />
            </div>
        </div>
    )
}

export default StudentPage