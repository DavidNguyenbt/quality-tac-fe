// components/chart/BaseEChart.tsx
import React from 'react';
import ReactECharts from 'echarts-for-react';
import { Box } from '@mui/material';

interface BaseEChartProps {
    option: any;
    height?: number;
}

const BaseEChart: React.FC<BaseEChartProps> = ({
    option,
    height = 500
}) => {
    return (
        <Box>
            <ReactECharts
                option={option}
                style={{ height }}
                notMerge
                lazyUpdate
            />
        </Box>
    );
};

export default BaseEChart;
