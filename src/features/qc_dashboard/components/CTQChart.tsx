import React, { useMemo } from 'react';
import { Box, useTheme } from '@mui/material';
import { CTQ, groupCTQData } from '@/network/urls/qc_dashboard';
import BaseEChart from './chart/BaseEChart';

const wrapText = (text: string, maxLen = 18): string[] => {
    const words = text.split(' ');
    const lines: string[] = [];
    let current = '';

    for (const word of words) {
        if ((current + ' ' + word).trim().length <= maxLen) {
            current = (current ? current + ' ' : '') + word;
        } else {
            lines.push(current);
            current = word;
            if (lines.length === 2) break;
        }
    }

    if (lines.length < 2 && current) lines.push(current);
    if (lines.length === 2 && words.length > lines.join(' ').split(' ').length) {
        lines[1] = lines[1].slice(0, maxLen - 3) + '...';
    }

    return lines;
};

interface CTQChartProps {
    data: CTQ[];
    height?: number;
    type?: number
}

const CTQChart: React.FC<CTQChartProps> = ({
    data,
    height = 500,
    type
}) => {
    const theme = useTheme();
    const groupedData = useMemo(() => groupCTQData(data), [data]);
    const categories = groupedData.map(d => {
        const lines: string[] = [];

        if (d.TYPE) lines.push(d.TYPE);
        if (d.EMPLOYEE) lines.push(d.EMPLOYEE);
        lines.push('');
        lines.push(...wrapText(d.OPERATION, 18));

        lines.push('');
        lines.push(d.STYLE_NO);
        lines.push(d.LINEST);

        return lines.join('\n');
    });

    const qtyData = groupedData.map(d => d.SUM_DEFECT);
    const rateData = groupedData.map(d => d.AVG_DEFECT_RATE);

    const visibleCount = type === 99 ? 11 : 8;
    const total = categories.length;

    const option = {
        backgroundColor: theme.color.background.o1,
        legend: {
            bottom: undefined,
            top: 20,
            left: 'center',
            textStyle: {
                color: theme.color.text.o1
            }
        },
        title: {
            text: type === 99 ? 'CTQ, CTP Defect' : 'CTQ Defect',
            left: 'center',
            top: 0,
            textStyle: {
                color: theme.color.text.o1,
                fontSize: 16,
                fontWeight: 600
            }
        },
        grid: {
            left: 70,
            right: 70,
            bottom: 160,
        },
        tooltip: {
            trigger: 'axis',
            renderMode: 'html',
            appendToBody: true,
            confine: false,
            enterable: true,

            backgroundColor: 'transparent',
            borderWidth: 1,
            borderColor: 'transparent',
            padding: 0,
            extraCssText: `
                z-index: 9999999;
                pointer-events: auto;
                box-shadow: none;
            `,
            textStyle: {
                fontFamily: 'Inter, Roboto, "Helvetica Neue", Arial, sans-serif',
                fontSize: 12,
            },
            position: (
                point: number[],
                params: any,
                dom: HTMLElement,
                rect: any,
                size: any
            ) => {
                const [mouseX, mouseY] = point;
                const [boxW, boxH] = size.contentSize;
                const [viewW, viewH] = size.viewSize;

                const GAP = 8;
                let x = mouseX - boxW / 2;
                let y = mouseY + 20;

                if (x < GAP) x = GAP;
                if (x + boxW > viewW - GAP) {
                    x = viewW - boxW - GAP;
                }

                if (y + boxH > viewH - GAP) {
                    y = mouseY - boxH - 12;
                }

                if (y < GAP) {
                    y = GAP;
                }

                return [x, y];
            },
            formatter: (params: any[]) => {
                const index = params[0].dataIndex;
                const group = groupedData[index];
                if (!group) return '';

                const defectList = group.children
                .map(item => `
                    <div style="
                        display:flex;
                        justify-content:space-between;
                        align-items:center;
                        margin-bottom:6px;
                        font-size:13px;
                    ">
                        <div style="
                            line-height:1.3;
                            white-space:normal;
                            word-break:break-word;
                            overflow-wrap:anywhere;
                        ">
                            ${item.DefectEN}
                            <div style="
                                font-size:11px;
                                color:#6b7280;
                                white-space:normal;
                                word-break:break-word;
                                overflow-wrap:anywhere;
                            ">
                                (${item.DefectVN})
                            </div>
                        </div>

                        <div style="
                            background:#111827;
                            color:#ffffff;
                            font-size:12px;
                            font-weight:600;
                            padding:2px 10px;
                            border-radius:999px;
                            min-width:20px;
                            text-align:center;
                        ">
                            ${item.DEFECT}
                        </div>
                    </div>
                `)
                .join('');

                return `
                    <div style="
                        width:270px;
                        background:#ffffff;
                        border-radius:12px;
                        padding:14px;
                        font-family:Arial, sans-serif;
                        color:#1f2937;
                        box-shadow:0 2px 8px rgba(0,0,0,0.08);
                    ">

                        <!-- Title -->
                        <div style="
                            text-align:center;
                            margin-bottom:6px;
                            padding-bottom:8px;
                            border-bottom:1px solid #e5e7eb;
                        ">
                            <div style="
                                font-weight:700;
                                font-size:16px;
                                text-align:center;
                                word-break:break-word;
                                white-space:normal;
                                line-height:1.25;
                            ">
                                ${group.OPERATION}
                            </div>
                            <div style="font-size:12px;color:#6b7280">
                                Style ${group.STYLE_NO}
                            </div>
                        </div>

                        <!-- Defect Rate -->
                        <div style="
                            border:2px solid #dc2626;
                            border-radius:10px;
                            padding:10px;
                            text-align:center;
                            margin:10px 0;
                        ">
                            <div style="font-size:28px;font-weight:700;color:#dc2626">
                                ${group.AVG_DEFECT_RATE}%
                            </div>
                            <div style="font-size:12px;color:#6b7280">
                                Defect Rate
                            </div>
                        </div>

                        <!-- Qty / Defect -->
                        <div style="
                            display:flex;
                            gap:8px;
                            margin-bottom:10px;
                        ">
                            <div style="
                                flex:1;
                                background:#f9fafb;
                                border:1px solid #e5e7eb;
                                border-radius:8px;
                                text-align:center;
                                padding:8px;
                            ">
                                <div style="font-size:18px;font-weight:700">
                                    ${group.SUM_TOTAL_QTY}
                                </div>
                                <div style="font-size:12px;color:#6b7280">
                                    Inspected
                                </div>
                            </div>

                            <div style="
                                flex:1;
                                background:#f9fafb;
                                border:1px solid #e5e7eb;
                                border-radius:8px;
                                text-align:center;
                                padding:8px;
                            ">
                                <div style="font-size:18px;font-weight:700">
                                    ${group.SUM_DEFECT}
                                </div>
                                <div style="font-size:12px;color:#6b7280">
                                    Defects
                                </div>
                            </div>
                        </div>

                        <!-- Defect Types -->
                        <div style="
                            background:#f9fafb;
                            border:1px solid #e5e7eb;
                            border-radius:8px;
                            padding:8px;
                        ">
                            <div style="
                                font-size:12px;
                                font-weight:700;
                                color:#6b7280;
                                margin-bottom:6px;
                            ">
                                DEFECT TYPES
                            </div>

                            ${defectList}
                        </div>
                    </div>
                `;
            }
        },
        xAxis: {
            type: 'category',
            data: categories,
            boundaryGap: true,

            axisLine: {
                show: true,
                lineStyle: {
                    color: theme.color.background.o5
                }
            },
            axisLabel: {
                interval: 0,
                color: theme.color.text.o1,
                lineHeight: 16,
                margin: 20,
                height: 170,
                overflow: 'break',
                textStyle: {
                    fontFamily: 'Inter, Roboto, "Helvetica Neue", Arial, sans-serif',
                    fontSize: 10,
                },
                // formatter: (value: string, index: number) => {
                //     return index % 2 === 0 ? value : '\n' + value;
                // }
            }
        },
        yAxis: [
            {
                type: 'value',
                name: type === 99 ? 'CTQ, CTP Defect' : 'CTQ Defect Qty',
                nameTextStyle: {
                    color: theme.color.text.o1,
                    fontWeight: 600
                },
                axisLabel: {
                    color: theme.color.text.o1
                },
                splitLine: {
                    show: false
                }
            },
            {
                type: 'value',
                name: type === 99 ? 'CTQ, CTP Defect Rate (%)' : 'CTQ Defect Rate (%)',
                nameTextStyle: {
                    color: theme.color.text.o1,
                    fontWeight: 600
                },
                min: 0,
                max: 100,
                axisLabel: {
                    formatter: '{value}%',
                    color: theme.color.text.o1
                }
            }
        ],
        dataZoom: [
            {
                type: 'slider',
                xAxisIndex: 0,
                height: 25,
                bottom: 10,
                startValue: 0,
                endValue: Math.min(visibleCount - 1, total - 1),
                zoomLock: false
            },
            {
                type: 'inside',
                xAxisIndex: 0,
                zoomLock: false
            },
        ],
        series: [
            {
                name: 'CTQ Defect Qty',
                type: 'bar',
                data: qtyData,
                barWidth: 30,
                barGap: '0%',
                barCategoryGap: '0%',
                itemStyle: { color: '#5B9BD5' },
                label: {
                    show: true,
                    position: 'top',
                    color: theme.color.text.o1,
                    // fontWeight: 'bold'
                }
            },
            {
                name: 'CTQ Defect Rate (%)',
                type: 'bar',
                yAxisIndex: 1,
                data: rateData,
                barWidth: 30,
                barGap: '0%',
                barCategoryGap: '0%',
                itemStyle: { color: '#ED7D31' },
                label: {
                    show: true,
                    position: 'top',
                    formatter: '{c}%',
                    color: theme.color.text.o1,
                    // fontWeight: 'bold'
                }
            }
        ]
    };

    return (
        <>
            <BaseEChart option={option} height={height} />
        </>
    );
};

export default CTQChart;
