'use client'
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const data = [
    {
        name: 'Mon',
        present: 4000,
        absent: 2400,
    },
    {
        name: 'Tue',
        present: 3000,
        absent: 1398,
    },
    {
        name: 'Wed',
        present: 2000,
        absent: 9800,
    },
    {
        name: 'Thu',
        present: 2780,
        absent: 3908,
    },
    {
        name: 'Fri',
        present: 1890,
        absent: 4800,
    }
];


function AttendenceChart({ data }: { data: { name: string, present: number, absent: number }[] }) {
    return (

        <ResponsiveContainer width="100%" height="90%">
            <BarChart
                width={500}
                height={300}
                data={data}
                barSize={20}
            >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ddd" />
                <XAxis dataKey="name" axisLine={false} tick={{ fill: '#d1d5db' }} tickLine={false} />
                <YAxis axisLine={false} tick={{ fill: '#d1d5db' }} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: '10px', borderColor: 'lightgray' }} />
                <Legend align="left" verticalAlign="top" wrapperStyle={{ paddingTop: '20px', paddingBottom: '40px' }} />
                <Bar radius={[10, 10, 0, 0]} legendType="circle" dataKey="present" fill="#FAE27C" />
                <Bar radius={[10, 10, 0, 0]} legendType="circle" dataKey="absent" fill="#C3EBFA" />
            </BarChart>
        </ResponsiveContainer>
    )
}

export default AttendenceChart