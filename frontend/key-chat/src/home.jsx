import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Container, Typography, Box, TextField } from '@mui/material'

export default function Home() {
    const navigate = useNavigate()
    const [displayName, setDisplayName] = useState('')
    const [ticket, setTicket] = useState(null)
    const [loading, setLoading] = useState(false)

    const join = async () => {
        if (!displayName.trim()) return
        setLoading(true)
        const res = await fetch('/api/random-chat/join', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ displayName })
        })
        const data = await res.json()
        if (data.status === 'matched') {
            navigate(`/chat/${data.chatId}`, { state: { displayName, partnerName: data.partnerName } })
            return
        }
        setTicket(data.ticket)
    }

    useEffect(() => {
        if (!ticket) return
        const id = setInterval(async () => {
            const res = await fetch(`/api/random-chat/status?ticket=${ticket}`)
            const data = await res.json()
            if (data.status === 'matched') {
                clearInterval(id)
                navigate(`/chat/${data.chatId}`, { state: { displayName, partnerName: data.partnerName } })
            }
        }, 1200)
        return () => clearInterval(id)
    }, [ticket, displayName, navigate])

    return (
        <Container maxWidth="sm" sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 3 }}>
            <Typography variant="h3" align="center">KeyChat — Random</Typography>
            <Typography align="center">Введи имя и полетели. Подберу тебе случайного собеседника.</Typography>
            <TextField label="Имя" value={displayName} onChange={e => setDisplayName(e.target.value)} fullWidth />
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Button variant="contained" size="large" onClick={join} disabled={loading}>
                    {ticket ? 'Ждём напарника...' : 'Старт рандом чат'}
                </Button>
            </Box>
        </Container>
    )
}
