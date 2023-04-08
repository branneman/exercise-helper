import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter, Route, Routes } from 'react-router-dom'

import App from './components/App'
import ListPrograms from './pages/ListPrograms'
import ViewProgram from './pages/ViewProgram'

ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
).render(
  <React.StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<ListPrograms />} />
          <Route
            path="program/:id"
            element={<ViewProgram />}
          />
        </Route>
      </Routes>
    </HashRouter>
  </React.StrictMode>
)
