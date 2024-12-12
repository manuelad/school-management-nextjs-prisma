'use client'

import { createExam, updateExam } from "@/lib/actions";
import { examSchema, ExamSchema } from "@/lib/formValidationSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useEffect } from "react";
import { useFormState } from "react-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import InputField from "../InputField";



const ExamForm = ({
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
  } = useForm<ExamSchema>({
    resolver: zodResolver(examSchema),
  });

  const [state, formAction] = useFormState(type === 'create' ? createExam : updateExam, {
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
      toast(`Exam has been ${type === 'create' ? 'created' : 'updated'}`)
      setOpen(false)
      router.refresh()
    }
  }, [state])


  const { lessons } = relatedData


  return (
    <form className="flex flex-col gap-8 w-full" onSubmit={submit}>
      <h1 className="text-xl font-semibold">{`${type === 'create' ? 'Create a new' : 'Update a'} Exam `}</h1>

      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Exam title"
          register={register}
          name="title"
          errors={errors.title}
          defaultValue={data?.title} />

        <InputField
          label="Start date"
          register={register}
          name="startTime"
          errors={errors.startTime}
          defaultValue={data?.startTime}
          type="datetime-local" />

        <InputField
          label="End Date"
          register={register}
          name="endTime"
          errors={errors.endTime}
          defaultValue={data?.endTime}
          type="datetime-local" />
      </div>

      <div className="flex flex-col gap-2 w-full md:w-1/4">
        <label className="text-xs text-gray-500">Lessons</label>
        <select
          {...register('lessonId')}
          className="ring-[2px] ring-gray-300 p-2 rounded-md text-sm w-full">
          {
            lessons.map((item: { id: string, name: string }) =>
              <option key={item.id} value={item.id}>{item.name}</option>)
          }
        </select>
        {errors.lessonId?.message && <p className="text-xs text-red-400">{errors.lessonId.message.toString()}</p>}
      </div>

      {state.error && <span className="text-red-500">Something went wrong</span>}
      <button
        className="bg-blue-400 text-white p-2 rounded-md">
        {type === 'create' ? 'Create' : 'Update'}
      </button>
    </form>
  )
}

export default ExamForm