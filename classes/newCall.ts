import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

export class NewCall {
    public nameClass: string;
    public numberPresence: number;
    public bibleNumber: number;
    public magazineNumber: number;
    public guestNumber: number;
    public offersNumber: number;
    private callDate: string;

    constructor(
        nameClass: string = '',
        numberPresence: number = 0,
        bibleNumber: number = 0,
        magazineNumber: number = 0,
        guestNumber: number = 0,
        offersNumber: number = 0,
        callDate: string = new Date().toISOString()
    ) {
        this.nameClass = nameClass;
        this.numberPresence = numberPresence;
        this.bibleNumber = bibleNumber;
        this.magazineNumber = magazineNumber;
        this.guestNumber = guestNumber;
        this.offersNumber = offersNumber;
        this.callDate = callDate;
    }

    async save(nameClass: string) {
        if (!nameClass) {
            throw new Error("O nome da turma é obrigatório");
        }
        const data = {
            nameClass: this.nameClass,
            numberPresence: this.numberPresence,
            bibleNumber: this.bibleNumber,
            magazineNumber: this.magazineNumber,
            guestNumber: this.guestNumber,
            offersNumber: this.offersNumber,
            callDate: this.callDate,
        };
        try {
            if (Platform.OS === 'android' || Platform.OS === 'ios') {
                await AsyncStorage.setItem(`call_${nameClass}`, JSON.stringify(data));
            }
        } catch (error) {
            console.error('Error saving data', error);
        }
    }

    async getCall(nameClass: string) {
        if (!nameClass) {
            throw new Error("O nome da turma é obrigatório");
        }
        try {
            if (Platform.OS === 'android' || Platform.OS === 'ios') {
                const data = await AsyncStorage.getItem(`call_${nameClass}`);
                console.log(data);
                if (data !== null) {
                    const parsedData = JSON.parse(data);
                    this.nameClass = parsedData.nameClass;
                    this.numberPresence = parsedData.numberPresence;
                    this.bibleNumber = parsedData.bibleNumber;
                    this.magazineNumber = parsedData.magazineNumber;
                    this.guestNumber = parsedData.guestNumber;
                    this.offersNumber = parsedData.offersNumber;
                    this.callDate = parsedData.callDate;
                }
            }
        } catch (error) {
            console.error('Error getting data', error);
        }
    }
    async getAllCall() {
        try {
            if (Platform.OS === 'android' || Platform.OS === 'ios') {
                const data = await AsyncStorage.getAllKeys();
                if (data !== null) {
                    const parsedData = JSON.parse(data);
                    this.nameClass = parsedData.nameClass;
                    this.numberPresence = parsedData.numberPresence;
                    this.bibleNumber = parsedData.bibleNumber;
                    this.magazineNumber = parsedData.magazineNumber;
                    this.guestNumber = parsedData.guestNumber;
                    this.offersNumber = parsedData.offersNumber;
                    this.callDate = parsedData.callDate;
                }
            }
            
            console.error('@@@@@@@@@@@@@@@@@@@');
        } catch (error) {
            console.error('Error getting data', error);
        }
    }
}

