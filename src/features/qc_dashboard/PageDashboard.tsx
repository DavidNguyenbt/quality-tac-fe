import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import { Box, FormLabel, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import React, { useEffect, useState } from "react";
import Dialog from '@mui/material/Dialog';
import dayjs, { Dayjs } from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import { useParams, useNavigate } from 'react-router-dom';
import { Tooltip } from "@mui/material";
import LineBar from './components/chart/LineBar';
import Pie from './components/chart/Pie';
import DefectImgDecorate from './components/DefectImgDecorate';
import { getAllDepartment, getDashboardDecorate } from '@/network/urls/qc_dashboard';
import { ScreenLoaderBackdrop } from '@/components/Loading/ScreenLoaderBackdrop';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#fff' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));
interface SubconItem {
    id: number;
    department: string;
    // Add other properties if needed
}
const PageDashboard: React.FC = () => {
    const { id } = useParams();
    const parsedId = Number(id);

    const [fac, setFac] = useState<string>('F2');
    const fact = [
        { id: 'F1', name: 'Factory 1' },
        { id: 'F2', name: 'Factory 2' },
        { id: 'F3', name: 'Factory 3' },
        { id: 'F4', name: 'Factory 4' },
        { id: 'All', name: 'Factory All' },
    ]
    const facr = fact.filter(item => item.id === fac);

    const dmys = dayjs().startOf('month').format('YYYY-MM-DD');
    const [startdate, setStartdate] = useState<Dayjs | null>(dayjs(dmys));

    const dmye = dayjs().format('YYYY-MM-DD');
    const [endate, setEndate] = useState<Dayjs | null>(dayjs(dmye));

    const yearstart = dayjs(startdate).format('YYYY');
    const yearend = dayjs(endate).format('YYYY');


    const monthfrom = dayjs(startdate).format('MM');
    const monthfrom1 = Number(monthfrom);

    const monthto = dayjs(endate).format('MM');
    const monthto1 = Number(monthto);

    const [charts, setCharts] = useState<string[]>([]);
    const [datas, setDatas] = useState<number[]>([]);

    const [chartLines, setChartLines] = useState<string[]>([]);
    const [dataLines, setDataLines] = useState<number[]>([]);

    const [target1, setTarget1] = useState<number[]>([]);
    const [chartsdef, setChartsdef] = useState<string[]>([]);
    const [datasdef, setDatasdef] = useState<number[]>([]);
    const [def, setDef] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [datattpdef, setDatattpdef] = useState<number[]>([]);

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
    const monthArraystart = arrayMonth.filter(item => item.id === monthfrom1);
    const monthArrayend = arrayMonth.filter(item => item.id === monthto1);

    const [arrayTitle, setArrayTitle] = useState<any[]>([]);
    const filteredArray = arrayTitle.filter(item => item.id === parsedId);


    useEffect(() => {
        setLoading(true);
        fetchData();
        loadData();
        // loadDataLine();
        const intervalId = window.setInterval(() => {
            loadData();

        }, 150000);
        return () => {
            clearInterval(intervalId);
        };
    }, [startdate, endate, fac, parsedId]);

    const fetchData = async () => {
        const startdate1 = dayjs(startdate).format('YYYY-MM-DD');
        const endate1 = dayjs(endate).format('YYYY-MM-DD');

        try {
            const response = await getAllDepartment();
            const subconData: SubconItem[] = response.subcon || [];

            // Map the API data to sublist items
            const updatedSublist = subconData.map(item => ({
                id: item.id,
                name: item.department,
                titlePie: `Top 5 Defect ${item.department} (%) - ${monthfrom1 == monthto1 ? `${monthArraystart[0].name}` : `${monthArraystart[0].name}-${monthArrayend[0].name}`}`,
                titleLineBar: `${facr[0].name} - ${item.department} inspection RFT % - ${yearstart}`,
                rft: item.id == 10 ? 1 : 100,
                target: item.id == 10 ? 1 : 100,
                titleTarget: item.id == 10 ? 0.6 : 97,
            }));

            setArrayTitle(updatedSublist);
        } catch (error) {
            console.error('Lỗi khi lấy dữ liệu:', error);
        }
    };

    const loadData = async () => {
        const startdate1 = dayjs(startdate).format('YYYY-MM-DD');
        const endate1 = dayjs(endate).format('YYYY-MM-DD');
        try {
            const chartpie: string[] = [];
            const datapie1: number[] = [];
            const dataTtp: number[] = [];
            const chartbar: string[] = [];
            const databar1: number[] = [];
            const datatarget: number[] = [];

            const body = {
                fac: fac,
                starttime: startdate1,
                endtime: endate1,
                dept: parsedId
            }
            const result = await getDashboardDecorate(body);
            const response = result;

            const responeBar = response.datalinebar;
            responeBar?.map((x: any) => {
                chartbar.push(x.TransMonth);
                databar1.push(parseFloat(x.RFT));
                datatarget.push(parseFloat(x.target));
            });

            const responePie = response.datapie;
            responePie?.map((x: any) => {
                chartpie.push(String(x.DefectName));
                dataTtp.push(parseFloat(x.TTP));
                datapie1.push(parseFloat(x.Per));
            });
            setCharts(chartbar);
            setDatas(databar1);
            setTarget1(datatarget);

            setChartsdef(chartpie);
            setDatasdef(datapie1);
            setDatattpdef(dataTtp);

            setDef(responePie);
            setLoading(false);

        } catch (e) {
            setLoading(false);
            console.log(e);
        }
    };

    const loadDataLine = async () => {

        const startdate1 = dayjs(startdate).format('YYYY-MM-DD');
        const endate1 = dayjs(endate).format('YYYY-MM-DD');
        try {
            const chartline: string[] = [];
            const dataline: number[] = [];

            const body = {
                fac: fac,
                starttime: startdate1,
                endtime: endate1,
                dept: parsedId
            }
            const result = await getDashboardDecorate(body);
            const response = result;

            const responeLine = response.line;
            responeLine?.map((x: any) => {
                chartline.push(x.Date);
                dataline.push(parseFloat(x.Eff));
            });

            setChartLines(chartline);
            setDataLines(dataline);
            setLoading(false);


        } catch (e) {
            setLoading(false);
            console.log(e);
        }
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
                <>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={7}>
                            <Typography variant="h5" fontWeight="bold" sx={{ color: (theme) => theme.color.text.o1 }}>
                                RFT & Top 5 Defect
                            </Typography>
                        </Grid>

                        <Grid item xs={12} md={2}>
                            <FormControl fullWidth size="small">
                                <FormLabel sx={{ color: (theme) => theme.color.text.o5 }}>Factory</FormLabel>
                                <Select
                                    value={fac}
                                    onChange={(e) => setFac(e.target.value)}
                                >
                                    <MenuItem value={'F1'}>Factory 1</MenuItem>
                                    <MenuItem value={'F2'}>Factory 2</MenuItem>
                                    <MenuItem value={'F3'}>Factory 3</MenuItem>
                                    <MenuItem value={'F4'}>Factory 4</MenuItem>
                                    <MenuItem value={'All'}>Factory All</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

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
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={7}>
                            {filteredArray.length > 0 && (
                                // <Item sx={{ backgroundColor: (theme) => theme.color.background.o1 }}>
                                <>
                                    <Typography
                                        align="center"
                                        sx={{ color: (theme) => theme.color.text.o1, fontSize: '14px', fontWeight: 700 }}
                                    >
                                        {filteredArray[0].titleLineBar}
                                    </Typography>
                                    <LineBar chartData={datas} chartLabel={charts} target1={target1} rft={filteredArray[0].rft} target={filteredArray[0].target} titleTarget={filteredArray[0].titleTarget} yearstart={yearstart} yearend={yearend} handleChange={handleChangeDate} />
                                </>
                                // </Item>
                            )}
                        </Grid>
                        <Grid item xs={12} md={5}>
                            {filteredArray.length > 0 && (
                                <>
                                    <Typography
                                        align="center"
                                        sx={{ color: (theme) => theme.color.text.o1, fontSize: '14px', fontWeight: 700 }}
                                    >
                                        {filteredArray[0].titlePie}
                                    </Typography>
                                    <Pie chartData={datasdef} chartLabel={chartsdef} datattpdef={datattpdef} />
                                </>
                            )}
                        </Grid>
                        <Grid item xs={12} >
                            <Grid container spacing={2}>
                                <DefectImgDecorate datalist={def} />
                            </Grid>
                        </Grid>
                    </Grid>
                    <br></br>
                </>
            )}

        </Box >
    );
};


export default PageDashboard;