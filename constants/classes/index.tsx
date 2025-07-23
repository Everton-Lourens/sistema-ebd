import { create } from "zustand";

type ClassDashboard = {
    id: string;
    name: string;
};

type ClassesStoreType = {
    arrayDashboardData: ClassDashboard[];
    setDashboardData: (data: ClassDashboard[]) => void;
    addToDashboardData: (item: ClassDashboard) => void;
    clearDashboardData: () => void;
};


export interface ClassesStore {
    id: string;
    present: number;
    bible: number;
    magazine: number;
    className: string;
    enrolled: number;
    absent: number;
    visitors: number;
    total: number;
    offers: string;
    attendancePercentage: string;
}

export const useClassStore: ClassesStore = {
    id: '',
    present: 0,
    bible: 0,
    magazine: 0,
    className: '',
    enrolled: 0,
    absent: 0,
    visitors: 0,
    total: 0,
    offers: '',
    attendancePercentage: '',
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

export const createClassStore = (raw: RawClassData): ClassesStore => {
    const absent = raw.enrolled - raw.present;
    const total = raw.present + raw.visitors;
    const attendancePercentage = raw.enrolled > 0
        ? ((raw.present / raw.enrolled) * 100).toFixed(2) + '%'
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
    };
};

export const useClassesStore = create<ClassesStoreType>((set) => ({
    arrayDashboardData: [],
    setDashboardData: (data) => set({ arrayDashboardData: data }),
    addToDashboardData: (item) =>
        set((state) => ({
            arrayDashboardData: [...state.arrayDashboardData, item],
        })),
    clearDashboardData: () => set({ arrayDashboardData: [] }),
}));
