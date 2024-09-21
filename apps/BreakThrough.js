import {
    getPlayerData,
    readConfiguration,
    storagePlayerData,
    timestampToSeconds,
    convertSecToMinAndSec,
    getCurrentDate,
    isPlayerExist
} from '../function.js';

const Break =/^(#|\/)?突破$/
let ciku =['练气', '筑基', '金丹', '元婴', '化神', '炼虚', '渡劫', '大乘', '无量功德圆满']
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
      if(USER_LEVEL === 0 && USER_NUMBER >= 5000){
        USER_DATA['cd']['break'] = CURRENT_SECOND + configData['cd_break'];
        USER_DATA['log']['break'].push(`[${getCurrentDate()}]突破了一级`);
        USER_DATA['number'] -= 5000;
        USER_DATA['lv'] += 1;
        USER_DATA['mlv'] = ciku[0];
        let msg = `你气脉涌动，木鱼泛出金光！刹那间，天地好像为之静止！这是你的第一次突破~~\n你现在的等级为${USER_LEVEL + 1}，处于${ciku[0]}期！`;
        // 将更新后的玩家数据存储到数据库
        storagePlayerData(ID[0], USER_DATA);
        e.reply([msg])
      }else if(USER_LEVEL < 10 && USER_NUMBER >= 8000){
        USER_DATA['cd']['break'] = CURRENT_SECOND + configData['cd_break'];
        USER_DATA['log']['break'].push(`[${getCurrentDate()}]突破了一级`);
        USER_DATA['number'] -= 8000;
        USER_DATA['lv'] += 1;
        USER_DATA['mlv'] = ciku[0];
        let msg = `你气脉涌动，木鱼泛出金光！刹那间，天地好像为之静止！\n你现在的等级为${USER_LEVEL + 1}，处于${ciku[0]}期！`;
        // 将更新后的玩家数据存储到数据库
        storagePlayerData(ID[0], USER_DATA);
        e.reply([msg])
      }else if(USER_LEVEL === 10 && USER_NUMBER >= 10000){
        USER_DATA['cd']['break'] = CURRENT_SECOND + configData['cd_break'];
        USER_DATA['log']['break'].push(`[${getCurrentDate()}]突破了一级,境界加一`);
        USER_DATA['number'] -= 10000;
        USER_DATA['lv'] += 1;
        USER_DATA['mlv'] = ciku[1];
        let msg = `你气脉涌动，木鱼泛出金光！刹那间，天地好像为之静止！\n你现在的等级为${USER_LEVEL + 1}，境界突破！处于${ciku[1]}期！`;
        // 将更新后的玩家数据存储到数据库
        storagePlayerData(ID[0], USER_DATA);
        e.reply([msg])
      }else if(USER_LEVEL < 20 && USER_NUMBER >= 12000){
        USER_DATA['cd']['break'] = CURRENT_SECOND + configData['cd_break'];
        USER_DATA['log']['break'].push(`[${getCurrentDate()}]突破了一级`);
        USER_DATA['number'] -= 12000;
        USER_DATA['lv'] += 1;
        USER_DATA['mlv'] = ciku[1];
        let msg = `你气脉涌动，木鱼泛出金光！刹那间，天地好像为之静止！\n你现在的等级为${USER_LEVEL + 1}，处于${ciku[1]}期！`;
        // 将更新后的玩家数据存储到数据库
        storagePlayerData(ID[0], USER_DATA);
        e.reply([msg])
      }else if(USER_LEVEL === 20 && USER_NUMBER >= 14000){
        USER_DATA['cd']['break'] = CURRENT_SECOND + configData['cd_break'];
        USER_DATA['log']['break'].push(`[${getCurrentDate()}]突破了一级`);
        USER_DATA['number'] -= 14000;
        USER_DATA['lv'] += 1;
        USER_DATA['mlv'] = ciku[2];
        let msg = `你气脉涌动，木鱼泛出金光！刹那间，天地好像为之静止！\n你现在的等级为${USER_LEVEL + 1}，境界突破！处于${ciku[2]}期！`;
        // 将更新后的玩家数据存储到数据库
        storagePlayerData(ID[0], USER_DATA);
        e.reply([msg])
      }else if(USER_LEVEL < 30 && USER_NUMBER >= 16000){
        USER_DATA['cd']['break'] = CURRENT_SECOND + configData['cd_break'];
        USER_DATA['log']['break'].push(`[${getCurrentDate()}]突破了一级`);
        USER_DATA['number'] -= 16000;
        USER_DATA['lv'] += 1;
        USER_DATA['mlv'] = ciku[2];
        let msg = `你气脉涌动，木鱼泛出金光！刹那间，天地好像为之静止！\n你现在的等级为${USER_LEVEL + 1}，处于${ciku[2]}期！`;
        // 将更新后的玩家数据存储到数据库
        storagePlayerData(ID[0], USER_DATA);
        e.reply([msg])
      }else if(USER_LEVEL === 30 && USER_NUMBER >= 18000){
        USER_DATA['cd']['break'] = CURRENT_SECOND + configData['cd_break'];
        USER_DATA['log']['break'].push(`[${getCurrentDate()}]突破了一级,境界加一`);
        USER_DATA['number'] -= 8000;
        USER_DATA['lv'] += 1;
        USER_DATA['mlv'] = ciku[3];
        let msg = `你气脉涌动，木鱼泛出金光！刹那间，天地好像为之静止！\n你现在的等级为${USER_LEVEL + 1}，处于${ciku[3]}期！`;
        // 将更新后的玩家数据存储到数据库
        storagePlayerData(ID[0], USER_DATA);
        e.reply([msg])
      }else {
        e.reply('你的功德不够！继续敲木鱼吧~~（目前30级以后不会再升级，也会触发此msg）')
      }
}
}