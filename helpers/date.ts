

export function compareDate(oldDate: string) {
    if (!oldDate) throw new Error('Data inválida');
    const date1 = new Date().toISOString();
    const date2 = new Date(oldDate).toISOString();
    function getDateOnly(isoString: string) {
        return isoString.split('T')[0];
    }
    const sameDate = getDateOnly(date1) === getDateOnly(date2);
    return sameDate
}