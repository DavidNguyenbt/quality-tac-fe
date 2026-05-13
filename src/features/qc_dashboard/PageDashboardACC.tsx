import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import { Box, FormLabel, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import React, { useEffect, useState } from "react";
import dayjs, { Dayjs } from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import { useParams, useNavigate } from 'react-router-dom';
import { getDashboardNoTDecorate } from '@/network/urls/qc_dashboard';
import { ScreenLoaderBackdrop } from '@/components/Loading/ScreenLoaderBackdrop';
import Bar from './components/chart/Bar';
import DefectImg from './components/DefectImg';
import LineBar from './components/chart/LineBar';
import Pie from './components/chart/Pie';
import DefectImgSup from './components/DefectImgSup';
const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#fff' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

const PageDashboardACC: React.FC = () => {
    const { id } = useParams();
    const parsedId = Number(id);

    const dmys = dayjs().startOf('month').format('YYYY-MM-DD');
    const [startdate, setStartdate] = React.useState<Dayjs | null>(dayjs(dmys));

    const dmye = dayjs().format('YYYY-MM-DD');
    const [endate, setEndate] = React.useState<Dayjs | null>(dayjs(dmye));

    const yearstart = dayjs(startdate).format('YYYY');
    const yearend = dayjs(endate).format('YYYY');

    const [fac, setFac] = useState<string>('F2');
    const [supp, setSupp] = useState<string>('All');
    const fact = [
        { id: 'F1', name: 'Factory 1' },
        { id: 'F2', name: 'Factory 2' },
        { id: 'F3', name: 'Factory 3' },
        { id: 'F4', name: 'Factory 4' },
        { id: 'All', name: 'Factory All' },
    ]
    const facr = fact.filter(item => item.id === fac);

    const [lables, setLabels] = useState<string[]>([]);
    const [series, setSeries] = useState<number[]>([]);
    const [target1, setTarget1] = useState<number[]>([]);

    const [lablesdef, setLabelsdef] = useState<string[]>([]);
    const [datattpdef, setDatattpdef] = useState<number[]>([]);
    const [seriesdef, setSeriesdef] = useState<number[]>([]);

    const [datalist, setDatalist] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);


    const [sup, setSup] = useState<any[]>([]);
    const [title, setTitle] = useState<string>('Top 5 Defect');


    const monthendtt = dayjs(endate).format('MM');
    const monthend1tt = Number(monthendtt);
    const [mmttt, setMmttt] = useState<Number | null>(monthend1tt);
    const arrayMonth = [
        { id: 1, name: 'Jan' },
        { id: 2, name: 'Feb' },
        { id: 3, name: 'Mar' },
        { id: 4, name: 'Apr' },
        { id: 5, name: 'May' },
        { id: 6, name: 'Jun' },
        { id: 7, name: 'Jul' },
        { id: 8, name: 'Aug' },
        { id: 9, name: 'Sep' },
        { id: 10, name: 'Oct' },
        { id: 11, name: 'Nov' },
        { id: 12, name: 'Dec' },
        { id: 13, name: 'YTD' },
    ]
    const monthArray = arrayMonth.filter(item => item.id === mmttt);



    useEffect(() => {
        setLoading(true);
        loadData();
        const intervalId = window.setInterval(() => {
            loadData();

        }, 150000);
        return () => {
            clearInterval(intervalId);
        };
    }, [startdate, endate, fac, supp, parsedId]);

    const loadData = async () => {
        const startdate1 = dayjs(startdate).format('YYYY-MM-DD');
        const endate1 = dayjs(endate).format('YYYY-MM-DD');
        const monthend = dayjs(endate).format('MM');
        const monthstart = dayjs(startdate).format('MM');
        const monthend1 = Number(monthend);
        const monthstart1 = Number(monthstart);
        if (monthend1 == monthstart1) {
            setMmttt(monthend1);
        } else {
            setMmttt(13);
        }
        try {

            if (supp == 'All') {
                const seriesupp: string[] = [];
                const dataRft: number[] = [];

                const dataName: string[] = [];
                const dataTtp: number[] = [];
                const dataPer: number[] = [];
                const body = {
                    starttime: startdate1,
                    endtime: endate1,
                    fac: fac,
                    supp: supp,
                    dept: parsedId
                }
                const result = await getDashboardNoTDecorate(body);
                const response = result;

                const responeBar = response.databar;
                responeBar?.map((x: any) => {
                    seriesupp.push(x.SupCode);
                    dataRft.push(parseFloat(x.RFT));
                });
                setLabels(seriesupp);
                console.log(seriesupp);
                setSeries(dataRft);

                const responePie = response.datapie;
                responePie?.map((x: any) => {
                    dataName.push(String(x.DefectName));
                    dataTtp.push(parseFloat(x.TTP));
                    dataPer.push(parseFloat(x.Per));
                });
                setLabelsdef(dataName);
                setDatattpdef(dataTtp);
                setSeriesdef(dataPer);
                setSup(responeBar);
                setDatalist(response.datalist);
                setLoading(false);

            } else {
                const serieM: string[] = [];
                const dataRft: number[] = [];
                const dataTarget: number[] = [];

                const dataName: string[] = [];
                const dataTtp: number[] = [];
                const dataPer: number[] = [];

                const dataName1: string[] = [];
                const dataTtp1: number[] = [];
                const dataPer1: number[] = [];

                const body = {
                    starttime: startdate1,
                    endtime: endate1,
                    fac: fac,
                    supp: supp,
                    dept: parsedId
                }
                const result = await getDashboardNoTDecorate(body);
                const response = result;

                const responeBar = response.databar;
                responeBar?.map((x: any) => {
                    serieM.push(String(x.M));
                    dataTarget.push(97);
                    dataRft.push(x.RFT);
                });
                setLabels(serieM);
                setSeries(dataRft);
                setTarget1(dataTarget);

                const responePie = response.datapie;
                responePie?.map((x: any) => {
                    dataName.push(String(x.DefectName));
                    dataTtp.push(parseFloat(x.TTP));
                    dataPer.push(parseFloat(x.Per));
                });
                setLabelsdef(dataName);
                setDatattpdef(dataTtp);
                setSeriesdef(dataPer);

                setDatalist(response.datalist);

                const responePie1 = response.datapie1;
                responePie1?.map((x: any) => {
                    dataName1.push(String(x.DefectName));
                    dataTtp1.push(parseFloat(x.TTP));
                    dataPer1.push(parseFloat(x.Per));
                });

                setLoading(false);

            }

        } catch (e) {
            setLoading(false);
            console.log(e);
        }
    };


    const handleChange = (text: string) => {
        setSupp(text);
    };

    const handleChangeDate = (start: Dayjs | null, end: Dayjs | null) => {
        setStartdate(start);
        setEndate(end);
    };
    return (
        <Box
            sx={{ flexGrow: 1 }}
        >
            <ScreenLoaderBackdrop open={loading} />
            {!loading && (

                <Box
                    sx={{ flexGrow: 1 }}
                >

                    <Grid container spacing={2} alignItems="center">
                        {/* Tiêu đề */}
                        <Grid item xs={6}>
                            <Typography variant="h5" fontWeight="bold" sx={{ color: (theme) => theme.color.text.o1 }}>
                                RFT & Top 5 Defect
                            </Typography>
                        </Grid>

                        {/* Supplier */}
                        <Grid item xs={12} md={1.5}>
                            <FormControl fullWidth size="small">
                                <FormLabel sx={{ color: (theme) => theme.color.text.o5 }}>Supplier</FormLabel>
                                <Select
                                    value={supp}
                                    onChange={(e) => setSupp(e.target.value)}
                                >
                                    <MenuItem value="All">ALL</MenuItem>
                                    {sup.map((x) => (
                                        <MenuItem key={x.SupCode} value={x.SupCode}>
                                            {x.SupCode}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        {/* Factory */}
                        <Grid item xs={12} md={1.5}>
                            <FormControl fullWidth size="small">
                                <FormLabel sx={{ color: (theme) => theme.color.text.o5 }}>Factory</FormLabel>
                                <Select
                                    value={fac}
                                    onChange={(e) => setFac(e.target.value)}
                                >
                                    <MenuItem value="F1">Factory 1</MenuItem>
                                    <MenuItem value="F2">Factory 2</MenuItem>
                                    <MenuItem value="F3">Factory 3</MenuItem>
                                    <MenuItem value="F4">Factory 4</MenuItem>
                                    <MenuItem value="All">Factory All</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        {/* Start Date */}
                        <Grid item xs={12} md={1.5}>
                            <FormControl fullWidth size="small">
                                <FormLabel sx={{ color: (theme) => theme.color.text.o5 }}>Start Date</FormLabel>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DatePicker
                                        slotProps={{ textField: { size: 'small' } }}
                                        value={startdate}
                                        format="DD/MM/YYYY"
                                        onChange={(newValue) => setStartdate(newValue)}
                                    />
                                </LocalizationProvider>
                            </FormControl>
                        </Grid>

                        {/* End Date */}
                        <Grid item xs={12} md={1.5}>
                            <FormControl fullWidth size="small">
                                <FormLabel sx={{ color: (theme) => theme.color.text.o5 }}>End Date</FormLabel>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DatePicker
                                        slotProps={{ textField: { size: 'small' } }}
                                        value={endate}
                                        format="DD/MM/YYYY"
                                        onChange={(newValue) => setEndate(newValue)}
                                    />
                                </LocalizationProvider>
                            </FormControl>
                        </Grid>
                    </Grid>
                    <br></br>

                    {supp === "All" ? (
                        <>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <>
                                        <Typography
                                            align="center"
                                            sx={{ color: (theme) => theme.color.text.o1, fontSize: '14px', fontWeight: 700 }}
                                        >
                                            {facr[0].name} - ACC inspection RFT % - {yearstart}
                                        </Typography>
                                        <Bar chartData={series} chartLabel={lables} handleChange={handleChange} />
                                    </>
                                </Grid>

                                <Grid item xs={12} >
                                    <Grid container spacing={2}>
                                        <DefectImg datalist={datalist} />
                                    </Grid>
                                </Grid>
                            </Grid>

                        </>
                    ) : <>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={7}>
                                <>
                                    <Typography
                                        align="center"
                                        sx={{ color: (theme) => theme.color.text.o1, fontSize: '14px', fontWeight: 700 }}
                                    >
                                        {facr[0].name} - {supp} - {yearstart}
                                    </Typography>
                                    <LineBar chartData={series} chartLabel={lables} target1={target1} rft={100} target={100} titleTarget={97} yearstart={yearstart} yearend={yearend} handleChange={handleChangeDate} />
                                </>
                            </Grid>
                            <Grid item xs={12} md={5}>
                                <>
                                    <Typography
                                        align="center"
                                        sx={{ color: (theme) => theme.color.text.o1, fontSize: '14px', fontWeight: 700 }}
                                    >
                                        {title} - {monthArray[0].name}
                                    </Typography>
                                    <Pie chartData={seriesdef} chartLabel={lablesdef} datattpdef={datattpdef} />
                                </>
                            </Grid>
                            <Grid item xs={12} >
                                <Grid container spacing={2}>
                                    <DefectImgSup datalist={datalist} />
                                </Grid>

                            </Grid>
                        </Grid>

                    </>}
                </Box >
            )}
        </Box >
    );
};


export default PageDashboardACC;