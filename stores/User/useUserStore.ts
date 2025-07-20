import { create } from 'zustand';

interface UserStore {
  id: string;
  name: string;
  studentClass: string;
  isEditing: boolean;
  setId: (id: string) => void;
  setName: (name: string) => void;
  setStudentClass: (studentClass: string) => void;
  setIsEditing: (isEditing: boolean) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  id: '',
  name: '',
  studentClass: '',
  isEditing: false,
  setId: (id) => set({ id }),
  setName: (name) => set({ name }),
  setStudentClass: (studentClass) => set({ studentClass }),
  setIsEditing: (isEditing) => set({ isEditing }),
}));

