/**
 * 用于构建时生成健康检查文件 version.json
 * @author dxf
 */

const path = require('path');
const fs = require('fs');
const shell = require('shelljs');

const pkg = require(path.join(process.cwd(), 'package.json'));

process.stdout.write('generate version.json...\n');

const writeFile = (fileName, data) => new Promise((resolve, reject) => {
  fs.writeFile(fileName, data, (error, value) => {
    return error ? reject(error) : resolve(value);
  });
});

(async function main() {
  const VERSION_FILE = 'app/assets/version.json';
  if (fs.existsSync(VERSION_FILE)) {
    console.log('文件已经存在，重新生成！');
    shell.rm('-rf', path.join(process.cwd(), 'app/assets/version.js'));
  }
  const data = {
    'name': pkg.name,
    'version': pkg.version,
    'git_commit': 'GIT_COMMITID',
    'git_branch': 'GIT_BRANCH'
  };
  await writeFile(VERSION_FILE, `${JSON.stringify(data, null, 2)}\n`);
  console.log('创建version.js成功');
}());
