import { request } from "@/network/network.ts";

const path = "/qc_dashboard";

export const getSubcon = () => request({
    method: "GET",
    url: `${path}/getsubcon`,
})

export const getAllDepartment = () => request({
    method: "GET",
    url: `${path}/getalldepartment`,
})

export const getDashboardNoTDecorate = (body: any) => request({
    method: "POST",
    url: `${path}/dashboard-no-decorate`,
    data: body
})

export const getDashboardDecorate = (body: any) => request({
    method: "POST",
    url: `${path}/dashboard-decorate`,
    data: body
})

export const searchStyleByText = (group: JobRequest) => request({
    method: "POST",
    url: `${path}/searchStyleByText`,
    data: group
})


export const getStyleById = (id: any) => request({
    method: "POST",
    url: `${path}/searchStyleByText`,
})

export const getCTQDashboard = (data: DataRequest) => request({
    method: "POST",
    url: `${path}/getCTQDashboard`,
    data: data
})

export const getAllFactory = () => request({
    method: "GET",
    url: `${path}/getAllFactory`,
})

export interface JobRequest {
    text: string;
}

export interface DataRequest {
    fac: string;
    line: string[];
    date_from: string;
    date_to: string;
    url: number
}

export type CTQ = {
    LINEST: string;
    STYLE_NO: string;
    OPERATION: string;
    DEFECT: number;
    DefectEN: string;
    DefectVN: string;
    TOTAL_QTY: number;
    DEFECT_RATE: number;
    EMPLOYEE?: any;
    NAMEQC?: any;
    TYPE?: any
}

export type CTQGroup = {
    LINEST: string;
    STYLE_NO: string;
    OPERATION: string;
    TYPE?: any;
    EMPLOYEE?: any;
    SUM_DEFECT: number;
    SUM_TOTAL_QTY: number;
    AVG_DEFECT_RATE: number;

    children: CTQ[];
};
export const groupCTQData = (data: CTQ[]): CTQGroup[] => {
    const map = new Map<string, CTQGroup>();

    data.forEach(item => {
        const key = `${item.LINEST}|${item.STYLE_NO}|${item.OPERATION}`;

        if (!map.has(key)) {
            map.set(key, {
                LINEST: item.LINEST,
                STYLE_NO: item.STYLE_NO,
                OPERATION: item.OPERATION,
                TYPE: item.TYPE,
                EMPLOYEE: item.EMPLOYEE,
                SUM_DEFECT: 0,
                SUM_TOTAL_QTY: 0,
                AVG_DEFECT_RATE: 0,
                children: [],
            });
        }

        const group = map.get(key)!;

        group.SUM_DEFECT += item.DEFECT;
        group.SUM_TOTAL_QTY = item.TOTAL_QTY;
        group.children.push(item);
    });

    map.forEach(group => {
        group.AVG_DEFECT_RATE =
            group.SUM_TOTAL_QTY === 0
                ? 0
                : Number(
                    ((group.SUM_DEFECT / group.SUM_TOTAL_QTY) * 100).toFixed(2)
                );
    });

    return Array.from(map.values());
};

// export const getTop5Defects = (data: CTQ[]) => {
//     const groupMap = new Map<string, { DefectVN: string; DefectEN: string; totalDefect: number }>();

//     data.forEach(item => {
//         const key = `${item.DefectVN}||${item.DefectEN}`
//         if (!groupMap.has(key)) {
//             groupMap.set(key, {
//                 DefectVN: item.DefectVN,
//                 DefectEN: item.DefectEN,
//                 totalDefect: item.DEFECT
//             });
//         } else {
//             const existing = groupMap.get(key)!;
//             existing.totalDefect += item.DEFECT;
//         }
//     });

//     const groupedArray = Array.from(groupMap.values());

//     groupedArray.sort((a, b) => b.totalDefect - a.totalDefect);
//     const top5 = groupedArray.slice(0, 5);

//     return top5;
// };

export const getTop5Defects = (
    data: CTQ[],
    Type?: "CTQ" | "CTP"
) => {
    const groupMap = new Map<
        string,
        { DefectVN: string; DefectEN: string; totalDefect: number }
    >();

    const filteredData = Type
        ? data.filter(item =>
            item.TYPE
                ?.toString()
                .split(",")
                .map((t: string) => t.trim())
                .includes(Type)
        )
        : data;

    filteredData.forEach(item => {
        const key = `${item.DefectVN}||${item.DefectEN}`;

        if (!groupMap.has(key)) {
            groupMap.set(key, {
                DefectVN: item.DefectVN,
                DefectEN: item.DefectEN,
                totalDefect: item.DEFECT,
            });
        } else {
            groupMap.get(key)!.totalDefect += item.DEFECT;
        }
    });

    return Array.from(groupMap.values())
        .sort((a, b) => b.totalDefect - a.totalDefect)
        .slice(0, 5);
};