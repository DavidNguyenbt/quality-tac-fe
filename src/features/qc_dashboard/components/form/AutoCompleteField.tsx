import { TextFieldMandatory } from '@/components/Field/TextFieldMandatory';
import { Autocomplete, InputAdornment, TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

interface JobSearchItem {
    style: string;
}

interface AutoCompleteFieldProps {
    label: string;
    options: JobSearchItem[];
    onInputChange: (value: string) => void;
    onSelect: (value: JobSearchItem | null) => void;
}

const AutoCompleteField: React.FC<AutoCompleteFieldProps> = ({
    label,
    options,
    onInputChange,
    onSelect
}) => {
    return (
        <Autocomplete
            options={options}
            getOptionLabel={(option) => option.style}
            filterOptions={(options, state) => {
                const inputValue = state.inputValue.trim().toLowerCase();
                return options.filter(option =>
                    option.style.toLowerCase().includes(inputValue)
                );
            }}
            onInputChange={(_event, newInputValue) => {
                onInputChange(newInputValue.trim());
            }}
            onChange={(_event, newValue) => {
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

export default AutoCompleteField;
