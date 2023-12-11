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

module.exports = {
  getAllTakers,
  getTalkerById,
  addTalker,
};