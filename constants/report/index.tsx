import { Column } from "@/components/_ui/TableComponent/interfaces";
import { create } from "zustand";

type RpoertType = {
    id: string;
    name: string;
};

type ReportStoreType = {
    arrayReportData: RpoertType[];
    setReportData: (data: RpoertType[]) => void;
    addToReportData: (item: RpoertType) => void;
    clearReportData: () => void;
};


export interface ReportStore {
    id: string;
    className: string;
    enrolled: number;
    absent: number;
    visitors: number;
    present: number;
    total: number;
    bible: number;
    magazine: number;
    offers: string;
    attendancePercentage: string;
    biblePercentage: string;
    magazinePercentage: string;
}

export const columnsPresent: Column[] = [
    {
        headerName: 'Presença',
        field: 'className',
        flex: 2,
    },
    {
        headerName: '%',
        field: 'attendancePercentage',
        flex: 2,
    },
];

export const columnsOffer: Column[] = [
    {
        headerName: 'Oferta',
        field: 'className',
        flex: 2,
    },
    {
        headerName: 'R$',
        field: 'offer',
        flex: 2,
    },
];

export const useClassStore: ReportStore = {
    id: '',
    className: '',
    enrolled: 0,
    absent: 0,
    present: 0,
    visitors: 0,
    total: 0,
    bible: 0,
    magazine: 0,
    offers: '',
    attendancePercentage: '',
    biblePercentage: '',
    magazinePercentage: '',
};

type RawClassData = {
    id: string;
    className: string;
    present: number;
    bible: number;
    magazine: number;
    enrolled: number;
    visitors: number;
    offers: string;
};

export const createClassStore = (raw: RawClassData): ReportStore => {
    const absent = raw.enrolled - raw.present;
    const total = raw.present + raw.visitors;
    const attendancePercentage = raw.enrolled > 0
        ? ((raw.present / raw.enrolled) * 100).toFixed(2) + '%'
        : '0.00%';
    const biblePercentage = raw.present > 0
        ? ((raw.bible / raw.present) * 100).toFixed(2) + '%'
        : '0.00%';
    const magazinePercentage = raw.present > 0
        ? ((raw.magazine / raw.present) * 100).toFixed(2) + '%'
        : '0.00%';

    return {
        id: raw.id,
        className: raw.className,
        present: raw.present,
        bible: raw.bible,
        magazine: raw.magazine,
        enrolled: raw.enrolled,
        absent,
        visitors: raw.visitors,
        total,
        offers: raw.offers,
        attendancePercentage,
        biblePercentage,
        magazinePercentage,
    };
};

export const useReportStore = create<ReportStoreType>((set) => ({
    arrayReportData: [],
    setReportData: (data) => set({ arrayReportData: data }),
    addToReportData: (item) =>
        set((state) => ({
            arrayReportData: [...state.arrayReportData, item],
        })),
    clearReportData: () => set({ arrayReportData: [] }),
}));
