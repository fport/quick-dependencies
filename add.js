const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');

inquirer
  .prompt([
    {
      type: 'input',
      name: 'packageName',
      message: 'Lütfen paket adını girin:',
    },
  ])
  .then((answers) => {
    const folderName = answers.packageName;
    const folderPath = path.join(__dirname, 'app', folderName);
    const sourcePath = path.join(__dirname, 'orchestra', 'package.json');
    const destPath = path.join(folderPath, 'package.json');

    fs.mkdirSync(folderPath);

    fs.copyFileSync(sourcePath, destPath);

    const packageJsonPath = path.join(folderPath, 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    packageJson.name = folderName;
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

    console.log(`${folderName} host created.`);
  });

