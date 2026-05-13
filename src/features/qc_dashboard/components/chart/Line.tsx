import { useTheme } from '@mui/material';
import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';
interface BarProps {
    title: string;
    chartData: number[];
    chartLabel: string[];

}

const Line: React.FC<BarProps> = ({ title, chartData, chartLabel }) => {
    const theme = useTheme();
    const [type, setType] = useState<'horizontal' | 'vertical'>('horizontal');
    const [rotated, setRotate] = useState<number>(-45);
    useEffect(() => {
        if (chartData.length > 13) {
            setType('vertical');
            setRotate(-45);
        } if (chartData.length > 30) {
            setRotate(-90);
        } else {
            setType('horizontal');
        }

    }, [chartData.length]);
    const handleChartClick = (event: MouseEvent, chartContext: any, config: any) => {
        if (config && config.dataPointIndex !== undefined) {
            const clickedLabel = chartLabel[config.dataPointIndex];
            // window.alert(clickedLabel);
        }
    };

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
                        height: 350,
                        type: 'line',
                        events: {
                            click: handleChartClick
                        }
                    },
                    dataLabels: {
                        enabled: true,
                        formatter: (val: number) => `${val}`, // hiển thị giá trị
                        style: {
                            fontSize: '12px',
                            fontWeight: "bold",
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
                    },
                    stroke: {
                        curve: 'straight',
                        width: 3
                    },
                    title: {
                        text: title,
                        align: 'center',
                        style: { fontSize: '25px', color: theme.color.text.o1 }
                    },
                    markers: {
                        size: 7,
                    },
                    grid: {
                        row: {
                            colors: ['#f3f3f3', 'transparent'],
                            opacity: 0.5
                        },
                    },
                    xaxis: {
                        categories: chartLabel,
                        tickPlacement: "between",
                        tickAmount: chartLabel.length,
                        labels: {
                            rotateAlways: true,
                            rotate: rotated,

                            style: {
                                colors: theme.color.text.o1 ?? '#000',
                                fontSize: '12px'
                            }
                        }
                    },
                    yaxis: {
                        title: {
                            // text: "123",
                            style: { color: theme.color.text.o1, fontSize: '14px' }
                        },
                        labels: {
                            formatter: (val) => {
                                return val + "";
                            },
                            style: {
                                colors: [theme.color.text.o1 ?? '#000000'],
                                fontSize: '12px'
                            }
                        }
                    },
                    tooltip: {
                        custom: ({ series, seriesIndex, dataPointIndex }) => {
                            const value = series[seriesIndex][dataPointIndex];
                            const label = chartLabel[dataPointIndex];

                            return `
                                <div style="
                                    background: ${theme.color.background.o1};
                                    color: ${theme.color.text.o1};
                                    padding: 12px;
                                    border-radius: 8px;
                                    box-shadow: 0px 4px 10px rgba(0,0,0,0.15);
                                ">
                                    <div style="
                                        font-size: 14px;
                                        font-weight: 600;
                                        margin-bottom: 4px;
                                    ">
                                        ${label}
                                    </div>
                                    <div style="font-size: 13px">
                                        Total: <b>${value}</b>
                                    </div>
                                </div>
                            `;
                        }
                    }
                }}
                series={[
                    {
                        name: 'Total',
                        data: chartData,
                    }
                ]}
                type="line"
                width={'100%'}
                height={'500'}
            />
        </div>
    );
};

export default Line;