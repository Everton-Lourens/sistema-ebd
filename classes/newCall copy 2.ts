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
        try {
            if (Platform.OS === 'web') {
                try {
                    localStorage.setItem(`call_${this.className}`, JSON.stringify(data));
                    this.className = '';
                    this.studentNumber = '';
                    this.presenceNumber = '';
                    this.bibleNumber = '';
                    this.magazineNumber = '';
                    this.guestNumber = '';
                    this.offersNumber = '';
                    return Promise.resolve(true);
                } catch (error: any) {
                    console.error('Erro ao salvar nome:', error);
                    return Promise.reject(error);
                }
            } else {
                return AsyncStorage.setItem(`call_${this.className}`, JSON.stringify(data))
                    .then(() => {
                        this.className = '';
                        this.studentNumber = '';
                        this.presenceNumber = '';
                        this.bibleNumber = '';
                        this.magazineNumber = '';
                        this.guestNumber = '';
                        this.offersNumber = '';
                        return true
                    })
                    .catch((error: any) => {
                        console.error('Erro ao salvar nome:', error);
                        throw error;
                    });
            }
        } catch (error) {
            console.error('Error saving data', error);
        }
    }
    getCall(className: string) {
        if (!className) throw new Error("O nome da turma é obrigatório");
        if (Platform.OS === 'web') {
            try {
                const data = localStorage.getItem(`call_${className}`);
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
                    return Promise.resolve(parsedData);
                } else {
                    return Promise.resolve(null);
                }
            } catch (error) {
                console.error('Error getting data', error);
                return Promise.reject(error);
            }
        } else {

            return AsyncStorage.getItem(`call_${className}`)
                .then((data: string | null) => {
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
                    }
                })
                .catch(error => {
                    console.error('Error getting data', error);
                    throw error;
                });
        }

    }
}

