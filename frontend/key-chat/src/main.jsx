import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './home.jsx'
import ChatRoom from './pages/ChatRoom.jsx'
import './index.css'

const router = createBrowserRouter([
    { path: '/', element: <App /> },
    { path: '/chat/:chatId', element: <ChatRoom /> },
])

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>,
)
