const express = require('express');
const crypto = require('crypto');
// db connection
const connection = require('./db/connection');
const { getFiles, setFiles } = require('./fsModule/fs');
const { emailValidation, 
  passwordValidation, 
  tokenValidation,
  talkerValidate,
} = require('./validation/index');

const app = express();
app.use(express.json());

const HTTP_OK_STATUS = 200;
const PORT = process.env.PORT || '3001';
const TALKER_PATH = './src/talker.json';

function generateToken() {
  return crypto.randomBytes(8).toString('hex');
}

const filterQuerys = (q, rate, date, file) => {
  let queryFiltered = file;
  if (q) queryFiltered = queryFiltered.filter(({ name }) => name.includes(q));
  if (rate) queryFiltered = queryFiltered.filter(({ talk }) => talk.rate === Number(rate));
  if (date) queryFiltered = queryFiltered.filter(({ talk }) => talk.watchedAt === date); 
  
  return queryFiltered;
};

const rateValidation = (req, res, next) => { // Repetindo código, refatorar Esse sim
  const { rate } = req.query;
  if (rate && !([1, 2, 3, 4, 5].includes(Number(rate)))) {
    return res.status(400)
    .json({ message: 'O campo "rate" deve ser um número inteiro entre 1 e 5' });
  }
  next();
};

const dateValidation = (req, res, next) => { // Repetindo código, refatorar Talvez não, porque as respostas são diferentes
  const { date } = req.query;
  const regexDate = /^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/i;
  if (date && !regexDate.test(date)) {
    return res.status(400).json({ message: 'O parâmetro "date" deve ter o formato "dd/mm/aaaa"' });
  }
  next();
};

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.get('/talker/search',
  tokenValidation,
  rateValidation,
  dateValidation,
  async (req, res) => {
  const { q: search, rate, date } = req.query;
  const files = await getFiles(TALKER_PATH);

  if (!search && !rate && !date) {
    return res.status(200).json(files);
  }

  const querys = filterQuerys(search, rate, date, files);
  
  return res.status(200).json(querys);
});

app.get('/talker/db', async (req, res) => {
  const [talkers] = await connection.execute('SELECT * FROM talkers');
  const newTalkersList = talkers.map((talker) => ({ 
    name: talker.name,
    age: talker.age,
    id: talker.id,
    talk: { rate: talker.talk_rate, watchedAt: talker.talk_watched_at },
   }));
  res.status(200).json(newTalkersList);
});

app.get('/talker', async (req, res) => {
  const files = await getFiles(TALKER_PATH); 
  if (files) return res.status(200).json(files);
  return res.status(400).json({ message: 'Deu ruim' });
});

app.get('/talker/:id', async (req, res) => {
  const { id } = req.params;
  const files = await getFiles(TALKER_PATH);
  const fileSelected = files.find((file) => file.id === Number(id));
  if (fileSelected) return res.status(200).json(fileSelected);
  res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
});

app.delete('/talker/:id', tokenValidation, async (req, res) => {
  const { id } = req.params;
  const files = await getFiles(TALKER_PATH);
  if (!(files.find((file) => file.id === Number(id)))) {
    return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
  } 
  const newFiles = files.filter((file) => file.id !== Number(id));
  await setFiles(TALKER_PATH, newFiles);
  return res.status(204).end();
});

app.post('/login',
  emailValidation,
  passwordValidation,
  (req, res) => {
  // const { email, password } = req.body;
  const token = generateToken();
  res.status(200).json({ token });
});

function pathRateValidation(req, res, next) { // Repetição de código, refatorar. Não consigo simplesmente reutilizar a takerValidation por conta da req
  const { rate } = req.body;
  if (!rate && rate !== 0) {
    return res.status(400).json({ message: 'O campo "rate" é obrigatório' });
  } 
  if (
    !([1, 2, 3, 4, 5].includes(rate))
    ) {
   return res.status(400)
   .json({ message: 'O campo "rate" deve ser um número inteiro entre 1 e 5' });
  }
  next();
}

app.patch('/talker/rate/:id', 
  tokenValidation,
  pathRateValidation,
  async (req, res) => {
    const { id } = req.params;
    const { rate } = req.body;
    const files = await getFiles(TALKER_PATH);
    const targetI = files.findIndex((file) => file.id === Number(id));
    if (targetI === -1) {
      return res.status(404).json({ message: 'Pessoa palestrante não encontrada' }); 
    }
    files[targetI] = { ...files[targetI], talk: { ...files[targetI].talk, rate: Number(rate) } };

    await setFiles(TALKER_PATH, files);
    res.status(204).json(files[targetI]);
});

app.use(tokenValidation);
app.use(talkerValidate.nameField);
app.use(talkerValidate.ageFied);
app.use(talkerValidate.talkField);
app.use(talkerValidate.talkFieldRate);
app.use(talkerValidate.talkFieldWatchedAt);

app.post('/talker', 
  async (req, res) => {
    const obj = req.body;
    const files = await getFiles(TALKER_PATH);
    const newID = files.length + 1;
    const newFile = [...files, { id: newID, ...obj }];
    await setFiles(TALKER_PATH, newFile);
    return res.status(201).json({ id: newID, ...obj });
});

app.put('/talker/:id', 
  async (req, res) => {
  const { id } = req.params;
  const targetID = Number(id);
  const obj = req.body;
  const files = await getFiles(TALKER_PATH);
  const targetFile = files.find((file) => file.id === targetID);
  if (!targetFile) return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
  const newFiles = files.map((file) => {
    if (file.id === targetID) return { id: targetID, ...obj };
    return file;
  });
  await setFiles(TALKER_PATH, newFiles);
  res.status(200).json({ id: targetID, ...obj });
});

app.listen(PORT, async () => {
  console.log('Online');
  const [result] = await connection.execute('SELECT 1');
  if (result) console.log('Database connected');
});
