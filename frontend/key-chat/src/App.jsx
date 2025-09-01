import React from 'react';
import { Outlet } from 'react-router-dom';
import bg from './assets/bg.png';

export default function App() {
    return (
        <div
            style={{
                backgroundImage: `url(${bg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                minHeight: '100vh',
            }}>
            <Outlet />
        </div>
    );
}