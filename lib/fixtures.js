'use strict';

const fs = require('fs');
const path = require('path');

class Fixtures {
  constructor(config) {
    const _config = config || {};
    this.fixtures = {};
    this.fixturesDir = _config.fixturesDir || 'fixtures';
    this.testDirName = _config.testDirName || 'test';
    this.loadFixtures();
  }

  get(fixtureName, index) {
    return this.fixtures[fixtureName][index]; // TODO: check if it is actually an array
  }

  getAll() {
    return this.fixtures;
  }

  loadFixtures() {
    const fixturesPath = path.join(process.cwd(), this.testDirName, this.fixturesDir);

    if (!fs.existsSync(fixturesPath)) {
      throw new Error('Fixtures path not found.');
    }

    const fixtureFiles = fs.readdirSync(fixturesPath);

    fixtureFiles.forEach(file => {
      const ext = path.extname(file);
      const baseName = path.basename(file, ext);

      if (ext === '.js') {
        this.fixtures[baseName] = require(path.join(fixturesPath, file));
        return;
      }

      if (ext === '.json') {
        this.fixtures[baseName] = JSON.parse(fs.readFileSync(path.join(fixturesPath, file), 'utf8'));
      }
    });
  }
}

module.exports = new Fixtures();