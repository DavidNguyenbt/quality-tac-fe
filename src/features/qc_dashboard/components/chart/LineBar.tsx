import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';
import dayjs, { Dayjs } from 'dayjs';
import { useTheme } from '@mui/material';
interface LineBarProps {
    chartData: number[];
    chartLabel: string[];
    target1: any[];
    rft: number;
    target: number;
    titleTarget: number;
    yearstart: string;
    yearend: string;
    handleChange: (selectedValue: Dayjs | null, selectedValue1: Dayjs | null) => void;
    height?: any;
}
const normalizeChartDataWithTarget = (labels: string[], data: number[], targetData: number[], defaultTarget = 0) => {
    const allMonths = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

    const dataMap: Record<string, number> = {};
    labels.forEach((label, idx) => {
        dataMap[label] = data[idx];
    });

    const targetMap: Record<string, number> = {};
    labels.forEach((label, idx) => {
        targetMap[label] = targetData[idx] ?? defaultTarget;
    });

    const sortedLabels: string[] = [];
    const sortedData: number[] = [];
    const sortedTarget: number[] = [];

    allMonths.forEach(month => {
        sortedLabels.push(month);
        sortedData.push(dataMap[month] ?? 0);
        sortedTarget.push(targetMap[month] ?? defaultTarget);
    });

    // thêm các giá trị đặc biệt (YTD)
    labels.forEach(label => {
        if (!allMonths.includes(label)) {
            sortedLabels.push(label);
            sortedData.push(dataMap[label]);
            sortedTarget.push(targetMap[label] ?? defaultTarget);
        }
    });

    return { sortedLabels, sortedData, sortedTarget };
};

const LineBar: React.FC<LineBarProps> = ({ chartData, chartLabel, target1, rft, target, titleTarget, yearstart, yearend, handleChange, height }) => {
    const theme = useTheme();
    const [title, setTitle] = useState<string>('AQL Defect Rate');
    useEffect(() => {
        if (titleTarget === 0.6) {
            setTitle('AQL Defect Rate');
        } else {
            setTitle('RFT');
        }

    }, [chartData.length]);
    const handleChartClick = (event: MouseEvent, chartContext: any, config: any) => {
        if (config && config.dataPointIndex !== undefined) {
            const clickedLabel = sortedLabels[config.dataPointIndex]; // dùng sortedLabels
            const clickedValue = sortedData[config.dataPointIndex];   // dùng sortedData

            // Nếu là YTD hoặc giá trị = 0 thì không click
            if (clickedLabel === 'YTD' || clickedValue === 0) return;

            const monthIndex = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"].indexOf(clickedLabel);
            if (monthIndex !== -1 && yearstart) {
                const year = Number(yearstart);
                const startDate = dayjs().year(year).month(monthIndex).startOf('month');
                const endDate = startDate.clone().endOf('month');
                handleChange(startDate, endDate);
            }
        }
    };
    const { sortedLabels, sortedData, sortedTarget } = normalizeChartDataWithTarget(chartLabel, chartData, target1, titleTarget);
    return (
        <div>
            <Chart
                options={{
                    legend: {
                        labels: {
                            colors: [theme.color.text.o1 ?? '#000000', theme.color.text.o1 ?? '#000000'],
                            useSeriesColors: false,
                        }
                    },
                    noData: {
                        text: 'Empty Data',
                        style: {
                            color: theme.color.text.o1,
                            fontSize: '14px',
                        }
                    },
                    chart: {
                        type: 'line',
                        events: {
                            click: handleChartClick
                        },
                        toolbar: {
                            show: false,
                        }
                    },
                    stroke: {
                        width: [0, 3]
                    },
                    dataLabels: {
                        enabled: true,
                        enabledOnSeries: [0],
                        style: {
                            fontSize: '10px',
                            colors: [theme.color.text.o1],
                        },

                        background: {
                            enabled: true,
                            foreColor: theme.color.text.o1,
                            borderRadius: 0,
                            borderColor: 'none',
                            opacity: 0,
                        },
                        offsetY: -10,
                        formatter: function (val: number) {
                            return val + "%";
                        },
                    },
                    labels: sortedLabels,
                    xaxis: {
                        type: 'category',
                        labels: {
                            style: {
                                colors: sortedLabels.map(() => theme.color.text.o1 ?? '#000'),
                                fontSize: '12px'
                            }
                        }
                    },
                    yaxis: [{
                        min: 0, // Giá trị tối thiểu của trục y
                        max: rft, // Giá trị tối đa của trục y
                        title: {
                            text: 'RFT',
                            style: { color: theme.color.text.o1, fontSize: '14px' }
                        },
                        labels: {
                            style: {
                                colors: sortedLabels.map(() => theme.color.text.o1 ?? '#000'),
                                fontSize: '12px'
                            }
                        },
                        axisBorder: {
                            show: true,
                            color: theme.color.text.o1
                        },
                    }, {
                        min: 0, // Giá trị tối thiểu của trục y
                        max: target, // Giá trị tối đa của trục y
                        opposite: true,
                        title: {
                            text: 'Target',
                            style: { color: theme.color.text.o1, fontSize: '14px' }
                        },
                        labels: {
                            style: {
                                colors: chartLabel.map(() => theme.color.text.o1 ?? '#000'),
                                fontSize: '12px'
                            }
                        }
                    }],
                    plotOptions: {
                        bar: {
                            columnWidth: '70%',
                            horizontal: false,
                            dataLabels: {
                                position: 'top',

                            }
                        },
                    },
                }}
                series={[{
                    name: title,
                    type: 'bar',
                    data: sortedData,
                    color: '#1976d2',
                }, {
                    name: 'Target - ' + titleTarget + '%',
                    type: 'line',
                    data: sortedTarget,
                    color: "#FF1654",

                }]}
                type="line"
                width={'100%'}
                // height={windowHeight-417}
                height={height ? height : 385}
            />
        </div>
    );
};

export default LineBar;