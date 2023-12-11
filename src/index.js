const express = require('express');
const { getAllTakers, getTalkerById, addTalker, updateTalker, deleteTalker } = require('./talkerManager');
const generateToken = require('./utils/generateToken');
const validateLogin = require('./middlewares/validadeLogin');
const auth = require('./middlewares/auth');
const validateName = require('./middlewares/validateName');
const validateAge = require('./middlewares/validateAge');
const validateTalk = require('./middlewares/validateTalk');

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

app.get('/talker/search', auth, async (req, res) => {
  const { q: searchTerm } = req.query;
  try {
    const talkers = await getAllTakers();

    // Se searchTerm não for fornecido ou estiver vazio, retorna todos os talkers
    if (!searchTerm) {
      return res.status(200).json(talkers);
    }
    // Filtra talkers cujo nome contém o termo de pesquisa
    const filteredTalkers = talkers.filter((talker) =>
      talker.name.toLowerCase().includes(searchTerm.toLowerCase()));

    return res.status(200).json(filteredTalkers);
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao buscar palestrantes' });
  }
});

app.get('/talker/:id', async (req, res) => {
  const { id } = req.params;
  const talker = await getTalkerById(Number(id));
  if (!talker) return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
  res.status(200).json(talker);
});

app.post('/login', validateLogin, (req, res) => {
  const { email, password } = req.body;
  const token = generateToken();
  if ([email, password].includes(undefined)) {
    return res.status(401).json({ message: 'Campos ausentes!' });
  }
  return res.status(200).json({ token });
});

app.post('/talker',
  auth,
  validateName,
  validateAge,
  validateName,
  validateTalk,
  async (req, res) => {
    const talkerData = req.body;
    const talker = await addTalker(talkerData);
    return res.status(201).json(talker);
  });

app.put('/talker/:id',
  auth,
  validateName,
  validateAge,
  validateTalk,
  async (req, res) => {
    const { id } = req.params;
    const newTalkerData = req.body;

    try {
      const updatedTalker = await updateTalker(Number(id), newTalkerData);
      if (!updatedTalker) {
        return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
      }
      return res.status(200).json(updatedTalker);
    } catch (error) {
      return res.status(500).json({ message: 'Erro ao atualizar o palestrante' });
    }
  });

app.delete('/talker/:id', auth, async (req, res) => {
  const { id } = req.params;

  try {
    const result = await deleteTalker(Number(id));
    if (result === null) {
      return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
    }
    return res.status(204).end(); // Sem conteúdo na resposta
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao deletar o palestrante' });
  }
});

app.listen(PORT, () => {
  console.log('Online');
});
