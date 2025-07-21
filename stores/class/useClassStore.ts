import { create } from 'zustand';

interface ClassStore {
  id: string;
  className: string;
  allClassName: object[];
  setId: (id: string) => void;
  setClassName: (setClassName: string) => void;
  setAllClassName: (allClassName: any[]) => void;
}

export const useClassStore = create<ClassStore>((set) => ({
  id: '',
  className: '',
  allClassName: [],
  setId: (id: string) => set({ id }),
  setClassName: (className: string) => set({ className }),
  setAllClassName: (allClassName: any[]) => set({ allClassName }),
}));

