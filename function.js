/**这里的模块导出借鉴面包文游,仅是在其基础移除了创立群文件夹群使其可以跨群 */

import fs from 'fs'; 
import fsp from 'fs/promises'
import path from 'path'; 
import Yaml from 'yaml';

export const PLUGIN_PATH = path.join(path.resolve(), 'plugins', 'KnockMuYu-plugin');

const FILE_PATH = {
    player: path.join(PLUGIN_PATH, 'data', 'player'),
    config: path.join(PLUGIN_PATH, 'config.yaml')
};

/** 读取玩家数据 */
export async function getPlayerData(ID) {
    const DATA = await JSON.parse(fs.readFileSync(path.join(FILE_PATH['player'], ID + '.json'), 'utf8'))
    return DATA
}

/** 存储玩家数据 */
export function storagePlayerData(ID, DATA) {
    fs.writeFileSync(path.join(FILE_PATH['player'], ID + '.json'), JSON.stringify(DATA, null, 4));
}

/** 判断玩家是否存在 */
export function isPlayerExist(ID) {
    if (fs.existsSync(path.join(FILE_PATH['player'], ID + '.json'))) {
        return true
    }
    return false
}

/** 读取配置 */
export async function readConfiguration() {
    const DATA = Yaml.parse(fs.readFileSync(FILE_PATH['config'], 'utf-8'))
    return DATA
}

/** 将时间戳转换为秒 */
export function timestampToSeconds(TIMESTAMP) {
    return Math.floor(TIMESTAMP / 1000);
}

/** 秒转换为分钟和秒 */
export function convertSecToMinAndSec(seconds) {
    let minutes = Math.floor(seconds / 60);
    let remainingSeconds = seconds % 60;
    return { minutes, remainingSeconds };
}

/** 当前日期 */
export function getCurrentDate() {
    return new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })
}

export async function writeGameData(ID, newEntry){
    const currentWorkingDirectory = process.cwd();
    // 定义保存文件的路径
    const filePath = path.join(currentWorkingDirectory, 'plugins' , 'KnockMuYu-plugin', 'data', 'player', ID + '.json');

    const data = await fsp.readFile(filePath)
            // 解析现有 JSON 数据为一个对象
    let jsonData = JSON.parse(data);

            // 添加新的键值对
    jsonData = { ...jsonData, ...newEntry };

            // 将修改后的对象转换回 JSON 字符串
    const updatedJsonString = JSON.stringify(jsonData, null, 2);

            // 将更新后的 JSON 字符串写回文件
    return fsp.writeFile(filePath, updatedJsonString);

}