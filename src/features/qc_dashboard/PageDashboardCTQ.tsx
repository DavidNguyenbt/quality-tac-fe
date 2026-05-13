import { Box, Divider, Grid } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { useApiGet } from '@/hooks/app/useApiGet';
import { CTQ, getCTQDashboard } from '@/network/urls/qc_dashboard';
import { GridToolbarDatePicker } from '@/components/DataGrid/GridToolbarDatePicker';
import { ScreenLoaderBackdrop } from '@/components/Loading/ScreenLoaderBackdrop';
import { useGetAllFactory } from '@/hooks/feature_qc_dashboard/useGetAllFactory';
import ChartFilter from './components/form/ChartFilter';
import { useParams } from 'react-router-dom';
import CTQChart from './components/CTQChart';
import CTQDefectChart from './components/CTQDefectChart';
import ChartMultiFilter from './components/form/ChartMultiFilter';

const formatDateYYYYMMDD = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}${m}${d}`;
};

export const PageDashboardCTQ = () => {
    const { id } = useParams();
    const parsedId = Number(id);
    const {
        groupedFactory,
        lines,
        form,
        handleFactoryChange,
        handleLineChange
    } = useGetAllFactory();
    const [ctq, setCTQ] = useState<CTQ[]>([]);
    const today = new Date();
    const [date, setDate] = useState({
        startDate: new Date(today.getFullYear(), today.getMonth(), 1),
        endDate: today,
    });
    const { data, isLoading } = useApiGet<CTQ[]>(
        ['ctq-dashboard', form.selectedFactory, form.selectedLines, date, parsedId],
        () =>
            getCTQDashboard({
                fac: 'TC',//form.selectedFactory,
                line: form.selectedLines,
                date_from: formatDateYYYYMMDD(date.startDate),
                date_to: formatDateYYYYMMDD(date.endDate),
                url: Number(parsedId)
            }),
        {
            enabled:
                !!form.selectedFactory &&
                form.selectedLines.length > 0 &&
                parsedId != 0,
        }
    );

    useEffect(() => {
        if (data) {
            setCTQ(data);
        }
    }, [data]);
    return (
        <Box sx={{ width: '100%', overflowX: 'auto', overflowY: 'scroll' }}>
            <ScreenLoaderBackdrop
                open={isLoading}
            />
            <Box
                display={'flex'}
                justifyContent={'flex-end'}
                alignItems={"center"}
            >
                <Box
                    display="flex"
                    justifyContent="flex-end"
                    alignItems="flex-end"
                    gap={2}
                    mb={2}
                    mt={1}
                >
                    <Box sx={{ width: '170px' }}>
                        <ChartFilter
                            label="Factory"
                            options={groupedFactory.map(f => f.factoryName)}
                            value={
                                form.selectedFactory
                                    ? groupedFactory.find(f => f.factory === form.selectedFactory)?.factoryName || null
                                    : null
                            }
                            onChange={(v) => {
                                const fac = groupedFactory.find(f => f.factoryName === v)?.factory || null;
                                handleFactoryChange(fac || '');
                            }}
                        />
                    </Box>
                    <Box sx={{ width: '200px' }}>
                        {/* <ChartFilter
                            label="Line"
                            options={lines.map(l => l.label)}
                            value={form.selectedLine || null}
                            onChange={(v) => handleLineChange(v || '')}
                        /> */}
                        <ChartMultiFilter
                            label="Line"
                            options={lines.map(l => l.label)}
                            value={form.selectedLines}
                            onChange={handleLineChange}
                        />
                    </Box>
                    <GridToolbarDatePicker date={date} setdate={setDate} />
                </Box>
            </Box>
            {parsedId == 99 ? (
                <Grid container>
                    <Grid item xs={12} md={12}>
                        <CTQChart data={ctq} type={99} />
                    </Grid>
                    <Grid container spacing={2} sx={{ mt: 5 }}>
                        <Grid item xs={12} md={5.9}>
                            <CTQDefectChart data={ctq} type="CTQ" />
                        </Grid>

                        <Grid item md={0.2} sx={{ display: { xs: 'none', md: 'flex' } }}>
                            <Divider orientation="vertical" flexItem sx={{ borderColor: (theme)=> theme.color.background.o5}} />
                        </Grid>

                        <Grid item xs={12} md={5.9}>
                            <CTQDefectChart data={ctq} type="CTP" />
                        </Grid>
                    </Grid>
                </Grid>
            ) : (
                <Grid container>
                    <Grid item xs={12} md={8.5}>
                        <CTQChart data={ctq} />
                    </Grid>
                    <Grid item xs={12} md={3.5}>
                        <CTQDefectChart data={ctq} />
                    </Grid>
                </Grid>
            )}

        </Box>
    );
};