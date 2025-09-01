import {useEffect, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import loadingAnimation from './assets/loading.gif';
import avatar1 from './assets/avatar/avatar_meme_1.png';
import avatar2 from './assets/avatar/avatar_meme_2.png';
import avatar3 from './assets/avatar/avatar_meme_3.png';
import avatar4 from './assets/avatar/avatar_meme_4.png';
import avatar5 from './assets/avatar/avatar_meme_5.png';
import noAvatar from './assets/avatar/no_profile_pic.png';
import {Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography} from '@mui/material'
import LoadingButton from "./components/LoadingButton.jsx";

export default function RandomChatDetailsModal({open, onClose}) {
    const navigate = useNavigate()
    const [displayName, setDisplayName] = useState('')
    const [ticket, setTicket] = useState(null)
    const [loading, setLoading] = useState(false)
    const [selectedAvatar, setSelectedAvatar] = useState(null);
    const avatars = [avatar1, avatar2, avatar3, avatar4, avatar5];

    const join = async () => {
        if (!displayName.trim()) return;
        setLoading(true)
        const res = await fetch('/api/random-chat/join', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({displayName, avatarSrc: selectedAvatar})
        })
        const data = await res.json()
        if (data.status === 'matched') {
            navigate(`/chat/${data.chatId}`, {
                state: {
                    displayName,
                    selectedAvatar: selectedAvatar ? selectedAvatar : noAvatar,
                    partnerName: data.partnerName,
                    partnerSelectedAvatar: data.partnerAvatarSrc
                }
            });
            return;
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
                navigate(`/chat/${data.chatId}`, {
                    state: {
                        displayName,
                        selectedAvatar: selectedAvatar ? selectedAvatar : noAvatar,
                        partnerName: data.partnerName,
                        partnerSelectedAvatar: data.partnerAvatarSrc ? data.partnerAvatarSrc : noAvatar
                    }
                })
            }
        }, 1200)
        return () => clearInterval(id)
    }, [ticket, displayName, navigate])

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>KeyChat — Random</DialogTitle>
            <DialogContent sx={{display: 'flex', flexDirection: 'column', gap: 2, minWidth: 300, alignItems: "center"}}>
                <Typography variant="body2">Choose your avatar and enter your name. I'll find you a random conversation
                    partner.</Typography>
                <Box sx={{display: 'flex', gap: 1}}>
                    {avatars.map((avatar, idx) => (
                        <img
                            key={idx}
                            src={avatar}
                            alt={`avatar-${idx}`}
                            onClick={() => setSelectedAvatar(avatar)}
                            style={{
                                width: 85,
                                height: 85,
                                borderRadius: '50%',
                                cursor: 'pointer',
                                border: selectedAvatar === avatar ? '3px solid #1976d2' : '2px solid #ccc',
                                transition: '0.2s'
                            }}
                        />
                    ))}
                </Box>
                <TextField label="Name" value={displayName} onKeyDown={e => {
                    if (e.key === 'Enter')
                    {
                        join();
                    }
                }} onChange={e => setDisplayName(e.target.value)} fullWidth/>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} disabled={loading}>Close</Button>
                <LoadingButton onClick={join} loading={loading}>
                    Start
                </LoadingButton>
            </DialogActions>
        </Dialog>
    )
}
