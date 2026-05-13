import { useEffect, useState, useMemo } from 'react';
import { useApiGet } from '../app/useApiGet';
import { getAllFactory } from '@/network/urls/qc_dashboard';

type FactoryData = {
    FaclineId: number;
    Facline: string;
    Factory: string;
    FactoryName: string;
};

type GroupedFactory = {
    factory: string;
    factoryName: string;
    lines: { label: string; value: string | null }[];
};

export const useGetAllFactory = () => {
    const [form, setForm] = useState<{
        selectedFactory: string;
        selectedLines: string[];
    }>({
        selectedFactory: '',
        selectedLines: ['All']
    });

    const [lines, setLines] = useState<{ label: string; value: string | null }[]>([]);

    const { data: factoryList } = useApiGet<FactoryData[]>(['allFactory'], () => getAllFactory());

    useEffect(() => {
        if (factoryList && factoryList.length) {
            const defaultFactory = factoryList[0].Factory;
            setForm({ selectedFactory: defaultFactory, selectedLines: ['All'] });
            const filtered = factoryList.filter(f => f.Factory === defaultFactory && f.Facline);
            const lineOptions = [
                { label: 'All', value: null },
                ...Array.from(new Set(filtered.map(f => f.Facline))).map(line => ({
                    label: line!,
                    value: line!
                }))
            ];
            setLines(lineOptions);
        }
    }, [factoryList]);

    const groupedFactory: GroupedFactory[] = useMemo(() => {
        if (!factoryList) return [];
        const map = new Map<string, GroupedFactory>();

        factoryList.forEach(f => {
            if (!map.has(f.Factory)) {
                map.set(f.Factory, {
                    factory: f.Factory,
                    factoryName: f.FactoryName,
                    lines: []
                });
            }

            const g = map.get(f.Factory)!;
            const lineLabel = f.Facline || 'All';

            if (!g.lines.find(l => l.label === lineLabel)) {
                g.lines.push({ label: lineLabel, value: lineLabel });
            }
        });

        return Array.from(map.values());
    }, [factoryList]);

    const handleFactoryChange = (factory: string) => {
        setForm(prev => ({ ...prev, selectedFactory: factory, selectedLines: ['All']}));

        if (!factoryList) {
            setLines([{ label: 'All', value: 'All' }]);
            return;
        }

        const filtered = factoryList.filter(f => f.Factory === factory && f.Facline);

        const lineOptions = [
            { label: 'All', value: 'All' },
            ...Array.from(new Set(filtered.map(f => f.Facline))).map(line => ({
                label: line!,
                value: line!
            }))
        ];

        setLines(lineOptions);
    };

    const handleLineChange = (lines: string[]) => {
        setForm(prev => ({
            ...prev,
            selectedLines: lines
        }));
    };
    return { groupedFactory, lines, form, handleFactoryChange, handleLineChange };
};
