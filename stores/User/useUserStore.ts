import { create } from 'zustand';

interface UserStore {
  id: string;
  name: string;
  classId: string;
  isEditing: boolean;
  setId: (id: string) => void;
  setName: (name: string) => void;
  setClassId: (classId: string) => void;
  setIsEditing: (isEditing: boolean) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  id: '',
  name: '',
  classId: '',
  isEditing: false,
  setId: (id) => set({ id }),
  setName: (name) => set({ name }),
  setClassId: (classId) => set({ classId }),
  setIsEditing: (isEditing) => set({ isEditing }),
}));

