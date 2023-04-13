const express = require('express');

const router = express.Router();
const connection = require('../db/connection');
const { getFiles, setFiles } = require('../fsModule/fs');
const { tokenValidation, talkerValidate } = require('../validation');

const TALKER_PATH = './src/talker.json';

const filterQuerys = (q, rate, date, file) => {
  let queryFiltered = file;
  if (q) queryFiltered = queryFiltered.filter(({ name }) => name.includes(q));
  if (rate) queryFiltered = queryFiltered.filter(({ talk }) => talk.rate === Number(rate));
  if (date) queryFiltered = queryFiltered.filter(({ talk }) => talk.watchedAt === date); 
  
  return queryFiltered;
};

router.get('/search',
  tokenValidation,
  talkerValidate.rateValidation,
  talkerValidate.dateValidation,
  async (req, res) => {
  const { q: search, rate, date } = req.query;
  const files = await getFiles(TALKER_PATH);

  if (!search && !rate && !date) {
    return res.status(200).json(files);
  }

  const querys = filterQuerys(search, rate, date, files);
  
  return res.status(200).json(querys);
});

router.get('/db', async (req, res) => {
  const [talkers] = await connection.execute('SELECT * FROM talkers');
  const newTalkersList = talkers.map((talker) => ({ 
    name: talker.name,
    age: talker.age,
    id: talker.id,
    talk: { rate: talker.talk_rate, watchedAt: talker.talk_watched_at },
   }));
  res.status(200).json(newTalkersList);
});

router.get('', async (req, res) => {
  const files = await getFiles(TALKER_PATH); 
  if (files) return res.status(200).json(files);
  return res.status(400).json({ message: 'Deu ruim' });
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const files = await getFiles(TALKER_PATH);
  const fileSelected = files.find((file) => file.id === Number(id));
  if (fileSelected) return res.status(200).json(fileSelected);
  res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
});

router.delete('/:id', tokenValidation, async (req, res) => {
  const { id } = req.params;
  const files = await getFiles(TALKER_PATH);
  if (!(files.find((file) => file.id === Number(id)))) {
    return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
  } 
  const newFiles = files.filter((file) => file.id !== Number(id));
  await setFiles(TALKER_PATH, newFiles);
  return res.status(204).end();
});

router.patch('/rate/:id', 
  tokenValidation,
  talkerValidate.pathRateValidation,
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

router.use(tokenValidation);
router.use(talkerValidate.nameField);
router.use(talkerValidate.ageFied);
router.use(talkerValidate.talkField);
router.use(talkerValidate.talkFieldRate);
router.use(talkerValidate.talkFieldWatchedAt);

router.post('',
  async (req, res) => {
    const obj = req.body;
    const files = await getFiles(TALKER_PATH);
    const newID = files.length + 1;
    const newFile = [...files, { id: newID, ...obj }];
    await setFiles(TALKER_PATH, newFile);
    return res.status(201).json({ id: newID, ...obj });
});

router.put('/:id',
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

module.exports = router;