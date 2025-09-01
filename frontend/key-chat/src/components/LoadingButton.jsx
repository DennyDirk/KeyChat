import {Button, CircularProgress} from "@mui/material";

export default function LoadingButton({
                                          onClick,
                                          loading = false,
                                          children,
                                          ...props
                                      }) {
    return (
        <Button
            variant="contained"
            onClick={onClick}
            disabled={loading || props.disabled}
            {...props}
            sx={{
                position: "relative",
                minWidth: 100,
                minHeight: 40,
                ...props.sx,
            }}
        >
            {loading ? (
                <CircularProgress
                    size={20}
                    thickness={5}
                    sx={{
                        color: "#1976d2",
                        position: "absolute",
                    }}
                />
            ) : (
                children
            )}
        </Button>
    );
}
