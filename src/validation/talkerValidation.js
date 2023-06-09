const nameField = (req, res, next) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ message: 'O campo "name" é obrigatório' });
  if (name.length < 3) {
    return res.status(400).json({ message: 'O "name" deve ter pelo menos 3 caracteres' });
  }
  next();
};
const ageFied = (req, res, next) => {
  const { age } = req.body;
  if (!age) return res.status(400).json({ message: 'O campo "age" é obrigatório' });
  if (!(age % 1 === 0 && age >= 18)) {
   return res.status(400)
    .json({ message: 'O campo "age" deve ser um número inteiro igual ou maior que 18' });
  } 
  next();
};

const talkField = (req, res, next) => {
  const { talk } = req.body;
  if (!talk) return res.status(400).json({ message: 'O campo "talk" é obrigatório' });
  next();
};

const talkFieldWatchedAt = (req, res, next) => {
  const { talk } = req.body;
  const regexDate = /^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/i;
  if (!talk.watchedAt) {
    return res.status(400).json({ message: 'O campo "watchedAt" é obrigatório' });
  }
  if (!talk.watchedAt.match(regexDate)) {
   return res.status(400).json({ message: 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"' });
  }
  next();
};

const validRate = (rate) => {
  if (!([1, 2, 3, 4, 5].includes(rate))) {
   return { type: 400, message: 'O campo "rate" deve ser um número inteiro entre 1 e 5' };
  }
  return { type: null };
};

const talkFieldRate = (req, res, next) => {
  const { talk: { rate } } = req.body;
  if (!rate && rate !== 0) {
    return res.status(400).json({ message: 'O campo "rate" é obrigatório' });
  } 
  const error = validRate(rate);
  if (error.type) return res.status(error.type).json({ message: error.message });

  next();
};

const rateValidation = (req, res, next) => { 
  const { rate } = req.query;
  const error = validRate(Number(rate));
  if (rate && error.type) return res.status(error.type).json({ message: error.message });
  next();
};

const dateValidation = (req, res, next) => {
  const { date } = req.query;
  const regexDate = /^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/i;
  if (date && !regexDate.test(date)) {
    return res.status(400).json({ message: 'O parâmetro "date" deve ter o formato "dd/mm/aaaa"' });
  }
  next();
};

function pathRateValidation(req, res, next) {
  const { rate } = req.body;
  if (!rate && rate !== 0) {
    return res.status(400).json({ message: 'O campo "rate" é obrigatório' });
  } 
  const error = validRate(rate);
  if (error.type) return res.status(error.type).json({ message: error.message });
  next();
}

module.exports = {
  talkerValidate: {
    nameField,
    ageFied,
    talkField,
    talkFieldWatchedAt,
    talkFieldRate,
    validRate,
    rateValidation,
    dateValidation,
    pathRateValidation,
  },
};