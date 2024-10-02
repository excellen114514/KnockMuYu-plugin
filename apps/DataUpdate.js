
import {
  getPlayerData,
  isPlayerExist,
  writeGameData
} from '../function.js';

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
      const ID = [e.user_id]
      if (!isPlayerExist(ID[0])) {
        e.reply("你还没有木鱼哦~发送 查看木鱼 来获得你的第一个木鱼吧！")
      }
      const USER_DATA = await getPlayerData(ID[0]);

      if ('lv' in USER_DATA) {
        e.reply('lv已经存在,开始写入下一个键值');
      } else {
        const newEntry = { lv: 0 };
        await writeGameData(ID, newEntry);
        e.reply('lv写入完成');
      }
      
      if ('mlv' in USER_DATA) {
        e.reply('mlv已经存在，开始写入下一个键值');
      } else {
        const newEntry = { mlv: "" };
        await writeGameData(ID, newEntry);
        e.reply('mlv写入完成');
      }
      
      if ('qy' in USER_DATA) {
        e.reply('qy已经存在，开始写入下一个键值');
      } else {
        const newEntry = { qy: 0 };
        await writeGameData(ID, newEntry);
        e.reply('qy写入完成');
      }
       
      const newEntry = {cd: { knock: 0, random: 0,money: 0, break:0, fight: 0},
      log: { knock: [], random: [], money: [], break:[], fight: []}};
      await writeGameData(ID, newEntry)
      e.reply('刷新冷却和清空日志，请稍后。。。')
    }
}