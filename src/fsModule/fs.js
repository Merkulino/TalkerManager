const fs = require('fs').promises;

const getFiles = async (PATH) => {
  try {
    const files = await fs.readFile(PATH);
    return JSON.parse(files);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getFiles,
};