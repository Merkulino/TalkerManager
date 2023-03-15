const express = require('express');
const crypto = require('crypto');
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

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.get('/talker/search',
  tokenValidation,
  async (req, res) => {
  const { q: searchTerm } = req.query;
  const files = await getFiles(TALKER_PATH);
  if (!searchTerm && searchTerm === '') {
    return res.status(200).json(files);
  }
  return res.status(200).json(files.filter(({ name }) => name.includes(searchTerm)));
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

// app.get('/talker/search', (req, res) => {
  // 9
  // const { rate } = req.query
// });

// app.get('/talker/search', (req, res) => {
  // 10
  // const { date } = req.query
// });

// app.patch('/talker/rate/:id', (req, res) => {
  // 11
// });

// app.get('/talker/db', (req, res) => {
  // 12
// });

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

app.listen(PORT, () => {
  console.log('Online');
});
