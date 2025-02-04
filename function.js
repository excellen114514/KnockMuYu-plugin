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

// 读取文件夹内所有JSON文件的路径
export async function getFilePaths(folder) {
    const files = await fsp.readdir(folder);
    return files
        .filter(file => path.extname(file) === '.json')
        .map(file => path.join(folder, file));
}

// 读取并解析JSON文件，捕获异常
export async function readJsonFile(filePath) {
    try {
        const data = await fsp.readFile(filePath, 'utf8');
        const jsonData = JSON.parse(data);
        // 确保name、lv和mlv都存在
        if (jsonData.name !== undefined && jsonData.lv !== undefined && jsonData.mlv !== undefined) {
            return { name: jsonData.name, lv: jsonData.lv, mlv: jsonData.mlv };
        } else {
            console.warn(`文件 ${filePath} 中缺少 'name'、'lv' 或 'mlv' 键，跳过该文件`);
            return null;
        }
    } catch (error) {
        console.error(`处理文件 ${filePath} 时出错，跳过该文件:`, error);
        return null; // 返回null表示该文件处理失败
    }
}

// 主调取函数
export async function compareLvValues(folder) {
    try {
        // 获取所有JSON文件的路径
        const filePaths = await getFilePaths(folder);

        // 读取所有文件并提取name、lv和mlv
        const playerPromises = filePaths.map(filePath => readJsonFile(filePath));
        const playerData = await Promise.all(playerPromises);

        // 过滤掉因错误而返回的null值以及lv或mlv为undefined的条目
        const validPlayers = playerData.filter(player => player !== null && player.lv !== undefined && player.mlv !== undefined);

        // 根据mlv降序排序，如果mlv相同，则根据lv降序排序
        const sortedPlayers = validPlayers.sort((a, b) => {
            if (b.mlv !== a.mlv) {
                return b.mlv - a.mlv;
            } else {
                return b.lv - a.lv;
            }
        });
        let ciku = ['练气', '筑基', '金丹', '元婴', '化神', '炼虚', '大乘', '渡劫', '真仙', '金仙', '太乙', '大罗', '道祖'];
        let Mlv 
        // 生成字符串
        const resultString = sortedPlayers.map(player => `${player.name}的等级是${player.lv}，境界是${Mlv = ciku[player.mlv]}`).join('，\n');
        return `${resultString}`; // 返回格式化的字符串
    } catch (error) {
        console.error('处理文件时出错:', error);
        return '出错了，请检查文件夹路径或文件内容'; // 返回错误信息
    }
}