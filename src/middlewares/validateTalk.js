// Validação do campo 'talk'
function validateTalk(talk) {
  if (!talk) return 'O campo "talk" é obrigatório';
}

// Validação do formato de 'watchedAt'
function validateWatchedAt(watchedAt) {
  if (!watchedAt) return 'O campo "watchedAt" é obrigatório';

  const dateFormatRegex = /^\d{2}\/\d{2}\/\d{4}$/;
  if (!dateFormatRegex
    .test(watchedAt)) return 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"';
}

// Verifica se 'rate' está definido
function isRateDefined(rate) {
  return rate !== undefined;
}

// Verifica se 'rate' é um número
function isRateNumber(rate) {
  return typeof rate === 'number';
}

// Verifica se 'rate' está no intervalo permitido e é inteiro
function isRateValid(rate) {
  return rate >= 1 && rate <= 5 && Number.isInteger(rate);
}

// Validação do valor de 'rate'
function validateRate(rate) {
  if (!isRateDefined(rate)) return 'O campo "rate" é obrigatório';
  if (!isRateNumber(rate)) return 'O campo "rate" deve ser um número';
  if (!isRateValid(rate)) return 'O campo "rate" deve ser um número inteiro entre 1 e 5';

  return null;
}

// Middleware
module.exports = (req, res, next) => {
  const { talk } = req.body;

  const talkError = validateTalk(talk);
  if (talkError) return res.status(400).json({ message: talkError });

  const watchedAtError = validateWatchedAt(talk.watchedAt);
  if (watchedAtError) return res.status(400).json({ message: watchedAtError });

  const rateError = validateRate(talk.rate);
  if (rateError) return res.status(400).json({ message: rateError });

  next();
};
