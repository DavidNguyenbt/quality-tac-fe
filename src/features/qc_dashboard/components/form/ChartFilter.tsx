// components/chart/ChartFilter.tsx
import { Autocomplete, FormControl, TextField } from '@mui/material';

interface ChartFilterProps {
    label: string;
    options: string[];
    value: string | null;
    onChange: (v: string | null) => void;
}

const ChartFilter = ({
    label,
    options,
    value,
    onChange
}: ChartFilterProps) => {
    return (
        <FormControl fullWidth>
            <Autocomplete
                size="small"
                options={options}
                value={value}
                onChange={(_, v) => onChange(v)}
                isOptionEqualToValue={(o, v) => o === v}
                sx={{
                    pl: 0,
                    '& .MuiOutlinedInput-root': {
                        paddingRight: '48px !important',
                        alignItems: 'center',
                    },
                    '& .MuiSvgIcon-root': {
                        fontSize: '1.2rem',
                        color: (theme) => theme.color.text.o5
                    },
                    '& .MuiAutocomplete-endAdornment': {
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        '& svg': {
                            fontSize: '1.5rem',
                            color: (theme) => theme.color.text.o5,
                        },
                    },
                    '& .MuiAutocomplete-clearIndicator': {
                        display: 'flex !important',
                        alignItems: 'center',
                    },
                }}
                renderInput={(params) => (
                    <TextField {...params} label={label} />
                )}
            />
        </FormControl>
    );
};

export default ChartFilter;
