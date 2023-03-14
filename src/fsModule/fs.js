const fs = require('fs').promises;

const getFiles = async (PATH) => {
  try {
    const files = await fs.readFile(PATH);
    return JSON.parse(files);
  } catch (error) {
    console.log(error);
  }
};

const setFiles = async (PATH, obj) => {
  try {
    await fs.writeFile(PATH, JSON.stringify(obj));
  } catch (e) {
    console.log('erro na escrita de arquivo', e.message);
  }
};

module.exports = {
  getFiles,
  setFiles,
};