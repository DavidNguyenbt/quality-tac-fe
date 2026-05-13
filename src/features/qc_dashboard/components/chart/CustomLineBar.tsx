import React, { useMemo, useState } from 'react';
import Chart from 'react-apexcharts';
import { Box, Button, Typography, useTheme } from '@mui/material';
import { ApexOptions } from 'apexcharts';
import { CTQ, groupCTQData } from '@/network/urls/qc_dashboard';

const wrapText = (text: string, maxLen = 18): string[] => {
    const words = text.split(' ');
    const lines: string[] = [];
    let current = '';

    for (let i = 0; i < words.length; i++) {
        const word = words[i];

        if ((current + ' ' + word).trim().length <= maxLen) {
            current = (current ? current + ' ' : '') + word;
        } else {
            lines.push(current);
            current = word;

            if (lines.length === 2) break;
        }
    }

    if (lines.length < 2 && current) {
        lines.push(current);
    }

    const usedWords = lines.join(' ').split(' ').length;
    const hasMore = usedWords < words.length;

    if (hasMore && lines.length === 2) {
        let line2 = lines[1];

        if (line2.length > maxLen - 3) {
            line2 = line2.slice(0, maxLen - 3).trim();
        }

        lines[1] = line2 + '...';
    }

    return lines;
};

interface CustomLineBarProps {
    data: CTQ[];
    height?: number;
}

const CustomLineBar: React.FC<CustomLineBarProps> = ({ data, height = 480 }) => {
    const theme = useTheme();
    const groupedData = groupCTQData(data);

    const PAGE_SIZE = 10;
    const [page, setPage] = useState(1);

    const totalPages = Math.ceil(groupedData.length / PAGE_SIZE);

    const pagedData = useMemo(() => {
        const start = (page - 1) * PAGE_SIZE;
        return groupedData.slice(start, start + PAGE_SIZE);
    }, [groupedData, page]);


    const categories = pagedData.map(d => [
        ...wrapText(d.OPERATION, 18),
        '',
        '',
        d.STYLE_NO,
        '',
        d.LINEST
    ]);

    const qtyData = pagedData.map(d => d.SUM_DEFECT);
    const targetData = pagedData.map(d => d.AVG_DEFECT_RATE);

    const qtyMax = Math.max(...qtyData);
    const qtyYAxisMax = Math.ceil(qtyMax * 1.2);
    const options: ApexOptions = {
        legend: {
            labels: {
                colors: [theme.color.text.o1 ?? '#000000', theme.color.text.o1 ?? '#000000'],
                useSeriesColors: false,
            },
            itemMargin: {
                horizontal: 20,
                vertical: 15,
            }
        },
        // title: {
        //     text: 'CTQ Defect',
        //     align: 'center',
        //     style: { fontSize: '25px', color: theme.color.text.o1 }
        // },
        chart: {
            stacked: false,
            toolbar: { show: true },
        },
        stroke: {
            width: [0, 3],
            curve: 'straight',
        },

        markers: {
            size: [0, 6],
        },

        xaxis: {
            categories,
            tickPlacement: "between",
            labels: {
                rotate: 0,
                style: {
                    fontSize: '12px',
                    colors: theme.color.text.o1,
                },
                trim: false,
                maxHeight: 120,
                hideOverlappingLabels: false,
            },
        },

        plotOptions: {
            bar: {
                columnWidth: '45%',
                dataLabels: {
                    position: 'center',
                },
            },
        },

        dataLabels: {
            enabled: true,
            formatter: (val: number, opts) => {
                if (opts.seriesIndex === 0) {
                    return val;
                }
                if (opts.seriesIndex === 1) {
                    return `${val}%`;
                }
                return '';
            },
            style: {
                fontSize: '12px',
                fontWeight: "bold",
                colors: ['#ffffff', theme.color.text.o4],
            },
            background: {
                enabled: false,
                foreColor: theme.color.text.o1,
                borderRadius: 0,
                borderColor: 'none',
                opacity: 0,
            },
            offsetY: -10,
        },

        yaxis: [
            {
                min: 0,
                max: qtyYAxisMax,
                title: {
                    text: 'Defect',
                    style: { color: theme.color.text.o1 },
                },
                labels: {
                    style: {
                        colors: theme.color.text.o1,
                    },
                },
            },
            {
                opposite: true,
                min: 0,
                max: 100,
                tickAmount: 5,
                title: {
                    text: 'Target (%)',
                    style: { color: theme.color.text.o1 },
                },
                labels: {
                    formatter: (val: number) => `${val}%`,
                    style: {
                        colors: theme.color.text.o1,
                    },
                },
            },
        ],

        tooltip: {
            shared: true,
            intersect: false,
            custom: ({ dataPointIndex }) => {
                const group = pagedData[dataPointIndex];
                if (!group) return '';

                const label = group.OPERATION;
                const qty = group.SUM_TOTAL_QTY;
                const defect = group.SUM_DEFECT;
                const rate = group.AVG_DEFECT_RATE;

                const defectList = group.children
                    .map(item => `
                            <div style="font-size: 11px; margin-left: 8px;">
                                • ${item.DefectEN} </br> (${item.DefectVN}): 
                                <b>${item.DEFECT}</b>
                            </div>
                        `)
                    .join('');

                return `
                        <div style="
                            background: ${theme.color.background.o1};
                            color: ${theme.color.text.o1};
                            padding: 10px;
                            border-radius: 6px;
                            box-shadow: 0 2px 6px rgba(0,0,0,0.15);
                            width: 320px;
                        ">
                            <div style="
                                font-size: 12px;
                                font-weight: 600;
                                margin-top: 6px;
                                white-space: normal;
                                word-break: break-word;
                                overflow-wrap: anywhere;
                            ">
                                ${label}
                            </div>
                            <div style="font-size: 12px;">
                                Qty: <b>${qty}</b>
                            </div>
                            <div style="font-size: 12px;">
                                Defect: <b>${defect}</b>
                            </div>
                            <div style="font-size: 12px; margin-bottom: 6px;">
                                Defect Rate: <b>${rate}%</b>
                            </div>

                            <div style="font-size: 12px; font-weight: 600; margin-top: 6px;">
                                Defect Detail
                            </div>
                            ${defectList}
                        </div>
                    `;
            },
        }
    }
    return (
        <Box>
            <Chart
                height={height}
                type="line"
                series={[
                    {
                        name: 'Defect',
                        type: 'bar',
                        data: qtyData,
                        color: theme.color.text.o3,
                    },
                    {
                        name: 'Defect Rate (%)',
                        type: 'line',
                        data: targetData,
                        color: theme.color.text.o4,
                    },
                ]}
                options={options}
            />
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                <Button
                    variant="outlined"
                    size="small"
                    disabled={page === 1}
                    sx={{ width: '100px' }}
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                >
                    ◀ Prev
                </Button>

                <Typography sx={{ fontSize: 23, color: theme.color.text.o1 }}>
                    Page <b>{page}</b> / {totalPages}
                </Typography>

                <Button
                    variant="outlined"
                    size="small"
                    disabled={page === totalPages}
                    sx={{ width: '100px' }}
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                >
                    Next ▶
                </Button>
            </Box>
        </Box>

    );
};

export default CustomLineBar;
