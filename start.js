require = require('esm')(module /*, options*/);
const inquirer = require('inquirer');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, './');
const appDir = path.resolve(rootDir, 'app');

const getDirectories = source =>
    fs.readdirSync(source, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);

const questions = [
    {
        type: 'checkbox',
        name: 'files',
        message: 'Hangi dosyaların bağlantılarını yüklemek istiyorsunuz?',
        choices: getDirectories(appDir),
        validate(answer) {
            if (answer.length < 1) {
                return 'En az bir dosya seçmelisiniz.';
            }
            return true;
        },
    },
];

const run = async () => {
    const { files } = await inquirer.prompt(questions);
    for (const file of files) {
        try {
            console.log(`"${file}" dosyası için bağımlılıklar yükleniyor...`);
            await exec(`cd ${appDir}/${file} && npm install`);
            console.log(`"${file}" dosyası için bağımlılıklar başarıyla yüklendi.`);
        } catch (err) {
            console.error(`"${file}" dosyası için bağımlılıkları yüklerken bir hata oluştu:`, err);
        }
    }
};

run();

