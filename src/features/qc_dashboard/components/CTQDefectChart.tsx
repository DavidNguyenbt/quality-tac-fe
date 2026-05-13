import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Box, useTheme } from '@mui/material';
import { CTQ, getTop5Defects } from '@/network/urls/qc_dashboard';
import BaseEChart from './chart/BaseEChart';

interface CTQDefectChartProps {
    data: CTQ[];
    height?: number;
    type?: "CTQ" | "CTP";
}

const CTQDefectChart: React.FC<CTQDefectChartProps> = ({
    data,
    height = 500,
    type
}) => {
    const theme = useTheme();
    const top5Defect = useMemo(
        () => getTop5Defects(data, type),
        [data, type]
    );
    const colors = ['#5B9BD5', '#ED7D31', '#A5A5A5', '#FFC000', '#4472C4'];
    const pieData = useMemo(
        () => top5Defect.map((item, index) => ({
            name: `${item.DefectVN} (${item.DefectEN})`,
            value: item.totalDefect,
            itemStyle: {
                color: colors[index % colors.length],
                borderColor: theme.color.neutral.o1,
                borderWidth: 1
            }
        })),
        [top5Defect]
    );
    const gridRef = useRef<HTMLDivElement | null>(null);
    const [width, setWidth] = useState(0);

    useEffect(() => {
        if (!gridRef.current) return;

        const observer = new ResizeObserver(entries => {
            const entry = entries[0];
            setWidth(entry.contentRect.width);
        });

        observer.observe(gridRef.current);

        return () => observer.disconnect();
    }, []);
    const labelType = type && type.trim() ? type : 'CTQ';
    const option = {
        title: {
            text: `Top 5 ${labelType} Defect`,
            left: 'center',
            top: 0,
            textStyle: {
                fontSize: 16,
                fontWeight: 600,
                color: theme.color.text.o1
            }
        },
        tooltip: {
            trigger: 'item',
            renderMode: 'html',
            appendToBody: true,
            confine: false,

            backgroundColor: 'transparent',
            borderWidth: 0,
            borderColor: 'transparent',
            padding: 0,

            extraCssText: `
        z-index: 9999999;
        pointer-events: none;
        box-shadow: none;
    `,

            textStyle: {
                fontFamily: 'Inter, Roboto, "Helvetica Neue", Arial, sans-serif',
                fontSize: 12,
                color: theme.color.text.o1,
                lineHeight: 18,
            },

            formatter: (params: any) => {
                return `
            <div style="
                background:${theme.color.background.o1};
                color:${theme.color.text.o1};
                border-radius:8px;
                padding:8px 12px;
                font-size:12px;
                box-shadow:0 2px 8px rgba(0,0,0,0.12);
            ">
                <div style="font-weight:600;margin-bottom:4px">
                    ${params.name}
                </div>
                <div>
                    Qty: <b>${params.value}</b>
                </div>
                <div>
                    Rate: <b>${params.percent}%</b>
                </div>
            </div>
        `;
            }
        },
        legend: {
            orient: 'horizontal',
            bottom: 0,
            left: 'center',
            itemGap: 12,
            textStyle: {
                fontFamily: 'Inter, Roboto, "Helvetica Neue", Arial, sans-serif',
                fontSize: 11,
                color: theme.color.text.o1,
                lineHeight: 16
            },
            data: pieData.map(item => item.name)
        },
        series: [
            {
                name: 'Defect',
                type: 'pie',
                radius: '50%',
                data: pieData,
                center: ['50%', '45%'],
                labelLine: {
                    show: true,
                    length: 15,
                    length2: 10
                },
                label: {
                    show: true,
                    position: 'outside',
                    formatter: '{c} ({d}%)',
                }
            }
        ]
    };

    return (
        <>
            <Box ref={gridRef}>
                <BaseEChart option={option} height={height} />
            </Box>
        </>
    );
};

export default CTQDefectChart;
