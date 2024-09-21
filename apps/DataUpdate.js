import fs from 'fs/promises';
import path from 'path';

const Gupdate =/^(#|\/)?玩家数据更新$/
export class Kc extends plugin {
    constructor() {
        super({
            name: 'dataupdate',
            dsc: '玩家数据更新',
            event: 'message',
            priority: 1,
            rule: [
                { 
                 reg: Gupdate,
                 fnc: 'gupdate' 
                }
            ]
        })
    }

    async gupdate(e){
      if (e.isGroup) 
        return e.reply(['覆盖数据是危险的，仅能在私聊覆盖'])
        const newEntry = {
            mlv: 0,
            lv: 0,
            qy: 0
        };  
        const ID = [e.user_id]
        const currentWorkingDirectory = process.cwd();
          // 定义保存文件的路径
        const filePath = path.join(currentWorkingDirectory, 'plugins' , 'KnockMuYu-plugin', 'data', 'player', ID + '.json');
    
        fs.readFile(filePath)
        .then((data) => {
          try {
            // 解析现有 JSON 数据为一个对象
            let jsonData = JSON.parse(data);
      
            // 添加新的键值对
            jsonData = { ...jsonData, ...newEntry };
      
            // 将修改后的对象转换回 JSON 字符串
            const updatedJsonString = JSON.stringify(jsonData, null, 2);
      
            // 将更新后的 JSON 字符串写回文件
            return fs.writeFile(filePath, updatedJsonString);
          } catch (err) {
            // 如果解析 JSON 时发生错误，打印错误信息
            console.error('Error parsing JSON data:', err);
          }
        })
        .then(() => console.log('JSON data updated and saved to', filePath))
        .catch((err) => {
          // 如果写入文件时发生错误，打印错误信息
          console.error('Error writing file:', err);
        });
        return e.reply('数据覆盖完成')
    }
}