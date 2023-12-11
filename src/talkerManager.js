const fs = require('fs').promises;
const { join } = require('path');

const readTalkerManagerFile = async () => {
  const path = './talker.json';
  try {
    const contentFile = await fs.readFile(join(__dirname, path), 'utf-8');
    return JSON.parse(contentFile);
  } catch (error) {
    return null;
  }
};

const whriteTalkerManegerFile = async (talkers) => {
  const path = './talker.json';
  try {
    const contentFile = await fs.writeFile(join(__dirname, path), talkers);
    return JSON.parse(contentFile);
  } catch (error) {
    return null;
  }
};

const getAllTakers = async () => {
  const talkers = await readTalkerManagerFile();
  return talkers;
};

const getTalkerById = async (id) => {
  const talkers = await readTalkerManagerFile();
  return talkers.find((talker) => talker.id === id);
};

const addTalker = async (talkerData) => {
  const oldTalkers = await readTalkerManagerFile();
  const { name, age, talk } = talkerData;
  const newTalker = {
    id: oldTalkers[oldTalkers.length - 1].id + 1,
    name,
    age,
    talk,
  };
  const updatedTalkers = JSON.stringify([...oldTalkers, newTalker]);
  await whriteTalkerManegerFile(updatedTalkers);
  return newTalker;
};

const updateTalker = async (id, newTalkerData) => {
  const talkers = await readTalkerManagerFile();
  if (!talkers) {
    throw new Error('Não foi possível ler o arquivo de talkers.');
  }

  const talkerIndex = talkers.findIndex((talker) => talker.id === id);
  if (talkerIndex === -1) {
    return null; // Talker não encontrado
  }

  // Atualiza os dados do talker
  talkers[talkerIndex] = { ...talkers[talkerIndex], ...newTalkerData };

  const updatedTalkers = JSON.stringify(talkers, null, 2);
  await whriteTalkerManegerFile(updatedTalkers);
  return talkers[talkerIndex];
};

const deleteTalker = async (id) => {
  const talkers = await readTalkerManagerFile();
  if (!talkers) {
    throw new Error('Não foi possível ler o arquivo de talkers.');
  }

  const filteredTalkers = talkers.filter((talker) => talker.id !== id);

  // Verifica se um talker foi realmente removido
  if (filteredTalkers.length === talkers.length) {
    return null; // Talker não encontrado
  }

  const updatedTalkers = JSON.stringify(filteredTalkers, null, 2);
  await whriteTalkerManegerFile(updatedTalkers);
  return id;
};

module.exports = {
  getAllTakers,
  getTalkerById,
  addTalker,
  updateTalker,
  deleteTalker,
};