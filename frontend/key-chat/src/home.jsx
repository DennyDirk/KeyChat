import {useNavigate} from "react-router-dom";
import {Box, Button, Container, Tooltip, Typography} from "@mui/material";
import {useState} from "react";
import RandomChatModal from './RandomChatDetailsModal.jsx'

export default function HomePage() {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false)

    return (
        <Container
            maxWidth={false}
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "100vh",
                gap: 3,
            }}
        >
            <Typography variant="h3" component="h1" align="center">
                KeyChat
            </Typography>
            <Typography variant="body1" align="center">
                Добро пожаловать! Нажми кнопку, чтобы войти в чат.
            </Typography>
            <Box>
                <Tooltip
                    title="Sign in functionality is on its way 🚀. Meanwhile, dive into Random Chat!"
                    arrow
                >
            <span>
                <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={a => console.log("in development")}
                    disabled
                >
                    Sign In
                </Button>
            </span>
                </Tooltip>
            </Box>
            <Box>
                <Button
                    variant="contained"
                    color="secondary"
                    size="large"
                    onClick={() => setOpen(true)}
                >
                    Start random chat
                </Button>
            </Box>
            <RandomChatModal open={open} onClose={() => setOpen(false)}/>
        </Container>
    );
}