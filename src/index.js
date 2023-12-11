const express = require('express');
const { getAllTakers } = require('./talkerManager');

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

app.listen(PORT, () => {
  console.log('Online');
});
