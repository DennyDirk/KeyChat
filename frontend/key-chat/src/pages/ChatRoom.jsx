import {useEffect, useRef, useState} from 'react'
import {useLocation, useParams} from 'react-router-dom'
import {Client} from '@stomp/stompjs'
import {Box, Button, Container, Paper, TextField, Typography} from '@mui/material'

import SockJS from 'sockjs-client/dist/sockjs';
import AvatarCard from "../components/AvatarCard.jsx";

export default function ChatRoom() {
    const {chatId} = useParams()
    const {state} = useLocation()
    const displayName = state?.displayName || 'Anonymous'
    const partnerName = state?.partnerName || 'Stranger'
    const selectedAvatar = state?.selectedAvatar || 'no'
    const partnerSelectedAvatar = state?.partnerSelectedAvatar || 'no'

    const [messages, setMessages] = useState([])
    const [input, setInput] = useState('')
    const [isTyping, setIsTyping] = useState(false)
    const [typingUser, setTypingUser] = useState('')
    const typingTimeoutRef = useRef(null)
    const clientRef = useRef(null)
    const listRef = useRef(null)

    useEffect(() => {
        window.global = window;

        const client = new Client({
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

                client.subscribe(`/topic/chat.${chatId}/typing`, (frame) => {
                    const body = JSON.parse(frame.body);
                    if (body.user !== displayName) {
                        setTypingUser(body.user);
                        setIsTyping(true)
                        clearTimeout(typingTimeoutRef.current)
                        typingTimeoutRef.current = setTimeout(() => setIsTyping(false), 1500)
                    }
                });
            },
            debug: (msg) => console.log(msg),
        });

        client.activate();
        clientRef.current = client;
        return () => {
            client.deactivate();
            clearTimeout(typingTimeoutRef.current)
        };
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
            sentAt: new Date().toISOString(),
            senderAvatarSrc: selectedAvatar,
        };
        clientRef.current.publish({
            destination: `/app/chat/${chatId}`,
            body: JSON.stringify(payload)
        });
        setInput('');
    };

    const sendTyping = () => {
        if (!clientRef.current || !clientRef.current.connected) return;
        clientRef.current.publish({
            destination: `/app/chat/${chatId}/typing`,
            body: JSON.stringify({user: displayName, isTyping: isTyping})
        });
    }

    return (
        <Container maxWidth="md" sx={{minHeight: '100vh', py: 4, display: 'flex', flexDirection: 'column', gap: 2}}>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    px: 2,
                    py: 1
                }}
            >
                {/* Левая карточка — собеседник */}

                {/* Правая карточка — ты */}
                <AvatarCard name={partnerName} avatar={partnerSelectedAvatar} />
                <AvatarCard name={displayName} avatar={selectedAvatar} borderColor="#1976d2" />
            </Box>

            <Paper elevation={3} ref={listRef} sx={{flex: 1, p: 2, overflowY: 'auto', maxHeight: 400}}>
                {messages.map((m, i) => {
                    const isMine = m.senderUserName === displayName; // проверка, твое ли сообщение
                    return (
                        <Box
                            key={i}
                            sx={{
                                display: 'flex',
                                mb: 2,
                                justifyContent: isMine ? 'flex-end' : 'flex-start',
                                alignItems: 'flex-end',
                            }}
                        >
                            {/* Аватарка слева у собеседника */}
                            {!isMine && (
                                <img
                                    src={partnerSelectedAvatar}
                                    alt={partnerName}
                                    style={{
                                        width: 60,
                                        height: 60,
                                        border: '2px solid #e0e0e0',
                                        borderRadius: '50%',
                                        marginRight: 8,
                                        alignSelf: 'flex-end'
                                    }}
                                />
                            )}

                            <Box sx={{display: 'flex', flexDirection: 'column', maxWidth: '70%'}}>
                                <Box
                                    sx={{
                                        backgroundColor: isMine ? '#1976d2' : '#e0e0e0',
                                        color: isMine ? 'white' : 'black',
                                        px: 2,
                                        py: 1,
                                        borderRadius: 3,
                                        wordBreak: 'break-word',
                                        whiteSpace: 'pre-wrap',
                                        alignSelf: isMine ? 'flex-end' : 'flex-start',
                                        textAlign: isMine ? 'right' : 'left'
                                    }}
                                >
                                    <Typography>{m.content}</Typography>
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            fontSize: '0.7rem',
                                            opacity: 0.7,
                                            mt: 0.5,
                                            alignSelf: isMine ? 'flex-end' : 'flex-start'
                                        }}
                                    >
                                        {new Date(m.sentAt).toLocaleTimeString([], {
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </Typography>
                                </Box>
                            </Box>

                            {isMine && (
                                <img
                                    src={selectedAvatar}
                                    alt={displayName}
                                    style={{
                                        width: 60,
                                        height: 60,
                                        border: '2px solid #1976d2',
                                        borderRadius: '50%',
                                        marginLeft: 8,
                                        alignSelf: 'flex-end'
                                    }}
                                />
                            )}
                        </Box>

                    );
                })}
                {isTyping && (
                    <Box sx={{display: 'flex', alignItems: 'center', px: 2, py: 1}}>
                        <Box
                            sx={{
                                display: 'flex',
                                gap: '4px',
                                backgroundColor: '#e0e0e0',
                                borderRadius: '16px',
                                px: 2,
                                py: 1
                            }}
                        >
                            <span className="dot"></span>
                            <span className="dot"></span>
                            <span className="dot"></span>
                        </Box>
                    </Box>
                )}

            </Paper>


            <Box sx={{display: 'flex', gap: 1}}>
                <TextField
                    value={input}
                    onChange={e => {
                        setInput(e.target.value);
                        sendTyping();
                    }}
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

