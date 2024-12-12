'use client'

import { createStudent, updateStudent } from "@/lib/actions";
import { studentSchema, StudentSchema } from "@/lib/formValidationSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useFormState } from "react-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import InputField from "../InputField";



const StudentForm = ({
    type,
    data,
    setOpen,
    relatedData
}: { type: 'create' | 'update', data?: any, setOpen: Dispatch<SetStateAction<boolean>>, relatedData?: any }) => {

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<StudentSchema>({
        resolver: zodResolver(studentSchema),
    });

    const [img, setImg] = useState<any>()

    const [state, formAction] = useFormState(type === 'create' ? createStudent : updateStudent, {
        success: false,
        error: false
    })

    const submit = handleSubmit(formData => {
        formAction({ ...formData, id: data?.id, img: img?.secure_url })
    })

    const router = useRouter()

    useEffect(() => {
        console.log("state", state)
        if (state.success) {
            toast(`student has been ${type === 'create' ? 'created' : 'updated'}`)
            setOpen(false)
            router.refresh()
        }
    }, [state])

    const { grades, classes, parents } = relatedData




    return (
        <form className="flex flex-col gap-8" onSubmit={submit}>
            <h1 className="text-xl font-semibold">{`${type === 'create' ? 'Create a new' : 'Update a '} Student`}</h1>
            <span className="text-sm text-gray-400 font-medium">Authentication Information</span>
            <div className="flex justify-between flex-wrap gap-4">
                <InputField
                    label="Username"
                    register={register}
                    name="username"
                    errors={errors.username}
                    defaultValue={data?.username} />

                <InputField
                    label="Email"
                    register={register}
                    name="email"
                    type="email"
                    errors={errors.email}
                    defaultValue={data?.email} />

                <InputField
                    label="Password"
                    register={register}
                    name="password"
                    type="password"
                    errors={errors.password}
                    defaultValue={data?.password} />
            </div>

            <span className="text-sm text-gray-400 font-medium">Personal Information</span>
            <CldUploadWidget
                onSuccess={(results, { widget }) => {
                    setImg(results.info)
                    widget.close()
                }}
                uploadPreset="school">
                {({ open }) => {
                    return (
                        <div className="flex flex-col gap-2">
                            <div
                                onClick={() => open()}
                                className="text-xs text-gray-500 flex items-center gap-2 cursor-pointer">
                                <Image src="/upload.png" alt="" width={25} height={28} />
                                <span>upload a photo</span>
                            </div>
                            {/* <Image src={img?.secure_url} alt="" width={100} height={50}
                                    className={`w-100 h-50 rounded-md object-cover ${img ? 'block' : 'hidden'}`}
                                /> */}
                        </div>
                    );
                }}
            </CldUploadWidget>
            <div className="flex justify-between flex-wrap gap-4">

                <InputField
                    label="Firts Name"
                    register={register}
                    name="name"
                    errors={errors.name}
                    defaultValue={data?.name} />

                <InputField
                    label="Last Name"
                    register={register}
                    name="surname"
                    errors={errors.surname}
                    defaultValue={data?.surname} />

                <InputField
                    label="Phone"
                    register={register}
                    name="phone"
                    errors={errors.phone}
                    defaultValue={data?.phone} />

                <InputField
                    label="Address"
                    register={register}
                    name="address"
                    errors={errors.address}
                    defaultValue={data?.address} />

                <InputField
                    label="Blood Type"
                    register={register}
                    name="bloodType"
                    errors={errors.bloodType}
                    defaultValue={data?.bloodType} />

                <InputField
                    label="Birthday"
                    register={register}
                    name="birthday"
                    errors={errors.birthday}
                    type="date"
                    defaultValue={(data?.birthday as Date)?.toISOString().split('T')[0]} />

                <div className="flex flex-col gap-2 w-full md:w-1/4">
                    <label className="text-xs text-gray-500">Parents</label>
                    <select
                        {...register('parentId')}
                        defaultValue={data?.grades}
                        className="ring-[2px] ring-gray-300 p-2 rounded-md text-sm w-full">
                        {
                            parents?.map((parent: { id: number, name: string, capacity: number, surname: string }) => (
                                <option key={parent.id} value={parent.id}>
                                    {parent.name} - {parent.surname}
                                </option>
                            ))
                        }

                    </select>
                    {errors.parentId?.message && <p className="text-xs text-red-400">{errors.parentId.message.toString()}</p>}
                </div>


                <div className="flex flex-col gap-2 w-full md:w-1/4">
                    <label className="text-xs text-gray-500">Sex</label>
                    <select
                        {...register('sex')}
                        defaultValue={data?.sex}
                        className="ring-[2px] ring-gray-300 p-2 rounded-md text-sm w-full">
                        <option value="MALE">Male</option>
                        <option value="FEMALE">Female</option>
                    </select>
                    {errors.sex?.message && <p className="text-xs text-red-400">{errors.sex.message.toString()}</p>}
                </div>
                <div className="flex flex-col gap-2 w-full md:w-1/4">
                    <label className="text-xs text-gray-500">Grades</label>
                    <select
                        {...register('gradeId')}
                        defaultValue={data?.subjects}
                        className="ring-[2px] ring-gray-300 p-2 rounded-md text-sm w-full">
                        {
                            grades?.map((grade: { id: number, level: number }) => (
                                <option key={grade.id} value={grade.id}>{grade.level}</option>
                            ))
                        }

                    </select>
                    {errors.gradeId?.message && <p className="text-xs text-red-400">{errors.gradeId.message.toString()}</p>}
                </div>
                <div className="flex flex-col gap-2 w-full md:w-1/4">
                    <label className="text-xs text-gray-500">Classes</label>
                    <select
                        {...register('classId')}
                        defaultValue={data?.grades}
                        className="ring-[2px] ring-gray-300 p-2 rounded-md text-sm w-full">
                        {
                            classes?.map((classItem: { id: number, name: string, capacity: number, _count: { Students: number } }) => (
                                <option key={classItem.id} value={classItem.id}>
                                    {classItem.name}-{classItem._count.Students + " / " + classItem.capacity}
                                    {" capacity"}
                                </option>
                            ))
                        }

                    </select>
                    {errors.classId?.message && <p className="text-xs text-red-400">{errors.classId.message.toString()}</p>}
                </div>
            </div>
            {state.error && <span className="text-red-500">Something went wrong</span>}
            <button className="bg-blue-400 text-white p-2 rounded-md">{type === 'create' ? 'Create' : 'Update'}</button>
        </form>
    )
}

export default StudentForm