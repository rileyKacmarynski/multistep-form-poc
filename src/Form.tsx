import * as React from 'react';
import Box from '@mui/material/Box';
import MuiStepper from '@mui/material/Stepper';
import MuiStep from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import { User, UserStep } from './formSteps/UserStep'
import { AddressStep } from './formSteps/AddressStep'
import { LastStep } from './formSteps/LastStep'
import { Stack, Typography } from '@mui/material'
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { FieldValues, useForm, UseFormReturn } from 'react-hook-form';

export type ValidationSchema = z.ZodTypeAny

export type StepProps<TValidationSchema extends ValidationSchema> = {
  onSubmit: () => void,
  validationSchema: TValidationSchema
  children: React.ReactNode,
}

export type FormStepOptions<TValidationSchema extends ValidationSchema> = {
  validationSchema: TValidationSchema
  onSubmit?: () => void,
}

export type StepContext = UseFormReturn<FieldValues, any>

const stepContext = React.createContext<StepContext | undefined>(undefined)

export function useFormStep() {
  const context = React.useContext(stepContext)
  if(!context) throw new Error('useFormStep must be wrapped in a Wizard component')

  return context
}

type FormContext = {
  handleNext(): void
  nextDisabled: boolean
  handleBack(): void
  backDisabled: boolean
  activeStepIndex: number
  enabledSteps: FormStep[]
}

const formContext = React.createContext

function Step<T extends ValidationSchema>({ onSubmit, validationSchema, children }: StepProps<T>) {
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(validationSchema)
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {children}
    </form>

  )
}

Wizard.Step = Step

export type StepKey =  'user' | 'address' | 'last-step'
export type FormStep = {
  label: string
  slug: StepKey
  Component: React.ReactNode,
  validationSchema?: z.ZodTypeAny

}

export type FormStepMap = Map<StepKey, FormStep>

export const formSteps = [
  {
    slug: 'user',
    Component: <UserStep />,
    label: 'User',
    validationSchema: User
  },
  {
    slug: 'address',
    Component: <AddressStep />,
    label: 'Address',
  },
  {
    slug: 'last-step',
    Component: <LastStep />,
    label: 'Last Step',
  }
] satisfies FormStep[]


export function Wizard({ children }: { children: React.ReactNode}) {
  const navigate = useNavigate()
  const { step } = useParams()
  // realstically redirect to the first step
  if(!step) return null

  const [enabledSteps, setEnabledSteps] = React.useState(formSteps)
  const activeStep = enabledSteps
    .find(s => s.slug === step?.replace('/', ''))
  
  if (!activeStep) throw new Error('cant find step from url, should 404')

  const activeStepIndex = enabledSteps
    .map(s => s.slug)
    .indexOf(activeStep.slug)

  console.log(activeStepIndex)

  const handleNext = () => {
    const nextStep = enabledSteps[activeStepIndex + 1]

    navigate(`/wizard/${nextStep.slug}`)
  }

  const handleBack = () => {
    const previousStep = enabledSteps[activeStepIndex - 1]

    navigate(`/wizard/${previousStep.slug}`)
  }

  const form = useForm({
    resolver: zodResolver(activeStep.validationSchema!)
  })

  return (
    <form key={activeStepIndex}>
      <Stack>
        <Typography>{activeStep.label}</Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4 }}>
          <Stack spacing={2} sx={{ maxWidth: '300px', alignItems: 'center',}}>
              {activeStep.Component}
          </Stack>
        </Box>
      </Stack>
      <Box sx={{ width: '100%', position: 'fixed', bottom: 0, left: 0 }}>
        <MuiStepper activeStep={activeStepIndex}>
          {enabledSteps.map((step) => {
            const stepProps: { completed?: boolean } = {};
            const labelProps: {
              optional?: React.ReactNode;
            } = {};
            return (
              <MuiStep key={step.slug} {...stepProps}>
                <StepLabel {...labelProps}>{step.label}</StepLabel>
              </MuiStep>
            );
          })}
        </MuiStepper>
        <React.Fragment>
          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
            <Button
              color="inherit"
              disabled={activeStepIndex === 0}
              onClick={handleBack}
              sx={{ mr: 1 }}
            >
              Back
            </Button>
            <Box sx={{ flex: '1 1 auto' }} />
            <Button onClick={handleNext}>
              {activeStepIndex === enabledSteps.length - 1 ? 'Finish' : 'Next'}
            </Button>
          </Box>
        </React.Fragment>
      </Box>
    </form>
  )
}

