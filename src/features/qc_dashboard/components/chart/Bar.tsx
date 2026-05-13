import { useTheme } from '@mui/material';
import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';
interface BarProps {
    chartData: number[];
    chartLabel: string[];
    handleChange: (selectedValue: string) => void;
}

const Bar: React.FC<BarProps> = ({ chartData, chartLabel, handleChange }) => {
    const theme = useTheme();
    const [type, setType] = useState<'horizontal' | 'vertical'>('horizontal');
    const [rotated, setRotate] = useState<number>(-45);
    useEffect(() => {
        if (chartData.length > 13) {
            setType('vertical');
            setRotate(-70);
        } if (chartData.length > 23) {
            setRotate(-80);
        } else {
            setType('horizontal');
        }

    }, [chartData.length]);

    const handleChartClick = (event: MouseEvent, chartContext: any, config: any) => {
        if (config && config.dataPointIndex !== undefined) {
            const clickedLabel = chartLabel[config.dataPointIndex];
            console.log('Clicked Label:', clickedLabel);
            handleChange(clickedLabel);
        }
    };

    return (
        <div>

            <Chart
                options={{
                    chart: {
                        id: 'apexchart-example',
                        events: {
                            click: handleChartClick
                        },
                        toolbar: {
                            show: false,
                        }
                    },
                    noData: {
                        text: 'Empty Data',
                        style: {
                            color: theme.color.text.o1,
                            fontSize: '14px',
                        }
                    },
                    xaxis: {
                        categories: chartLabel,
                        labels: {
                            rotate: rotated,
                            maxHeight: 200,
                            style: {
                                colors: chartLabel.map(() => theme.color.text.o1 ?? '#000'),
                                fontSize: '12px'
                            }
                        }
                    },
                    yaxis: {
                        max: 110, // Giá trị tối đa trên trục y
                        // Các cài đặt khác của trục y
                        axisBorder: {
                            show: false
                        },
                        axisTicks: {
                            show: false,
                        },
                        labels: {
                            show: false,
                            formatter: function (val) {
                                return val + "%";
                            },
                            style: {
                                colors: chartLabel.map(() => theme.color.text.o1 ?? '#000'),
                                fontSize: '12px'
                            }
                        }
                    },
                    title: {
                        floating: true,
                        offsetY: 0,
                        align: 'center',
                        style: {
                            color: '#444',
                            fontSize: '25px'
                        }
                    },
                    dataLabels: {
                        enabled: true,
                        formatter: function (val: number) {
                            return val === 0 ? '' : val + "%";
                        },
                        offsetY: -20,
                        style: {
                            fontSize: '11px',
                            colors: [theme.color.text.o1],
                        },
                    },
                    colors: ['#33CC66'],
                    plotOptions: {
                        bar: {
                            columnWidth: '50%',
                            dataLabels: {
                                orientation: type,
                                position: 'top' // bottom/center/top

                            }
                        }
                    },
                    responsive: [{
                        breakpoint: 480,
                        options: {
                            legend: {
                                position: 'bottom',
                                offsetX: -10,
                                offsetY: 0
                            }
                        }
                    }],
                }}
                series={[{
                    name: 'RFT(%)',
                    data: chartData, // Sử dụng chartData trực tiếp, không cần bọc nó trong một object { chartData }

                }]}
                type="bar"
                width={'100%'}
                // height={windowHeight-417}
                height={'385'}
            />
        </div>
    );
};

export default Bar;