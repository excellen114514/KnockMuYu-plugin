import lodash from 'lodash';
import {
    getPlayerData,
    readConfiguration,
    storagePlayerData,
    timestampToSeconds,
    convertSecToMinAndSec,
    getCurrentDate,
    isPlayerExist
} from '../function.js';



const Knock =/^(#|\/)?敲木鱼$/

export class Kc extends plugin {
    constructor() {
        super({
            name: 'km',
            dsc: '敲木鱼',
            event: 'message',
            priority: 1,
            rule: [
                { 
                 reg: Knock,
                 fnc: 'knock' 
                }
            ]
        })
    }
   async knock(e){
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

     // 获取玩家的当前功德数
     const USER_NUMBER = USER_DATA['number'];

     // 获取当前时间（以秒为单位）
     const CURRENT_SECOND = timestampToSeconds(Date.now());

     // 计算剩余冷却时间
     const REMAINING_TIME = CURRENT_SECOND - USER_DATA['cd']['knock'];

     // 如果剩余冷却时间小于0，表示玩家可以再次敲木鱼
     if (REMAINING_TIME < 0) {
       // 将剩余冷却时间转换为分钟和秒
       const { minutes, remainingSeconds } = convertSecToMinAndSec(Math.abs(REMAINING_TIME));

     // 根据剩余时间向用户发送消息
     if (minutes > 0) {
         return e.reply([`木鱼有点累，让木鱼休息会吧~~\n还有${minutes}分${remainingSeconds}秒冷却`]);
     } else {
         return e.reply([`木鱼有点累，让木鱼休息会吧~~\n${remainingSeconds}秒冷却`]);
     }
     }

      // 生成一个随机数（功德数）
     let KnockNumber = lodash.random(configData['min_knock'], configData['max_knock']);

     // 构建回复消息
     let msg = `敲木鱼！噔噔噔~得到了${KnockNumber}功德！\r目前功德：${USER_NUMBER + KnockNumber}`;

      // 更新玩家的冷却时间和功德数
     USER_DATA['cd']['knock'] = CURRENT_SECOND + configData['cd_knock'];
     USER_DATA['log']['knock'].push(`[${getCurrentDate()}] 加了${KnockNumber}功德`);
     USER_DATA['number'] += KnockNumber;

     // 将更新后的玩家数据存储到数据库
     storagePlayerData(ID[0], USER_DATA);

     // 向用户发送敲木鱼成功的信息
     return e.reply([msg]);


}

}

