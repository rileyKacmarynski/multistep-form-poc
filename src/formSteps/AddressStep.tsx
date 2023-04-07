import { Box, TextField } from '@mui/material';
import z from 'zod'

const Address = z.object({
  city: z.string().min(1),
  state: z.enum(['SD', 'MN']),
  zip: z.string().min(1),
  street: z.string().min(1),
})

export function AddressStep() {
  return (
    <>
      <TextField />
      <TextField />
      <TextField />
    </>
  )
}
