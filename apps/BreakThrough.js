import {
    getPlayerData,
    readConfiguration,
    storagePlayerData,
    timestampToSeconds,
    convertSecToMinAndSec,
    getCurrentDate,
    isPlayerExist
} from '../function.js';
import lodash from 'lodash'
const Break =/^(#|\/)?突破$/
const Mbreak =/^(#|\/)?境界突破$/
const Disaster = /^(#|\/)?渡劫$/
let ciku = ['练气', '筑基', '金丹', '元婴', '化神', '炼虚', '大乘', '渡劫', '真仙', '金仙', '太乙', '大罗', '道祖']
export class gmy extends plugin {
    constructor() {
        super({
            name: '突破',
            dsc: '等级突破',
            event: 'message',
            priority: 1,
            rule: [
                { 
                 reg: Break,
                 fnc: 'break' 
                },
                {
                  reg: Disaster,
                  fnc: 'disaster'
                },
                {
                  reg: Mbreak,
                  fnc: 'mbreak'
                }
            ]
        })
    }

    async break(e){
        if (!e.isGroup) 
            return e.reply(['木鱼只能在群聊敲哦~'])
        /** 配置数据 */
        const configData = await readConfiguration()
        const ID = [e.user_id]
        if (!isPlayerExist(ID[0])) {
            e.reply("你还没有木鱼哦~发送 查看木鱼 来获得你的第一个木鱼吧！")
        }

             // 获取玩家数据
        const USER_DATA = await getPlayerData(ID[0]);

        // 获取玩家的当前功德与等级
         const USER_NUMBER = USER_DATA['number']
        const USER_LEVEL = USER_DATA['lv']
        // 获取当前时间（以秒为单位）
        const CURRENT_SECOND = timestampToSeconds(Date.now());
  
        // 计算剩余冷却时间
        const REMAINING_TIME = CURRENT_SECOND - USER_DATA['cd']['break'];
 
        // 如果剩余冷却时间小于0，表示玩家可以再次敲木鱼
        if (REMAINING_TIME < 0) {
          // 将剩余冷却时间转换为分钟和秒
          const { minutes, remainingSeconds } = convertSecToMinAndSec(Math.abs(REMAINING_TIME));
 
        // 根据剩余时间向用户发送消息
        if (minutes > 0) {
            return e.reply([`突破自身是很耗神费力的！暂时不能突破哦~~\n还有${minutes}分${remainingSeconds}秒冷却`]);
        } else {
            return e.reply([`突破自身是很耗神费力的！暂时不能突破哦~~\n${remainingSeconds}秒冷却`]);
        }
      }
        let mlv = (USER_DATA['mlv'] += 1);    
        if(USER_NUMBER >= mlv ){
          USER_DATA['cd']['break'] = CURRENT_SECOND + configData['cd_break'];
          USER_DATA['log']['break'].push(`[${getCurrentDate()}]突破了一级`);
          USER_DATA['number'] -= mlv * 10000 ;
          USER_DATA['lv'] += 1;
          let msg = `你气脉涌动，木鱼泛出金光！刹那间，天地好像为之静止！\n你现在的等级为${USER_LEVEL + 1}`;
          // 将更新后的玩家数据存储到数据库
          storagePlayerData(ID[0], USER_DATA);
          await e.reply([msg]);
        }else{
          return e.reply(`你的功德不够！`)
        }
         
       
      
}
   async disaster(e){
        if (!e.isGroup) 
          return e.reply(['木鱼只能在群聊敲哦~'])
        /** 配置数据 */
        const configData = await readConfiguration()
        const ID = [e.user_id]
        if (!isPlayerExist(ID[0])) {
           e.reply("你还没有木鱼哦~发送 查看木鱼 来获得你的第一个木鱼吧！")
        }

       // 获取玩家数据
        const USER_DATA = await getPlayerData(ID[0]);

        const USER_NUMBER = USER_DATA['number']
        const USER_LEVEL = USER_DATA['lv']
         // 获取当前时间（以秒为单位）
        const CURRENT_SECOND = timestampToSeconds(Date.now());

        // 计算剩余冷却时间
        const REMAINING_TIME = CURRENT_SECOND - USER_DATA['cd']['break'];

        // 如果剩余冷却时间小于0，表示玩家可以再次敲木鱼
        if (REMAINING_TIME < 0) {
        // 将剩余冷却时间转换为分钟和秒
        const { minutes, remainingSeconds } = convertSecToMinAndSec(Math.abs(REMAINING_TIME));

        // 根据剩余时间向用户发送消息
        if (minutes > 0) {
           return e.reply([`抗下雷劫是很耗神费力的！暂时不能渡劫哦~~\n还有${minutes}分${remainingSeconds}秒冷却`]);
        } else {
           return e.reply([`抗下雷劫是很耗神费力的！暂时不能渡劫哦~~\n${remainingSeconds}秒冷却`]);
       }
      }
        if(USER_LEVEL < 80 ){
           e.reply(`你的境界不够！`)
          return 
        }else{
          e.reply('乌云密布，雷劫即将开始......\n五秒后下一次雷劫！一次雷劫失去34000功德！')
        }
        const Leijie = lodash.random(configData['min_Leijie'], configData['max_Leijie']);
        let count = 1;
        let user = USER_NUMBER
       
        const interval = setInterval(() => {
          if(count < Leijie){
            if (user < 0) {
              e.reply(`渡劫失败，所剩功德不足！`);
              clearInterval(interval);
            } else {
              user -= 34000;
              let msg = `天地滚滚，降下雷劫,你需要抗住${Leijie}道雷劫，这是第${count}道雷劫!`; 
              e.reply([msg]);
            }      
          }else if (count === Leijie) {
             clearInterval(interval);
             USER_DATA['cd']['break'] = CURRENT_SECOND + configData['cd_break'];
             USER_DATA['log']['break'].push(`[${getCurrentDate()}]雷劫一次`);
             USER_DATA['lv'] += 2;
             let dujie = Leijie * 34000
             USER_DATA['number'] -= dujie
             e.reply(`你扛下了所有雷劫！等级加5\n当前等级为${USER_LEVEL + 1}`)
             storagePlayerData(ID[0], USER_DATA);
    }
    count++;
     }, 5000)

  
}
   async mbreak(e){
     if (e.isGroup) 
      return e.reply(['木鱼只能在群聊敲哦~'])
      /** 配置数据 */
      const configData = await readConfiguration()
      const ID = [e.user_id]
      if (!isPlayerExist(ID[0])) {
        e.reply("你还没有木鱼哦~发送 查看木鱼 来获得你的第一个木鱼吧！")
    }

     // 获取玩家数据
     const USER_DATA = await getPlayerData(ID[0]);

     const USER_NUMBER = USER_DATA['number'];
     const USER_LEVEL = USER_DATA['lv'];
   
     // 获取当前时间（以秒为单位）
     const CURRENT_SECOND = timestampToSeconds(Date.now());

    // 计算剩余冷却时间
     const REMAINING_TIME = CURRENT_SECOND - USER_DATA['cd']['break'];

     // 如果剩余冷却时间小于0，表示玩家可以再次敲木鱼
     if (REMAINING_TIME < 0) {
     // 将剩余冷却时间转换为分钟和秒
     const { minutes, remainingSeconds } = convertSecToMinAndSec(Math.abs(REMAINING_TIME));

     // 根据剩余时间向用户发送消息
     if (minutes > 0) {
        return e.reply([`境界突破是很耗神费力的！暂时不能渡劫哦~~\n还有${minutes}分${remainingSeconds}秒冷却`]);
     } else {
        return e.reply([`境界突破是很耗神费力的！暂时不能渡劫哦~~\n${remainingSeconds}秒冷却`]);
     }
    }
    let mlv = (USER_DATA['mlv'] + 1) * 20 ;
    let mlv1 = (USER_DATA['mlv'] + 1);
    if(USER_LEVEL >= mlv && USER_NUMBER >= mlv1){
      if(USER_DATA['mlv'] === 12 ){
        return e.reply(`境界圆满！`);
      }
      USER_DATA['cd']['break'] = CURRENT_SECOND + configData['cd_break'];
      USER_DATA['log']['break'].push(`[${getCurrentDate()}]境界突破一级`);
      USER_DATA['number'] -= mlv1 * 10000;
      USER_DATA['mlv'] += 1;
      storagePlayerData(ID[0], USER_DATA);
      await e.reply(`境界突破！请发送 查看木鱼 来查看自己等级`);
    }else{
      return e.reply(`你的等级or功德不够！`);
    } 

}
}
