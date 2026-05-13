import { Autocomplete, InputAdornment, TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { AutoItem } from '@/hooks/feature_qc_dashboard/useMultiFieldAutocomplete';

interface AutoCompleteMultiFieldProps {
    label: string;
    options: AutoItem[];
    value: AutoItem | null;
    onInputChange: (value: string) => void;
    onSelect: (value: AutoItem | null) => void;
}

const AutoCompleteMultiField: React.FC<AutoCompleteMultiFieldProps> = ({
    label,
    options,
    value,
    onInputChange,
    onSelect
}) => {
    return (
        <Autocomplete
            options={options}
            value={value}
            getOptionLabel={(option) => option.label}
            isOptionEqualToValue={(o, v) => o.id === v.id}
            filterOptions={(opts, state) => {
                const input = state.inputValue.trim().toLowerCase();
                return opts.filter(o =>
                    o.label.toLowerCase().includes(input)
                );
            }}
            onInputChange={(_, newInputValue) => {
                onInputChange(newInputValue.trim());
            }}
            onChange={(_, newValue) => {
                onSelect(newValue);
            }}
            renderInput={(params) => (
                <TextField
                    {...params}
                    placeholder={label}
                    variant="outlined"
                    size="small"
                    fullWidth
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
                    InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon sx={{ color: (theme) => theme.color.text.o5 }} />
                            </InputAdornment>
                        )
                    }}
                />
            )}
        />
    );
};

export default AutoCompleteMultiField;
