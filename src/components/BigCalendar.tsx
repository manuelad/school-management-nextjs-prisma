'use client'
import moment from 'moment'
import { useState } from 'react'
import { Calendar, momentLocalizer, View, Views } from 'react-big-calendar'
import "react-big-calendar/lib/css/react-big-calendar.css"

const localizer = momentLocalizer(moment)

const BigCalendar = ({ data }: { data: { title: string, start: Date, end: Date }[] }) => {

    const [view, setView] = useState<View>(Views.WORK_WEEK)
    const [date, setDate] = useState(new Date())

    const onChangeView = (view: View) => {
        setView(view)
    }
    return (
        <div>
            <Calendar
                localizer={localizer}
                events={data}
                startAccessor="start"
                endAccessor="end"
                views={['work_week', 'day']}
                view={view}
                date={date}
                onNavigate={(newDate) => setDate(newDate)}
                onView={onChangeView}
                style={{ height: '98%' }}
            // min={new Date(2024, 0, 1, 8, 0, 0)}
            // max={new Date(2025, 11, 31, 8, 0, 0)}
            />
        </div>
    )
}

export default BigCalendar