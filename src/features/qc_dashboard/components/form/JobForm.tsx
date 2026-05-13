import { AutoItem, useMultiFieldAutocomplete } from '@/hooks/feature_qc_dashboard/useMultiFieldAutocomplete';
import { getStyleById, searchStyleByText } from '@/network/urls/qc_dashboard';
import { TextField, Autocomplete, Grid } from '@mui/material';
import { useEffect, useState } from 'react';
import AutoCompleteMultiField from './AutoCompleteMultiField';

interface FormData {
    jobName: string;
    quantity: number;
    remark: string;

    styleId: number | null;
    buyerId: number | null;
    lineId: number | null;
    colorId: number | null;
}
interface Props {
    editData?: Partial<FormData>;
}

const searchApi = async (key: string, text: string): Promise<AutoItem[]> => {
    switch (key) {
        case 'style':
            return await searchStyleByText({ text });
        case 'buyer':
            return await searchStyleByText({ text });
        case 'line':
            return await searchStyleByText({ text });
        case 'color':
            return await searchStyleByText({ text });
        default:
            return [];
    }
};

const getByIdApi = async (key: string, id: string | number): Promise<AutoItem> => {
    switch (key) {
        case 'style':
            return await getStyleById(id);
        case 'buyer':
            return await getStyleById(id);
        case 'line':
            return await getStyleById(id);
        case 'color':
            return await getStyleById(id);
        default:
            throw new Error('Unknown key');
    }
};

const JobForm: React.FC<Props> = ({ editData }) => {

    const [formData, setFormData] = useState<FormData>({
        jobName: '',
        quantity: 0,
        remark: '',

        styleId: null,
        buyerId: null,
        lineId: null,
        colorId: null
    });

    const {
        getField,
        handleInputChange,
        handleSelect,
        initById
    } = useMultiFieldAutocomplete<AutoItem>(searchApi, getByIdApi);

    /** INIT EDIT */
    useEffect(() => {
        if (!editData) return;

        setFormData(prev => ({ ...prev, ...editData }));

        if (editData.styleId) initById('style', editData.styleId);
        if (editData.buyerId) initById('buyer', editData.buyerId);
        if (editData.lineId) initById('line', editData.lineId);
        if (editData.colorId) initById('color', editData.colorId);
    }, [editData]);

    return (
        <Grid container spacing={2}>

            {/* ===== TEXT FIELDS ===== */}
            <Grid item xs={4}>
                <TextField
                    label="Job Name"
                    fullWidth
                    value={formData.jobName}
                    onChange={e =>
                        setFormData(p => ({ ...p, jobName: e.target.value }))
                    }
                />
            </Grid>

            <Grid item xs={4}>
                <TextField
                    label="Quantity"
                    type="number"
                    fullWidth
                    value={formData.quantity}
                    onChange={e =>
                        setFormData(p => ({ ...p, quantity: +e.target.value }))
                    }
                />
            </Grid>

            <Grid item xs={4}>
                <TextField
                    label="Remark"
                    fullWidth
                    value={formData.remark}
                    onChange={e =>
                        setFormData(p => ({ ...p, remark: e.target.value }))
                    }
                />
            </Grid>

            {/* ===== AUTOCOMPLETE ===== */}
            <Grid item xs={3}>
                <AutoCompleteMultiField
                    label="Style"
                    options={getField('style').options}
                    value={getField('style').value}
                    onInputChange={(v) => handleInputChange('style', v)}
                    onSelect={(v) => {
                        handleSelect('style', v);
                        setFormData(p => ({
                            ...p,
                            styleId: v ? Number(v.id) : null
                        }));
                    }}
                />
            </Grid>

            <Grid item xs={3}>
                <AutoCompleteMultiField
                    label="Buyer"
                    options={getField('buyer').options}
                    value={getField('buyer').value}
                    onInputChange={(v) => handleInputChange('buyer', v)}
                    onSelect={(v) => {
                        handleSelect('buyer', v);
                        setFormData(p => ({
                            ...p,
                            buyerId: v ? Number(v.id) : null
                        }));
                    }}
                />
            </Grid>

            <Grid item xs={3}>
                <AutoCompleteMultiField
                    label="Line"
                    options={getField('line').options}
                    value={getField('line').value}
                    onInputChange={(v) => handleInputChange('line', v)}
                    onSelect={(v) => {
                        handleSelect('line', v);
                        setFormData(p => ({
                            ...p,
                            lineId: v ? Number(v.id) : null
                        }));
                    }}
                />
            </Grid>

            <Grid item xs={3}>
                <AutoCompleteMultiField
                    label="Color"
                    options={getField('color').options}
                    value={getField('color').value}
                    onInputChange={(v) => handleInputChange('color', v)}
                    onSelect={(v) => {
                        handleSelect('color', v);
                        setFormData(p => ({
                            ...p,
                            colorId: v ? Number(v.id) : null
                        }));
                    }}
                />
            </Grid>

        </Grid>
    );
};

export default JobForm;
