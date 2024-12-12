import React from "react"
import { FieldError } from "react-hook-form"

type Props = {
    label: string,
    type?: string,
    register: any,
    name: string,
    errors?: FieldError,
    defaultValue?: string,
    inputProps?: React.InputHTMLAttributes<HTMLInputElement>,

}
const InputField = ({
    label,
    type = "text",
    register,
    name,
    defaultValue,
    errors,
    inputProps
}: Props) => {
    return (
        <div className="flex flex-col gap-2 w-full md:w-1/4">
            <label className="text-xs text-gray-500">{label}</label>
            <input
                type={type}
                {...register(name)}
                className="ring-[2px] ring-gray-300 p-2 rounded-md text-sm w-full"
                {...inputProps}
                defaultValue={defaultValue}
            />
            {errors?.message && <p className="text-xs text-red-400">{errors?.message.toString()}</p>}
        </div>
    )
}

export default InputField