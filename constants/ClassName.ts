export const CLASSES = {
    CRIANCA_PEQUENA: 'Cordeirinhos de Cristo',
    CRIANCA_GRANDE: 'Shalom',
    ADOLESCENTE: 'Filhos de Asáfe',
    JOVENS: 'Mensageiros de Cristo',
    SENHORAS: 'Rosa de Saron',
    SENHORES: 'Filhos de Sião',
}

export const THIS_CLASSES_TODAY = 'classes';

export const THIS_CLASSES_STORAGE = 'classes_storage';

export const initialClasses = [
  CLASSES.CRIANCA_PEQUENA,
  CLASSES.CRIANCA_GRANDE,
  CLASSES.ADOLESCENTE,
  CLASSES.JOVENS,
  CLASSES.SENHORAS,
  CLASSES.SENHORES,
].map((name, index) => ({
  id: index.toString(),
  name,
  className: name,
  studentNumber: '',
  presenceNumber: '',
  bibleNumber: '',
  magazineNumber: '',
  guestNumber: '',
  offersNumber: '',
}));