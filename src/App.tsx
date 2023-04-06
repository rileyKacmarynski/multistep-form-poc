import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Link, Outlet, Route, Routes, useHref, useLocation, useMatch, useNavigate, useParams } from 'react-router-dom'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <Box >Some shared layout</Box>
      <Outlet />
    </div>
  )
}

export default App



import * as React from 'react';
import Box from '@mui/material/Box';
import MuiStepper from '@mui/material/Stepper';
import MuiStep from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import { Step1 } from './formSteps/Step1'
import { Step2 } from './formSteps/Step2'
import { Step3 } from './formSteps/Step3'
import { Typography } from '@mui/material'

export type FormStep = {
  label: string
  slug: string
  Component: React.ReactNode
}

export type StepKey = typeof formSteps[number]['slug']
export type FormStepMap = Map<StepKey, FormStep>

export const formSteps = [
  {
    slug: 'step1',
    Component: <Step1 />,
    label: 'Step 1',
  },
  {
    slug: 'step2',
    Component: <Step2 />,
    label: 'Step 2',
  },
  {
    slug: 'step3',
    Component: <Step3 />,
    label: 'Step 3',
  }
] as const

export function Wizard() {
  const navigate = useNavigate()
  const { step } = useParams()
  // realstically redirect to the first step
  if(!step) return null

  console.log(step)
  // I don't think a map works because we have to maintain order
  // const [activeSteps, setActiveSteps] = useState<FormStepMap>(
  //   formSteps.reduce(
  //     (map, step) => map.set(step.slug, step),
  //     new Map()
  //   )
  // )

  const [enabledSteps, setEnabledSteps] = useState(formSteps)
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

  return (
    <>
      <Typography>{activeStep.label}</Typography>
      <div>
        {activeStep.Component} 
      </div>
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
    </>
  )
}

function Steps() {
  return (
    <div>
      <Outlet />
    </div>
  )
}

Wizard.Step = MuiStep

export function Stepper() {
  const [activeStep, setActiveStep] = React.useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <></>
  );
}
