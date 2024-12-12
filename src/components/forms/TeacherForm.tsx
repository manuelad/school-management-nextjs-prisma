'use client'

import { createTeacher, updateTeacher } from "@/lib/actions";
import { teacherSchema, TeacherSchema } from "@/lib/formValidationSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { CldUploadWidget } from 'next-cloudinary';
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useFormState } from "react-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import InputField from "../InputField";


const TeacherForm = ({
    type,
    data,
    setOpen,
    relatedData
}: { type: 'create' | 'update', data?: any, setOpen: Dispatch<SetStateAction<boolean>>, relatedData?: any }) => {

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<TeacherSchema>({
        resolver: zodResolver(teacherSchema),
    });

    const [img, setImg] = useState<any>()

    const [state, formAction] = useFormState(type === 'create' ? createTeacher : updateTeacher, {
        success: false,
        error: false
    })

    const submit = handleSubmit(formData => {
        formAction({ ...formData, id: data?.id, img: img?.secure_url })
    })

    const router = useRouter()

    useEffect(() => {
        if (state.success) {
            toast(`teacher has been ${type === 'create' ? 'created' : 'updated'}`)
            setOpen(false)
            router.refresh()
        }
    }, [state])



    const { subjects } = relatedData




    return (
        <form className="flex flex-col gap-8" onSubmit={submit}>
            <h1 className="text-xl font-semibold">{`${type === 'create' ? 'Create a new' : 'Update a'} Teacher `}</h1>
            <span className="text-sm text-gray-400 font-medium">Authentication Information</span>
            <div className="flex justify-between flex-wrap gap-4">
                <InputField
                    label="Username"
                    register={register}
                    name="username"
                    errors={errors.username}
                    defaultValue={data?.username} />

                <InputField
                    label="email"
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
                    defaultValue={(data?.birthday as Date)?.toISOString().split('T')[0]}
                />


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
                    <label className="text-xs text-gray-500">Subjects</label>
                    <select
                        multiple
                        {...register('subjects')}
                        defaultValue={data?.subjects}
                        className="ring-[2px] ring-gray-300 p-2 rounded-md text-sm w-full">
                        {
                            subjects?.map((subject: { id: string, name: string }) => (
                                <option key={subject.id} value={subject.id}>{subject.name}</option>
                            ))
                        }

                    </select>
                    {errors.subjects?.message && <p className="text-xs text-red-400">{errors.subjects.message.toString()}</p>}
                </div>

                {/* <div className="flex flex-col gap-2 w-full md:w-1/4 justify-center">

                    <input type="file" id="img" {...register('img')} className="hidden" />
                    {errors.img?.message && <p className="text-xs text-red-400">{errors.img.message.toString()}</p>}
                </div> */}
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
            </div>
            {state.error && <span className="text-red-500">Something went wrong</span>}
            <button className="bg-blue-400 text-white p-2 rounded-md">{type === 'create' ? 'Create' : 'Update'}</button>
        </form>
    )
}

export default TeacherForm