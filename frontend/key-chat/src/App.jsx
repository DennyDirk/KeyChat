import { Routes, Route, useNavigate } from "react-router-dom";
import { Button, Container, Typography, Box, TextField, Paper } from "@mui/material";

function HomePage() {
    const navigate = useNavigate();

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
                <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={() => console.log("Вход в чат")}
                >
                    Sign In
                </Button>
            </Box>
            <Box>
                <Button
                    variant="contained"
                    color="secondary"
                    size="large"
                    onClick={() => navigate("/random-chat")}
                >
                    Start random chat
                </Button>
            </Box>
        </Container>
    );
}

function RandomChatPage() {
    return (
        <Container
            maxWidth={false}
            sx={{
                display: "flex",
                flexDirection: "column",
                height: "100vh",
                padding: 2,
            }}
        >
            <Typography variant="h4" gutterBottom>
                Random Chat
            </Typography>
            <Paper
                sx={{
                    flex: 1,
                    padding: 2,
                    overflowY: "auto",
                    marginBottom: 2,
                    backgroundColor: "#f5f5f5",
                }}
            >
                {/* Тут будут сообщения */}
                <Typography>Чат пуст, пиши первым!</Typography>
            </Paper>
            <Box sx={{ display: "flex", gap: 1 }}>
                <TextField fullWidth placeholder="Введите сообщение..." />
                <Button variant="contained" color="primary">
                    Send
                </Button>
            </Box>
        </Container>
    );
}

export default function App() {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/random-chat" element={<RandomChatPage />} />
        </Routes>
    );
}
