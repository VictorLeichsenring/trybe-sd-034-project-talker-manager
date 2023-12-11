const express = require('express');
const { getAllTakers, getTalkerById } = require('./talkerManager');
const generateToken = require('./utils/generateToken');

const app = express();
app.use(express.json());

const HTTP_OK_STATUS = 200;
const PORT = process.env.PORT || '3001';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.get('/talker', async (req, res) => {
  const talkers = await getAllTakers();
  res.status(200).json(talkers);
});

app.get('/talker/:id', async (req, res) => {
  const { id } = req.params;
  const talker = await getTalkerById(Number(id));
  if (!talker) return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
  res.status(200).json(talker);
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const token = generateToken();
  if ([email, password].includes(undefined)) {
    return res.status(401).json({ message: 'Campos ausentes!' });
  }
  return res.status(200).json({ token });
});

app.listen(PORT, () => {
  console.log('Online');
});
