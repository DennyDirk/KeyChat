import { Card, Typography, Box } from "@mui/material";

export default function AvatarCard({ name, avatar, borderColor = "#222" }) {
    return (
        <Card
            sx={{
                width: 150,
                height: 80,
                borderRadius: 2,
                boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "space-between",
                p: 1,
                background: "linear-gradient(180deg, #fff 0%, #f9f9f9 100%)",
            }}
        >
            <Box
                component="img"
                src={avatar}
                alt={name}
                sx={{
                    width: 60,
                    height: 60,
                    borderRadius: "50%",
                    border: `2px solid ${borderColor}`,
                    objectFit: "cover",
                }}
            />
            <Typography
                variant="caption"
                sx={{
                    fontWeight: 600,
                    textAlign: "center",
                    color: "#333",
                    px: 1,
                    borderRadius: 1,
                    fontSize: "0.9rem",
                    lineHeight: 1.7,
                }}
            >
                {name}
            </Typography>
        </Card>
    );
}
