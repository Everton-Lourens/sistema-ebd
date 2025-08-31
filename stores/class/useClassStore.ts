import { create } from 'zustand';



interface ClassStore {
  id: string;
  className: string;
  allClassName: {
    id: string;
    date: string;
    name: string;
  }[];
  setId: (id: string) => void;
  setClassName: (setClassName: string) => void;
  setAllClassName: (allClassName: {
    id: string;
    date: string;
    name: string;
  }[]) => void;
}

export const useClassStore = create<ClassStore>((set) => ({
  id: '',
  className: '',
  allClassName: [],
  setId: (id: string) => set({ id }),
  setClassName: (className: string) => set({ className }),
  setAllClassName: (allClassName: {
    id: string;
    date: string;
    name: string;
  }[]) => set({ allClassName }),
}));

