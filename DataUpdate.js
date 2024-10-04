
import {
  getPlayerData,
  isPlayerExist,
  writeGameData
} from '../function.js';

const Gupdate = /^(#|\/)?玩家数据更新$/
const Mupdate =/^(#|\/)?境界更新$/
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
                },
                { 
                  reg: Mupdate,
                  fnc: 'mupdate' 
                }
            ]
        })
    }

    async gupdate(e){
      if (e.isGroup) 
      return e.reply(['覆盖数据是危险的，仅能在私聊覆盖'])
      const ID = [e.user_id]
      if (!isPlayerExist(ID[0])) {
        e.reply("你还没有木鱼哦~发送 查看木鱼 来获得你的第一个木鱼吧！")
      }
      const USER_DATA = await getPlayerData(ID[0]);

      if ('lv' in USER_DATA) {
        e.reply('lv已经存在');
      } else {
        const newEntry = { lv: 0 };
        await writeGameData(ID, newEntry);
        e.reply('lv写入完成');
      }
      
      if ('mlv' in USER_DATA) {
        e.reply('mlv已经存在');
      } else {
        const newEntry = { mlv: 0 };
        await writeGameData(ID, newEntry);
        e.reply('mlv写入完成');
      }
        
      if ('qy' in USER_DATA) {
        e.reply('qy已经存在');
      } else {
        const newEntry = { qy: 0 };
        await writeGameData(ID, newEntry);
        e.reply('qy写入完成');
      }

      if ('mlvv' in USER_DATA) {
        e.reply('mlvv已经存在');
      } else {
        const newEntry = { mlvv: 0 };
        await writeGameData(ID, newEntry);
        e.reply('mlvv写入完成');
      }
       
      const newEntry = {cd: { knock: 0, random: 0,money: 0, break:0, fight: 0},
      log: { knock: [], random: [], money: [], break:[], fight: []}};
      await writeGameData(ID, newEntry)
      e.reply('刷新冷却和清空日志')
    }

    async mupdate(e){
      if (e.isGroup) 
        return e.reply(['覆盖数据是危险的，仅能在私聊覆盖'])
        const ID = [e.user_id]
        if (!isPlayerExist(ID[0])) {
          e.reply("你还没有木鱼哦~发送 查看木鱼 来获得你的第一个木鱼吧！")
        }
        const USER_DATA = await getPlayerData(ID[0]);
        if(USER_DATA['mlvv'] === 1){
          e.reply('你已经更新完境界了')
        }else{
          if(USER_DATA['lv'] < 10){
            const newEntry = { mlv: 0 };
            await writeGameData(ID, newEntry);
          }else if(USER_DATA['lv'] < 20){
            const newEntry = { mlv: 1 };
            await writeGameData(ID, newEntry);
          }else if(USER_DATA['lv'] < 30){
            const newEntry = { mlv: 2 };
            await writeGameData(ID, newEntry);
          }else if(USER_DATA['lv'] < 40){
            const newEntry = { mlv: 3 };
            await writeGameData(ID, newEntry);
          }else if(USER_DATA['lv'] < 50){
            const newEntry = { mlv: 4 };
            await writeGameData(ID, newEntry);
          }else if(USER_DATA['lv'] < 60){
            const newEntry = { mlv: 5 };
            await writeGameData(ID, newEntry);
          }else if(USER_DATA['lv'] < 70){
            const newEntry = { mlv: 6 };
            await writeGameData(ID, newEntry);
          }else if(USER_DATA['lv'] < 80){
            const newEntry = { mlv: 7 };
            await writeGameData(ID, newEntry);
          }else if(USER_DATA['lv'] < 100){
            const newEntry = { mlv: 8 };
            await writeGameData(ID, newEntry);
          }else if(USER_DATA['lv'] < 130){
            const newEntry = { mlv: 9 };
            await writeGameData(ID, newEntry);
          }else if(USER_DATA['lv'] < 170){
            const newEntry = { mlv: 10 };
            await writeGameData(ID, newEntry);
          }else if(USER_DATA['lv'] < 220){
            const newEntry = { mlv: 11 };
            await writeGameData(ID, newEntry);
          }else if(USER_DATA['lv'] < 280 || USER_DATA['lv'] >= 280){
            const newEntry = { mlv: 12 };
            await writeGameData(ID, newEntry);
          }
          const newEntry = {mlvv: 1};
          await writeGameData(ID, newEntry);  
          await e.reply(`你的等级为${USER_DATA['lv']}，写入了对应境界\n请发送 查看木鱼 来得知详情`);
        }
        
    }
}