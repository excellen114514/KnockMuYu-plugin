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
      if(USER_LEVEL === 0 && USER_NUMBER >= 6000){
        USER_DATA['cd']['break'] = CURRENT_SECOND + configData['cd_break'];
        USER_DATA['log']['break'].push(`[${getCurrentDate()}]突破了一级`);
        USER_DATA['number'] -= 6000;
        USER_DATA['lv'] += 1;
        let msg = `你气脉涌动，木鱼泛出金光！刹那间，天地好像为之静止！这是你的第一次突破~~\n你现在的等级为${USER_LEVEL + 1}`;
        // 将更新后的玩家数据存储到数据库
        storagePlayerData(ID[0], USER_DATA);
        e.reply([msg])
      }else if(USER_LEVEL < 10 && USER_NUMBER >= 8000){
        USER_DATA['cd']['break'] = CURRENT_SECOND + configData['cd_break'];
        USER_DATA['log']['break'].push(`[${getCurrentDate()}]突破了一级`);
        USER_DATA['number'] -= 8000;
        USER_DATA['lv'] += 1;
        let msg = `你气脉涌动，木鱼泛出金光！刹那间，天地好像为之静止！\n你现在的等级为${USER_LEVEL + 1}`;
        // 将更新后的玩家数据存储到数据库
        storagePlayerData(ID[0], USER_DATA);
        e.reply([msg])
      }else if(USER_LEVEL === 10 && USER_NUMBER >= 10000){
        USER_DATA['cd']['break'] = CURRENT_SECOND + configData['cd_break'];
        USER_DATA['log']['break'].push(`[${getCurrentDate()}]突破了一级,境界加一`);
        USER_DATA['number'] -= 10000;
        USER_DATA['lv'] += 1;
        let msg = `你气脉涌动，木鱼泛出金光！刹那间，天地好像为之静止！\n你现在的等级为${USER_LEVEL + 1}`;
        // 将更新后的玩家数据存储到数据库
        storagePlayerData(ID[0], USER_DATA);
        e.reply([msg])
      }else if(USER_LEVEL < 20 && USER_NUMBER >= 12000){
        USER_DATA['cd']['break'] = CURRENT_SECOND + configData['cd_break'];
        USER_DATA['log']['break'].push(`[${getCurrentDate()}]突破了一级`);
        USER_DATA['number'] -= 12000;
        USER_DATA['lv'] += 1;
        let msg = `你气脉涌动，木鱼泛出金光！刹那间，天地好像为之静止！\n你现在的等级为${USER_LEVEL + 1}`;
        // 将更新后的玩家数据存储到数据库
        storagePlayerData(ID[0], USER_DATA);
        e.reply([msg])
      }else if(USER_LEVEL === 20 && USER_NUMBER >= 14000){
        USER_DATA['cd']['break'] = CURRENT_SECOND + configData['cd_break'];
        USER_DATA['log']['break'].push(`[${getCurrentDate()}]突破了一级`);
        USER_DATA['number'] -= 14000;
        USER_DATA['lv'] += 1;
        let msg = `你气脉涌动，木鱼泛出金光！刹那间，天地好像为之静止！\n你现在的等级为${USER_LEVEL + 1}`;
        // 将更新后的玩家数据存储到数据库
        storagePlayerData(ID[0], USER_DATA);
        e.reply([msg])
      }else if(USER_LEVEL < 30 && USER_NUMBER >= 16000){
        USER_DATA['cd']['break'] = CURRENT_SECOND + configData['cd_break'];
        USER_DATA['log']['break'].push(`[${getCurrentDate()}]突破了一级`);
        USER_DATA['number'] -= 16000;
        USER_DATA['lv'] += 1;
        let msg = `你气脉涌动，木鱼泛出金光！刹那间，天地好像为之静止！\n你现在的等级为${USER_LEVEL + 1}`;
        // 将更新后的玩家数据存储到数据库
        storagePlayerData(ID[0], USER_DATA);
        e.reply([msg])
      }else if(USER_LEVEL === 30 && USER_NUMBER >= 18000){
        USER_DATA['cd']['break'] = CURRENT_SECOND + configData['cd_break'];
        USER_DATA['log']['break'].push(`[${getCurrentDate()}]突破了一级,境界加一`);
        USER_DATA['number'] -= 18000;
        USER_DATA['lv'] += 1;
        let msg = `你气脉涌动，木鱼泛出金光！刹那间，天地好像为之静止！\n你现在的等级为${USER_LEVEL + 1}`;
        // 将更新后的玩家数据存储到数据库}，处于${
        storagePlayerData(ID[0], USER_DATA);
        e.reply([msg])
      }else if(USER_LEVEL < 40 && USER_NUMBER >= 20000){
        USER_DATA['cd']['break'] = CURRENT_SECOND + configData['cd_break'];
        USER_DATA['log']['break'].push(`[${getCurrentDate()}]突破了一级`);
        USER_DATA['number'] -= 20000;
        USER_DATA['lv'] += 1;
        let msg = `你气脉涌动，木鱼泛出金光！刹那间，天地好像为之静止！\n你现在的等级为${USER_LEVEL + 1}`;
        // 将更新后的玩家数据存储到数据库
        storagePlayerData(ID[0], USER_DATA);
        e.reply([msg])
      }else if(USER_LEVEL === 40 && USER_NUMBER >= 22000){
        USER_DATA['cd']['break'] = CURRENT_SECOND + configData['cd_break'];
        USER_DATA['log']['break'].push(`[${getCurrentDate()}]突破了一级,mlv+1`);
        USER_DATA['number'] -= 22000;
        USER_DATA['lv'] += 1;
        let msg = `你气脉涌动，木鱼泛出金光！刹那间，天地好像为之静止！\n你现在的等级为${USER_LEVEL + 1}`;
        // 将更新后的玩家数据存储到数据库
        storagePlayerData(ID[0], USER_DATA);
        e.reply([msg])
      }else if(USER_LEVEL < 50 && USER_NUMBER >= 24000){
        USER_DATA['cd']['break'] = CURRENT_SECOND + configData['cd_break'];
        USER_DATA['log']['break'].push(`[${getCurrentDate()}]突破了一级`);
        USER_DATA['number'] -= 24000;
        USER_DATA['lv'] += 1;
        let msg = `你气脉涌动，木鱼泛出金光！刹那间，天地好像为之静止！\n你现在的等级为${USER_LEVEL + 1}`;
        // 将更新后的玩家数据存储到数据库
        storagePlayerData(ID[0], USER_DATA);
        e.reply([msg])
      }else if(USER_LEVEL === 50 && USER_NUMBER >= 26000){
        USER_DATA['cd']['break'] = CURRENT_SECOND + configData['cd_break'];
        USER_DATA['log']['break'].push(`[${getCurrentDate()}]突破了一级,mlv+1`);
        USER_DATA['number'] -= 26000;
        USER_DATA['lv'] += 1;
        let msg = `你气脉涌动，木鱼泛出金光！刹那间，天地好像为之静止！\n你现在的等级为${USER_LEVEL + 1}`;
        // 将更新后的玩家数据存储到数据库
        storagePlayerData(ID[0], USER_DATA);
        e.reply([msg])
      }else if(USER_LEVEL < 60 && USER_NUMBER >= 28000){
        USER_DATA['cd']['break'] = CURRENT_SECOND + configData['cd_break'];
        USER_DATA['log']['break'].push(`[${getCurrentDate()}]突破了一级`);
        USER_DATA['number'] -= 28000;
        USER_DATA['lv'] += 1;
        let msg = `你气脉涌动，木鱼泛出金光！刹那间，天地好像为之静止！\n你现在的等级为${USER_LEVEL + 1}`;
        // 将更新后的玩家数据存储到数据库
        storagePlayerData(ID[0], USER_DATA);
        e.reply([msg])
      }else if(USER_LEVEL === 60 && USER_NUMBER >= 30000){
        USER_DATA['cd']['break'] = CURRENT_SECOND + configData['cd_break'];
        USER_DATA['log']['break'].push(`[${getCurrentDate()}]突破了一级,mlv+1`);
        USER_DATA['number'] -= 30000;
        USER_DATA['lv'] += 1;
        let msg = `你气脉涌动，木鱼泛出金光！刹那间，天地好像为之静止！\n你现在的等级为${USER_LEVEL + 1}`;
        // 将更新后的玩家数据存储到数据库
        storagePlayerData(ID[0], USER_DATA);
        e.reply([msg])
      }else if(USER_LEVEL < 80 && USER_NUMBER >= 32000){
        USER_DATA['cd']['break'] = CURRENT_SECOND + configData['cd_break'];
        USER_DATA['log']['break'].push(`[${getCurrentDate()}]突破了一级`);
        USER_DATA['number'] -= 32000;
        USER_DATA['lv'] += 1;
        let msg = `你气脉涌动，木鱼泛出金光！刹那间，天地好像为之静止！\n你现在的等级为${USER_LEVEL + 1}`;
        // 将更新后的玩家数据存储到数据库
        storagePlayerData(ID[0], USER_DATA);
        e.reply([msg])
      }else if(USER_LEVEL >= 80 ){
        e.reply(`你的境界已经来到了${USER_DATA['mlv']},只依靠木鱼突破已经不行了，请渡劫！！发送 渡劫 开始渡劫`)
      }
      else {
        e.reply('你的功德不够！继续敲木鱼吧~~（如果功德足够了但出现此msg，可能是你没有发送 玩家数据更新 导致的）')
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
    
    if(USER_LEVEL < 10 && USER_NUMBER >= 10000){
      USER_DATA['cd']['break'] = CURRENT_SECOND + configData['cd_break'];
      USER_DATA['log']['break'].push(`[${getCurrentDate()}]境界突破一级`);
      USER_DATA['number'] -= 10000;
      USER_DATA['mlv'] = 0;
      storagePlayerData(ID[0], USER_DATA);
      e.reply(`境界突破！现在你的境界为${ciku[0]}`);
    }else if(USER_LEVEL < 20 && USER_NUMBER >= 50000){
      USER_DATA['cd']['break'] = CURRENT_SECOND + configData['cd_break'];
      USER_DATA['log']['break'].push(`[${getCurrentDate()}]境界突破一级`);
      USER_DATA['number'] -= 50000;
      USER_DATA['mlv'] = 1;
      storagePlayerData(ID[0], USER_DATA);
      e.reply(`境界突破！现在你的境界为${ciku[1]}`);
    }else if(USER_LEVEL < 30 && USER_NUMBER >= 90000){
      USER_DATA['cd']['break'] = CURRENT_SECOND + configData['cd_break'];
      USER_DATA['log']['break'].push(`[${getCurrentDate()}]境界突破一级`);
      USER_DATA['number'] -= 90000;
      USER_DATA['mlv'] = 2;
      storagePlayerData(ID[0], USER_DATA);
      e.reply(`境界突破！现在你的境界为${ciku[2]}`);
    }else if(USER_LEVEL < 40 && USER_NUMBER >= 130000){
      USER_DATA['cd']['break'] = CURRENT_SECOND + configData['cd_break'];
      USER_DATA['log']['break'].push(`[${getCurrentDate()}]境界突破一级`);
      USER_DATA['number'] -= 130000;
      USER_DATA['mlv'] = 3;
      storagePlayerData(ID[0], USER_DATA);
      e.reply(`境界突破！现在你的境界为${ciku[3]}`);
    }else if(USER_LEVEL < 50 && USER_NUMBER >= 170000){
      USER_DATA['cd']['break'] = CURRENT_SECOND + configData['cd_break'];
      USER_DATA['log']['break'].push(`[${getCurrentDate()}]境界突破一级`);
      USER_DATA['number'] -= 170000;
      USER_DATA['mlv'] = 4;
      storagePlayerData(ID[0], USER_DATA);
      e.reply(`境界突破！现在你的境界为${ciku[4]}`);
    }else if(USER_LEVEL < 60 && USER_NUMBER >= 210000){
      USER_DATA['cd']['break'] = CURRENT_SECOND + configData['cd_break'];
      USER_DATA['log']['break'].push(`[${getCurrentDate()}]境界突破一级`);
      USER_DATA['number'] -= 210000;
      USER_DATA['mlv'] = 5;
      storagePlayerData(ID[0], USER_DATA);
      e.reply(`境界突破！现在你的境界为${ciku[5]}`);
    }else if(USER_LEVEL < 70 && USER_NUMBER >= 250000){
      USER_DATA['cd']['break'] = CURRENT_SECOND + configData['cd_break'];
      USER_DATA['log']['break'].push(`[${getCurrentDate()}]境界突破一级`);
      USER_DATA['number'] -= 250000;
      USER_DATA['mlv'] = 6;
      storagePlayerData(ID[0], USER_DATA);
      e.reply(`境界突破！现在你的境界为${ciku[6]}`);
    }else if(USER_LEVEL < 80 && USER_NUMBER >= 290000){
      USER_DATA['cd']['break'] = CURRENT_SECOND + configData['cd_break'];
      USER_DATA['log']['break'].push(`[${getCurrentDate()}]境界突破一级`);
      USER_DATA['number'] -= 290000;
      USER_DATA['mlv'] = 7;
      storagePlayerData(ID[0], USER_DATA);
      e.reply(`境界突破！现在你的境界为${ciku[7]}`);
    }else if(USER_LEVEL < 100 && USER_NUMBER >= 330000){
      USER_DATA['cd']['break'] = CURRENT_SECOND + configData['cd_break'];
      USER_DATA['log']['break'].push(`[${getCurrentDate()}]境界突破一级`);
      USER_DATA['number'] -= 330000;
      USER_DATA['mlv'] = 8;
      storagePlayerData(ID[0], USER_DATA);
      e.reply(`境界突破！现在你的境界为${ciku[8]}`);
    }else if(USER_LEVEL < 130 && USER_NUMBER >= 400000){
      USER_DATA['cd']['break'] = CURRENT_SECOND + configData['cd_break'];
      USER_DATA['log']['break'].push(`[${getCurrentDate()}]境界突破一级`);
      USER_DATA['number'] -= 400000;
      USER_DATA['mlv'] = 9;
      storagePlayerData(ID[0], USER_DATA);
      e.reply(`境界突破！现在你的境界为${ciku[9]}`);
    }else if(USER_LEVEL < 170 && USER_NUMBER >= 500000){
      USER_DATA['cd']['break'] = CURRENT_SECOND + configData['cd_break'];
      USER_DATA['log']['break'].push(`[${getCurrentDate()}]境界突破一级`);
      USER_DATA['number'] -= 500000;
      USER_DATA['mlv'] = 10;
      storagePlayerData(ID[0], USER_DATA);
      e.reply(`境界突破！现在你的境界为${ciku[10]}`);
    }else if(USER_LEVEL < 220 && USER_NUMBER >= 600000){
      USER_DATA['cd']['break'] = CURRENT_SECOND + configData['cd_break'];
      USER_DATA['log']['break'].push(`[${getCurrentDate()}]境界突破一级`);
      USER_DATA['number'] -= 600000;
      USER_DATA['mlv'] = 11;
      storagePlayerData(ID[0], USER_DATA);
      e.reply(`境界突破！现在你的境界为${ciku[11]}`);
    }else if(USER_LEVEL < 280 && USER_NUMBER >= 700000){
      USER_DATA['cd']['break'] = CURRENT_SECOND + configData['cd_break'];
      USER_DATA['log']['break'].push(`[${getCurrentDate()}]境界突破一级`);
      USER_DATA['number'] -= 700000;
      USER_DATA['mlv'] = 12;
      storagePlayerData(ID[0], USER_DATA);
      e.reply(`境界突破！现在你的境界为${ciku[12]}`);
    }else{
      e.reply(`你已经达到了道祖，境界不能再突破了`)
    }

}
}