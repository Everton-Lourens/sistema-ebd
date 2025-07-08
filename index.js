const data = {
    "Cordeirinhos de Cristo": {
        "absent": 0,
        "attendancePercentage": "100.00%",
        "bibles": 3,
        "className": "Cordeirinhos de Cristo",
        "enrolled": 3,
        "magazines": 3,
        "offers": "R$ 9,55",
        "present": 3,
        "total": 8,
        "visitors": "5"
    },
    "Shalom": {
        "absent": 1,
        "attendancePercentage": "50.00%",
        "bibles": 1,
        "className": "Shalom",
        "enrolled": 2,
        "magazines": 1,
        "offers": "R$ 50,00",
        "present": 1,
        "total": 51,
        "visitors": "50"
    }
};

const gerarTop3 = (data, campo) => {
    return Object.entries(data)
        .sort((a, b) => {
            const numA = Number(a[1][campo]?.replace(/[^\d]/g, '') || 0);
            const numB = Number(b[1][campo]?.replace(/[^\d]/g, '') || 0);
            return numB - numA;
        })
        .slice(0, 3)
        .map(([className, values], index) => ({
            ...values,
            className,
            colocacao:
                index === 0
                    ? '1º Lugar'
                    : index === 1
                        ? '2º Lugar'
                        : '3º Lugar',
        }));
};
console.log('___________');

const teste = 'visitors';
const teste2 = gerarTop3(data, teste)
console.log(teste2);