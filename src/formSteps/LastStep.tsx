import { Box } from "@mui/material";
import z from 'zod'

const Last = z.object({
  color: z.string(),
  thingId: z.string(),
  someRadio: z.string(),
})

export function LastStep(){
  return (
    <Box>
      This is the last step
    </Box>
  )
}
