export const formatMoneytoInt = (number: string): number => {
    number = number.replace(/[^0-9,.]/g, '').replace(/,00$/, '').replace('.', '').replace(',', '');
    return parseInt(number, 10);
}

export const formatToCurrency = (stringNumber: string | number) => {
    const input = String(stringNumber)?.replace(/[^\d]/g, '');
    if (isNaN(input)) stringNumber = ''
    else {
        const number = parseInt(input, 10) / 100;
        stringNumber = number.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }
    return stringNumber;
}