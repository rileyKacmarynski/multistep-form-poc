import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Link, Outlet, Route, Routes, useHref, useLocation, useMatch, useNavigate, useParams } from 'react-router-dom'
import { Box } from '@mui/material'
import { Wizard } from './Form'
import { User, UserStep } from './formSteps/UserStep'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <Box sx={{ py: 2, backgroundColor: 'primary.main', color: '#ffffff' }}>Some shared layout</Box>
      <Box sx={{ mt: 4 }}>
        <Outlet />
      </Box> 
    </div>
  )
}

export function Form() {
  return(
    <Wizard>
      <Wizard.Step validationSchema={User}>
        <UserStep />
      </Wizard.Step>
    </Wizard>
  )
}

export default App
