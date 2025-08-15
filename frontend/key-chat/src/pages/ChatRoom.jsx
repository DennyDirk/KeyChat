import {useEffect, useMemo, useRef, useState} from 'react'
import {useLocation, useParams} from 'react-router-dom'
import {Client} from '@stomp/stompjs'
import {Container, Box, Typography, TextField, Button, Paper} from '@mui/material'

import SockJS from 'sockjs-client/dist/sockjs';

export default function ChatRoom() {
    const {chatId} = useParams()
    const {state} = useLocation()
    const displayName = state?.displayName || 'Anonymous'
    const partnerName = state?.partnerName || 'Stranger'

    const [messages, setMessages] = useState([])
    const [input, setInput] = useState('')
    const clientRef = useRef(null)
    const listRef = useRef(null)

    useEffect(() => {
        // Хак для global в браузере
        window.global = window;

        const client = new Client({
            // brokerURL не указываем, потому что используем webSocketFactory
            webSocketFactory: () => new SockJS(`${location.protocol}//${location.host}/ws`),
            reconnectDelay: 1000,
            onConnect: () => {
                console.log('Connected!');
                client.subscribe(`/topic/chat.${chatId}`, (frame) => {
                    const body = JSON.parse(frame.body);
                    setMessages(prev => [...prev, body]);
                    setTimeout(() => {
                        listRef.current?.scrollTo({top: listRef.current.scrollHeight, behavior: 'smooth'});
                    }, 50);
                });
            },
            debug: (msg) => console.log(msg),
        });

        client.activate();
        clientRef.current = client;
        return () => client.deactivate();
    }, [chatId]);

    const send = () => {
        if (!input.trim()) return;
        if (!clientRef.current || !clientRef.current.connected) {
            console.warn('STOMP not connected yet');
            return;
        }
        const payload = {
            chatId: Number(chatId),
            senderUserName: displayName,
            content: input,
            sentAt: new Date().toISOString()
        };
        clientRef.current.publish({
            destination: `/app/chat/${chatId}`,
            body: JSON.stringify(payload)
        });
        setInput('');
    };
    return (
        <Container maxWidth="md" sx={{minHeight: '100vh', py: 4, display: 'flex', flexDirection: 'column', gap: 2}}>
            <Typography variant="h5">Чат #{chatId} — ты: {displayName}, собеседник: {partnerName}</Typography>

            <Paper elevation={3} ref={listRef} sx={{flex: 1, p: 2, overflowY: 'auto', maxHeight: 400}}>
                {messages.map((m, i) => (
                    <Box key={i} sx={{mb: 1, display: 'flex', flexDirection: 'column'}}>
                        <Typography variant="caption" sx={{opacity: 0.7}}>
                            {m.senderUserName} • {new Date(m.sentAt).toLocaleTimeString()}
                        </Typography>
                        <Typography>{m.content}</Typography>
                    </Box>
                ))}
            </Paper>

            <Box sx={{display: 'flex', gap: 1}}>
                <TextField
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    fullWidth
                    placeholder="Напиши сообщение…"
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') send()
                    }}
                />
                <Button variant="contained" onClick={send}>Send</Button>
            </Box>
        </Container>
    )
}

