import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { Box } from "@mui/material";
import { useLoading } from "@/utils/context/LoadingProvider.tsx";

interface SessionExpiredDialogProps {
    open: boolean;
    onClose: () => void;
}

const SessionExpiredDialog: React.FC<SessionExpiredDialogProps> = ({ open, onClose }) => {
    const { setLoading } = useLoading()

    const handleLogin = () => {
        onClose();

        setLoading(true)

        setTimeout(() => {
            window.location.replace('/');
            setLoading(false);
        }, 500);

    };

    return (
        <Box>
            <Dialog open={open} >
                <Box sx={{ backgroundColor: (theme) => theme.color.background.o2 }}>


                    <DialogTitle sx={{ color: (theme) => theme.color.text.o1}}>Session Expired</DialogTitle>
                    <DialogContent sx={{ color: (theme) => theme.color.text.o1}}>
                        Your session has expired. Please log in again.
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleLogin} color="primary">
                            Login
                        </Button>
                    </DialogActions>
                </Box>
            </Dialog>

        </Box>
    );
};

export default SessionExpiredDialog;
