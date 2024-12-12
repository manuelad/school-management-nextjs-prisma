import { z } from "zod";

export const subjectSchema = z.object({
    id: z.coerce.number().optional(),
    name: z.string().min(3, { message: 'name must be at least 3 characters long' }),
    teachers: z.array(z.string()),

});

export type SubjectSchema = z.infer<typeof subjectSchema>;

export const examSchema = z.object({
    id: z.coerce.number().optional(),
    title: z.string().min(1, { message: 'exam is required' }),
    startTime: z.coerce.date({ message: 'start time is required' }),
    endTime: z.coerce.date({ message: 'end time is required' }),
    lessonId: z.coerce.number({ message: 'lesson is required' }),

});

export type ExamSchema = z.infer<typeof examSchema>;

export const classSchema = z.object({
    id: z.coerce.number().optional(),
    name: z.string({ message: 'name is required' }),
    capacity: z.coerce.number().min(1, { message: 'capacity is required' }),
    gradeId: z.coerce.number().optional(),
    supervisorId: z.coerce.string().optional()
});

export type ClassSchema = z.infer<typeof classSchema>;

export const teacherSchema = z.object({
    id: z.coerce.string().optional(),
    username: z.string({ message: 'Username is required' }),
    email: z.string().email({ message: 'Invalid email address' }).optional().or(z.literal('')),
    name: z.string().min(3, { message: 'name is required' }),
    password: z.string().min(8, { message: 'Password must be at least 8 characters long' })
        .or(z.literal('')),
    surname: z.string().min(3, { message: 'surname is required' }),
    bloodType: z.string({ message: 'Blood type is required' }),
    phone: z.string().optional(),
    address: z.string(),
    birthday: z.coerce.date({ message: 'Birthday name is required' }),
    sex: z.enum(['MALE', 'FEMALE'], { message: 'Sex name is required' }),
    img: z.string().optional(),
    subjects: z.array(z.coerce.number()).optional(),
});

export type TeacherSchema = z.infer<typeof teacherSchema>

export const studentSchema = z.object({
    id: z.coerce.string().optional(),
    username: z.string().min(3, { message: 'Username must be at least 3 characters long' })
        .max(20, { message: 'Username must be at most 20 characters long' }),
    email: z.string().email({ message: 'Invalid email address' }).optional().or(z.literal('')),
    name: z.string().min(3, { message: 'name is required' }),
    password: z.string().min(8, { message: 'Password must be at least 8 characters long' })
        .or(z.literal('')),
    surname: z.string().min(1, { message: 'surname is required' }),
    bloodType: z.string({ message: 'Blood type is required' }),
    phone: z.string().optional(),
    address: z.string(),
    birthday: z.coerce.date({ message: 'Birthday name is required' }),
    sex: z.enum(['MALE', 'FEMALE'], { message: 'Sex name is required' }),
    img: z.string().optional(),
    gradeId: z.coerce.number({ message: 'Grade is required' }),
    classId: z.coerce.number({ message: 'class is required' }),
    parentId: z.coerce.string({ message: 'parent is required' }),
});
export type StudentSchema = z.infer<typeof studentSchema>