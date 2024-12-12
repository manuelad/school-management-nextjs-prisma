
'use client'

import { createClass, updateClass } from "@/lib/actions";
import { ClassSchema, classSchema } from "@/lib/formValidationSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useEffect } from "react";
import { useFormState } from "react-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import InputField from "../InputField";



const ClassForm = ({
  type,
  data,
  setOpen,
  relatedData
}:
  { type: 'create' | 'update', data?: any, setOpen: Dispatch<SetStateAction<boolean>>, relatedData?: any }) => {

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ClassSchema>({
    resolver: zodResolver(classSchema),
  });

  const [state, formAction] = useFormState(type === 'create' ? createClass : updateClass, {
    success: false,
    error: false
  })

  const submit = handleSubmit(formData => {
    formAction({ ...formData, id: data?.id })
  })

  const router = useRouter()

  useEffect(() => {
    console.log("state", state)
    if (state.success) {
      toast(`class has been ${type === 'create' ? 'created' : 'updated'}`)
      setOpen(false)
      router.refresh()
    }
  }, [state])


  const { teachers, grades } = relatedData


  return (
    <form className="flex flex-col gap-8 w-full" onSubmit={submit}>
      <h1 className="text-xl font-semibold">{`${type === 'create' ? 'Create a new' : 'Update a'} Class `}</h1>

      <div className="flex justify-between flex-wrap gap-4">

        <InputField
          label="Class name"
          register={register}
          name="name"
          errors={errors.name}
          defaultValue={data?.name} />


        <InputField
          label="Capacity"
          register={register}
          name="capacity"
          errors={errors.capacity}
          defaultValue={data?.capacity} />

        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Supervisor</label>
          <select
            defaultValue={data?.supervisorId}
            {...register('supervisorId')}
            className="ring-[2px] ring-gray-300 p-2 rounded-md text-sm w-full">
            {
              teachers.map((item: { id: string, name: string, surname: string }) =>
                <option key={item.id} value={item.id}>{item.name + " " + item.surname}</option>)
            }
          </select>
          {errors.supervisorId?.message && <p className="text-xs text-red-400">{errors.supervisorId.message.toString()}</p>}
        </div>

        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Grade</label>
          <select
            defaultValue={data?.gradeId}
            {...register('gradeId')}
            className="ring-[2px] ring-gray-300 p-2 rounded-md text-sm w-full">
            {
              grades.map((item: { id: number, level: number }) =>
                <option key={item.id} value={item.id}>{item.level}</option>)
            }
          </select>
          {errors.gradeId?.message && <p className="text-xs text-red-400">{errors.gradeId.message.toString()}</p>}
        </div>
      </div>

      {state.error && <span className="text-red-500">Something went wrong</span>}
      <button
        className="bg-blue-400 text-white p-2 rounded-md">
        {type === 'create' ? 'Create' : 'Update'}
      </button>
    </form>
  )
}

export default ClassForm