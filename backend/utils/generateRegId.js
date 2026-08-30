// utils/generateRegId.js
// Generates an 8-digit unique numeric string for user registration ID

const generateRegId = () => {
  // Generate a random number between 10000000 and 99999999
  const min = 10000000;
  const max = 99999999;
  const id = Math.floor(Math.random() * (max - min + 1)) + min;
  return id.toString();
};

module.exports = generateRegId;
