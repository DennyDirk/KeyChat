// src/pages/RandomWaiting.jsx
import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Typography, CircularProgress, Button } from "@mui/material";

export default function RandomWaiting() {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState("waiting");
    const pollingRef = useRef(null);

    useEffect(() => {
        // check immediately, then poll
        const check = async () => {
            try {
                const res = await fetch(`/api/random-chat/check?userId=${userId}`);
                const data = await res.json();
                if (data.status === "matched") {
                    setStatus("matched");
                    // stop polling and navigate
                    if (pollingRef.current) clearInterval(pollingRef.current);
                    navigate(`/chat/${data.chatId}`);
                } else {
                    setStatus("waiting");
                }
            } catch (e) {
                console.error("check error", e);
            }
        };

        check();
        pollingRef.current = setInterval(check, 2500); // poll every 2.5s

        return () => {
            if (pollingRef.current) clearInterval(pollingRef.current);
            // optionally tell server we left
            fetch(`/api/random-chat/leave?userId=${userId}`, { method: "POST" }).catch(() => {});
        };
    }, [userId, navigate]);

    return (
        <Container maxWidth={false} sx={{ p: 4, textAlign: "center" }}>
            <Typography variant="h5">Ищем собеседника...</Typography>
            <CircularProgress sx={{ mt: 4 }} />
            <Typography sx={{ mt: 2 }}>Статус: {status}</Typography>
            <Button sx={{ mt: 3 }} variant="outlined" onClick={() => {
                // отмена ожидания
                fetch(`/api/random-chat/leave?userId=${userId}`, { method: "POST" }).then(()=>navigate("/"));
            }}>
                Отменить
            </Button>
        </Container>
    );
}
