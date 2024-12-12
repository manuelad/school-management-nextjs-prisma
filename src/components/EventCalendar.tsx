
'use client'

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

const events = [
    { id: 1, title: "Event 1", time: "10:00", description: "This is an event" },
    { id: 2, title: "Event 2", time: "11:00", description: "This is another event" },
    { id: 3, title: "Event 3", time: "12:00", description: "This is a third event" },
    { id: 4, title: "Event 4", time: "13:00", description: "This is a fourth event" },
    { id: 5, title: "Event 5", time: "14:00", description: "This is a fifth event" },
    { id: 6, title: "Event 6", time: "15:00", description: "This is a sixth event" },
    { id: 7, title: "Event 7", time: "16:00", description: "This is a seventh event" },
    { id: 8, title: "Event 8", time: "17:00", description: "This is an eighth event" },
    { id: 9, title: "Event 9", time: "18:00", description: "This is a ninth event" },
    { id: 10, title: "Event 10", time: "19:00", description: "This is a tenth event" },
]


const EventCalendar = () => {

    const [value, onChange] = useState<Value>(new Date());
    const router = useRouter()

    useEffect(() => {
        if (value instanceof Date)
            router.push(`?date=${value}`)
    }, [value, router])

    return <Calendar onChange={onChange} value={value} />
}

export default EventCalendar