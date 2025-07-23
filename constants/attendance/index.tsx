import { create } from "zustand";

type AttendanceType = {
    id: string;
    name: string;
};

type AttendanceStoreType = {
    arrayAttendanceData: AttendanceType[];
    setAttendanceData: (data: AttendanceType[]) => void;
    addToAttendanceData: (item: AttendanceType) => void;
    clearAttendanceData: () => void;
};


export interface AttendanceStore {
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

export const useClassStore: AttendanceStore = {
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

export const createClassStore = (raw: RawClassData): AttendanceStore => {
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

export const useAttendanceStore = create<AttendanceStoreType>((set) => ({
    arrayAttendanceData: [],
    setAttendanceData: (data) => set({ arrayAttendanceData: data }),
    addToAttendanceData: (item) =>
        set((state) => ({
            arrayAttendanceData: [...state.arrayAttendanceData, item],
        })),
    clearAttendanceData: () => set({ arrayAttendanceData: [] }),
}));
