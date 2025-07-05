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
    getAllCalls(className = '') {
        if (!className) throw new Error("O nome da turma é obrigatório");
        if (Platform.OS === 'web') {
            try {
                const date = new Date().toISOString();
                function getDateOnly(isoString: string) {
                    return isoString.split('T')[0];
                }
                const keys = Object.keys(localStorage);
                const calls = keys.filter(key => key.startsWith(`call_${getDateOnly(date)}_${clsseName}`))
                    .map(key => JSON.parse(localStorage.getItem(key) || '{}'));
                return Promise.resolve(calls);
            } catch (error) {
                console.error('Error getting all calls', error);
                return Promise.reject(error);
            }
        } else {
            return AsyncStorage.getAllKeys()
                .then(keys => keys.filter(key => key.startsWith(`call_${new Date().toISOString().split('T')[0]}_${clsseName}`)))
                .then(filteredKeys => AsyncStorage.multiGet(filteredKeys))
                .then(calls => calls.map(([key, value]) => JSON.parse(value || '{}')))
                .catch(error => {
                    console.error('Error getting all calls', error);
                    throw error;
                });
        }
    }
    static getAllCalls(className = '') {
        if (!className) throw new Error("O nome da turma é obrigatório");
        return AsyncStorage.getItem(`call_${new Date().toISOString().split('T')[0]}_${className}`)
            .then(value => JSON.parse(value || '{}'))
            .catch(error => {
                console.error('Error getting all calls', error);
                throw error;
            });
    }
    static saveAllCalls(className = '', allCalls = {}) {
        if (!className || Object.keys(allCalls).length === 0) throw new Error("O nome da turma é obrigatório");
        return AsyncStorage.setItem(`call_${new Date().toISOString().split('T')[0]}_${className}`, JSON.stringify(allCalls))
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
                    const date = new Date().toISOString();
                    function getDateOnly(isoString: string) {
                        return isoString.split('T')[0];
                    }
                    localStorage.setItem(`call_${getDateOnly(date)}_${this.className}`, JSON.stringify(data));
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
                const date = new Date().toISOString();
                function getDateOnly(isoString: string) {
                    return isoString.split('T')[0];
                }
                return AsyncStorage.setItem(`call_${getDateOnly(date)}_${this.className}`, JSON.stringify(data))
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
        if (!className || !this.className) throw new Error("O nome da turma é obrigatório");
        if (Platform.OS === 'web') {
            try {
                const date = new Date().toISOString();
                function getDateOnly(isoString: string) {
                    return isoString.split('T')[0];
                }
                const data = localStorage.getItem(`call_${getDateOnly(date)}_${this.className}`);
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
            const date = new Date().toISOString();
            function getDateOnly(isoString: string) {
                return isoString.split('T')[0];
            }
            return AsyncStorage.getItem(`call_${getDateOnly(date)}_${this.className}`)
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

