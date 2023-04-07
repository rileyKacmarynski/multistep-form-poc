import { Box, Stack, TextField } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import z from 'zod'
import { useFormStep, Wizard } from "../Form";
import { zodResolver } from '@hookform/resolvers/zod'

export const User = z.object({
  email: z.string().email(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
})

export function UserStep(){
  /* const { control } = useFormStep({ */
  /*   onSubmit:() => { console.log('submitting') } */
  /*   validationSchema: User, */
  /* }) */

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(User)
  })

  /* const { control } = useFormStep() */

  return (
    <>
      <Controller
        name="username"
        control={control}
        render={(({ field }) => <TextField label="username" {...field} />)}
      />
      <Controller
        name="firstName"
        control={control}
        render={(({ field }) => <TextField label="first name" {...field} />)}
      />
      <Controller
        name="lstName"
        control={control}
        render={(({ field }) => <TextField label="last name" {...field} />)}
      />
    </>
  )
}

