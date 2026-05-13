import { useTheme } from '@mui/material';
import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';

interface PieProps {
    chartData: number[];
    chartLabel: string[];
    datattpdef: number[];
}

const Pie: React.FC<PieProps> = ({ chartData, chartLabel, datattpdef }) => {
    const theme = useTheme();
    const labelsWithPercentage = chartLabel.map((label, index) => `${label} - ${datattpdef[index]} -  ${chartData[index]}%`);

    return (
        <div>
            <Chart
                options={{
                    chart: {
                        events: {
                            dataPointSelection: (event, chartContext, config) => {
                                const s = config.w.config.labels[config.dataPointIndex];
                                const r = s.split('-');
                                console.log(r[0]);
                            }
                        }
                    },
                    noData: {
                        text: 'Empty Data',
                        style: {
                            color: theme.color.text.o1,
                            fontSize: '14px',
                        }
                    },
                    labels: labelsWithPercentage,
                    title: {
                        style: { fontSize: '25px', color: theme.color.text.o1 }
                    },
                    legend: {
                        position: 'bottom',
                        labels: {
                            colors: chartLabel.map(() => theme.color.text.o1 ?? '#000'),
                            useSeriesColors: false,
                        }
                    },
                    colors: ['#1976d2', '#DC143C', '#33CC66', '#CC33CC', '#33CCFF'],

                    dataLabels: {
                        enabled: true,
                        textAnchor: 'middle',
                        formatter(val: number, opts: any) {
                            return val.toFixed(2) + '%';
                        },
                    },
                    tooltip: {
                        y: {
                            formatter: (val: number) => {
                                return '';
                            },
                            title: {
                                formatter: (seriesName) => {  // Chỉnh sửa kiểu dữ liệu của seriesName
                                    const r = seriesName.split('-');
                                    return r[0] + r[1];
                                },
                            },
                        },
                    },
                }}
                series={chartData}
                type="pie"
                width={'100%'}
                // height={windowHeight-370}
                height={400}
            />
        </div>
    );
};

export default Pie;