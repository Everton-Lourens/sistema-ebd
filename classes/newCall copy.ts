import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

export class NewCall {
    public className: string | undefined;
    public studentNumber: string | undefined;
    public presenceNumber: string | undefined;
    public bibleNumber: string | undefined;
    public magazineNumber: string | undefined;
    public guestNumber: string | undefined;
    public offersNumber: string | undefined;
    private callDate: string | undefined;
    setCall({
        className,
        studentNumber,
        presenceNumber,
        bibleNumber,
        magazineNumber,
        guestNumber,
        offersNumber,
    }: {
        className: string;
        studentNumber: string;
        presenceNumber: string;
        bibleNumber: string;
        magazineNumber: string;
        guestNumber: string;
        offersNumber: string;
    }) {
        this.className = className;
        this.studentNumber = studentNumber;
        this.presenceNumber = presenceNumber;
        this.bibleNumber = bibleNumber;
        this.magazineNumber = magazineNumber;
        this.guestNumber = guestNumber;
        this.offersNumber = offersNumber;
    }
    save() {
        if (!this.className || !this.studentNumber || !this.presenceNumber || !this.bibleNumber || !this.magazineNumber || !this.guestNumber || !this.offersNumber) {
            throw new Error(
                "O nome da turma é obrigatório.\n" +
                `className: ${this.className},\n` +
                `studentNumber: ${this.studentNumber},\n` +
                `presenceNumber: ${this.presenceNumber},\n` +
                `bibleNumber: ${this.bibleNumber},\n` +
                `magazineNumber: ${this.magazineNumber},\n` +
                `guestNumber: ${this.guestNumber},\n` +
                `offersNumber: ${this.offersNumber}`
            );
        }
        const data = {
            className: this.className,
            studentNumber: this.studentNumber,
            presenceNumber: this.presenceNumber,
            bibleNumber: this.bibleNumber,
            magazineNumber: this.magazineNumber,
            guestNumber: this.guestNumber,
            offersNumber: this.offersNumber,
            callDate: new Date().toISOString(),
        };

        const storageKey = `call_${this.className}`;

        try {
            if (Platform.OS === 'web') {
                localStorage.setItem(storageKey, JSON.stringify(data));
            } else {
                AsyncStorage.setItem(storageKey, JSON.stringify(data));
            }

            this.className = '';
            this.studentNumber = '';
            this.presenceNumber = '';
            this.bibleNumber = '';
            this.magazineNumber = '';
            this.guestNumber = '';
            this.offersNumber = '';

            return true;

        } catch (error) {
            console.error('Erro ao salvar os dados:', error);
            throw error;
        }
    }
    getCall(className: string) {
        if (!className) throw new Error("O nome da turma é obrigatório");

        const storageKey = `call_${className}`;

        try {
            let data: string | null = null;

            if (Platform.OS === 'web') {
                data = localStorage.getItem(storageKey);
            } else {
                data = AsyncStorage.getItem(storageKey);
            }

            if (data !== null) {
                const parsedData = JSON.parse(data);
                this.className = parsedData.className;
                this.studentNumber = parsedData.studentNumber;
                this.presenceNumber = parsedData.presenceNumber;
                this.bibleNumber = parsedData.bibleNumber;
                this.magazineNumber = parsedData.magazineNumber;
                this.guestNumber = parsedData.guestNumber;
                this.offersNumber = parsedData.offersNumber;
                this.callDate = parsedData.callDate;

                return parsedData;
            } else {
                return {
                    className: '',
                    studentNumber: '',
                    presenceNumber: '',
                    bibleNumber: '',
                    magazineNumber: '',
                    guestNumber: '',
                    offersNumber: '',
                    callDate: '',
                };
            }

        } catch (error) {
            console.error('Erro ao recuperar os dados:', error);
            throw error;
        }
    }
}

