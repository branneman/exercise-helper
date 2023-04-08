import { Outlet } from 'react-router-dom'

import Header from '../Header'
import './index.css'

export default function App() {
  return (
    <>
      <Header />
      <Outlet />
    </>
  )
}
