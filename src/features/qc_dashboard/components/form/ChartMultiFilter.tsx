import {
    Autocomplete,
    Checkbox,
    Chip,
    FormControl,
    TextField,
    useTheme
} from '@mui/material';

interface ChartMultiFilterProps {
    label: string;
    options: string[];
    value: string[];           // ['All'] | [] | ['F1A01', ...]
    onChange: (v: string[]) => void;
}

const ALL_VALUE = 'All';

const ChartMultiFilter = ({
    label,
    options,
    value,
    onChange
}: ChartMultiFilterProps) => {
    const theme =useTheme();
    const isAllSelected = value.length === 1 && value[0] === ALL_VALUE;

    const displayValue = isAllSelected
        ? options
        : value;

    const handleChange = (_: any, newValue: string[]) => {
        const hasAll = newValue.includes(ALL_VALUE);

        if (hasAll) {
            if (isAllSelected) {
                onChange([]);
            } else {
                onChange([ALL_VALUE]);
            }
            return;
        }

        const nonAllOptions = options.filter(o => o !== ALL_VALUE);

        if (newValue.length === nonAllOptions.length) {
            onChange([ALL_VALUE]);
            return;
        }

        onChange(newValue);
    };

    const renderTags = (selected: string[]) => {
        if (selected.length === 0) return null;

        if (selected.includes(ALL_VALUE)) {
            return <Chip size="small" sx={{ color: theme.color.text.o1}} label="All" />;
        }

        if (selected.length === 1) {
            return <Chip size="small" sx={{ color: theme.color.text.o1}} label={selected[0]} />;
        }

        return (
            <Chip
                size="small"
                sx={{ color: theme.color.text.o1}}
                label={`Selected + ${selected.length}`}
            />
        );
    };

    return (
        <FormControl fullWidth>
            <Autocomplete
                multiple
                size="small"
                options={options}
                value={displayValue}
                disableCloseOnSelect
                onChange={handleChange}
                isOptionEqualToValue={(o, v) => o === v}
                renderOption={(props, option, { selected }) => (
                    <li
                        {...props}
                        onClick={(e) => {
                            if (option === ALL_VALUE) {
                                e.preventDefault();
                                e.stopPropagation();

                                if (isAllSelected) {
                                    onChange([]);
                                } else {
                                    onChange([ALL_VALUE]);
                                }
                                return;
                            }

                            props.onClick?.(e);
                        }}
                    >
                        <Checkbox checked={selected} sx={{ mr: 1, color: '#9E9E9E',  }} />
                        {option}
                    </li>
                )}
                renderTags={renderTags}
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
                }}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label={label}
                        InputLabelProps={{ shrink: true }}
                    />
                )}
            />
        </FormControl>
    );
};

export default ChartMultiFilter;
