import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, styled, Typography } from '@mui/material';
import ErrorOutlinedIcon from '@mui/icons-material/ErrorOutlined';
import { TextFieldMandatory } from '../Field/TextFieldMandatory';

interface DeleteRoleDialogProps {
    open: boolean;
    title: string;
    titleConfirmed?: string;
    text?: string;
    setText?: (value: string) => void;
    onClose: () => void;
    onDelete: () => void;
}
const buttonStyles = {
    width: '100%',
    height: '48px !important',
    px: 2,
    py: 1,
    borderWidth: '2px',
    borderRadius: '4px',
    fontWeight: 700,
};

const CancelButton = styled(Button)({
    color: '#5E697C',
    borderColor: '#5E697C',
    ...buttonStyles,
});

const SubmitButton = styled(Button)(({ theme }) => ({
    ...buttonStyles,
    color: theme.palette.common.white,
}));
const StickyDialogActions = styled(DialogActions)(({ theme }) => ({
    position: 'sticky',
    bottom: 0,
    height: '72px',
    backgroundColor: theme.color.background.o2,
    zIndex: 1,
    padding: theme.spacing(3),
    display: 'flex',
    justifyContent: 'center',

}));
const DialogDelete: React.FC<DeleteRoleDialogProps> = ({ open, title, titleConfirmed, onClose, onDelete, text, setText }) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (setText) {
            setText(e.target.value);
        }
    };
    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" sx={{ '& .MuiPaper-root': { borderRadius: '12px' } }}>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor : (theme)=> theme.color.background.o2 }}>
                <Box sx={{ backgroundColor: (theme)=> theme.color.background.o2, height: '145px', width: '145px', borderRadius: '150px', justifyContent: 'center', alignItems: 'center', display: 'flex', mb: '16px' }}>
                    <ErrorOutlinedIcon
                        sx={{ color: '#E80303', width: '108px', height: '108px' }} />
                </Box>
            </DialogTitle>
            <DialogContent
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: (theme)=> theme.color.background.o2
                }}
            >
                <Box sx={{ width: '100%', marginBottom: 2 }}>
                    <Typography
                        sx={{
                            fontSize: '24px',
                            fontWeight: 400,
                            color: (theme)=> theme.color.text.o1,
                            textAlign: 'center'
                        }}
                    >
                        {title}
                    </Typography>
                </Box>

                <Box sx={{ width: '100%', marginBottom: 2 }}>
                    <Typography
                        sx={{
                            fontSize: '24px',
                            fontWeight: 600,
                            color: '#1B2722',
                            textAlign: 'center'
                        }}
                    >
                        {titleConfirmed}
                    </Typography>
                </Box>
            </DialogContent>
            <StickyDialogActions>
                <CancelButton onClick={onClose} variant="outlined">
                    No
                </CancelButton>
                <SubmitButton
                    onClick={onDelete}
                    variant="contained"
                    color="primary"
                >
                    Yes
                </SubmitButton>
            </StickyDialogActions>
        </Dialog>
    );
};

export default DialogDelete;