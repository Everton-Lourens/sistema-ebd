import { create } from "zustand";

type ClassType = {
    id: string;
    name: string;
};

type ClassesStoreType = {
    arrayClassesData: ClassType[];
    setClassesData: (data: ClassType[]) => void;
    addToClassesData: (item: ClassType) => void;
    clearClassesData: () => void;
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
    biblePercentage: string;
    magazinePercentage: string;
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

export const createClassStore = (raw: RawClassData): ClassesStore => {
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

export const useClassesStore = create<ClassesStoreType>((set) => ({
    arrayClassesData: [],
    setClassesData: (data) => set({ arrayClassesData: data }),
    addToClassesData: (item) =>
        set((state) => ({
            arrayClassesData: [...state.arrayClassesData, item],
        })),
    clearClassesData: () => set({ arrayClassesData: [] }),
}));
