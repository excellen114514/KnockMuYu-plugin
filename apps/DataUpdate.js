
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
      if (!isPlayerExist(ID[0])) {
        e.reply("你还没有木鱼哦~发送 查看木鱼 来获得你的第一个木鱼吧！")
      }
      const ID = [e.user_id]
      const USER_DATA = await getPlayerData(ID[0]);
      if(USER_DATA.hasOwnProperty('lv')){
        
        e.reply(`lv已经存在,开始写入下一个键值`)
       }else {
        const newEntry = {lv: 0};
        writeGameData(ID, newEntry);
        e.reply(`lv写入完成`)
       }
      if(USER_DATA.hasOwnProperty('mlv')){
        e.reply(`mlv已经存在，开始写入下一个键值`)
      }else {
        const newEntry ={mlv: "凡人"};
        writeGameData(ID, newEntry)
        e.reply(`mlv写入完成`)
      }
      if(USER_DATA.hasOwnProperty('qy')){
        e.reply(`qy已经存在，开始写入下一个键值`)
      }else {
        const newEntry ={qy: 0};
        writeGameData(ID, newEntry)
        e.reply(`qy写入完成`)
      }
      const newEntry ={ cd: { knock: 0, random: 0,money: 0, break:0},
      log: { knock: [], random: [], money: [], break:[]}}
      writeGameData(ID, newEntry)
      return e.reply(`完成，重新刷新冷却与日志`)
    }
}