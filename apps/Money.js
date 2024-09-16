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

const Money =/^(#|\/)?摆摊|摆摊赚钱$/

export class Mn extends plugin {
    constructor() {
        super({
            name: 'money',
            dsc: '赚取银两',
            event: 'message',
            priority: 1,
            rule: [
                { 
                 reg: Money,
                 fnc: 'money' 
                }
            ]
        })
    }

    async money(e){
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
    
         // 获取玩家的当前银两
         const USER_MONEY = USER_DATA['money'];
    
         // 获取当前时间（以秒为单位）
         const CURRENT_SECOND = timestampToSeconds(Date.now());
    
         // 计算剩余冷却时间
         const REMAINING_TIME = CURRENT_SECOND - USER_DATA['cd']['money'];
    
         // 如果剩余冷却时间小于0，表示玩家可以再次赚钱
         if (REMAINING_TIME < 0) {
           // 将剩余冷却时间转换为分钟和秒
           const { minutes, remainingSeconds } = convertSecToMinAndSec(Math.abs(REMAINING_TIME));
    
         // 根据剩余时间向用户发送消息
         if (minutes > 0) {
             return e.reply([`摆摊敲木鱼是很累的，休息下吧~~\n还有${minutes}分${remainingSeconds}秒冷却`]);
         } else {
             return e.reply([`摆摊敲木鱼是很累的，休息下吧~~\n${remainingSeconds}秒冷却`]);
         }
         }
    
          // 生成一个随机数（赚的银两）
         let MoneyNumber = lodash.random(configData['min_money'], configData['max_money']);
    
         // 构建回复消息
         let msg = `摆摊赚钱咯~~${MoneyNumber}银两！\r目前银两：${USER_MONEY + MoneyNumber}`;
    
          // 更新玩家的冷却时间和银两
         USER_DATA['cd']['money'] = CURRENT_SECOND + configData['cd_money'];
         USER_DATA['log']['money'].push(`[${getCurrentDate()}] 加了${MoneyNumber}银两`);
         USER_DATA['money'] += MoneyNumber;
    
         // 将更新后的玩家数据存储到数据库
         storagePlayerData(ID[0], USER_DATA);
    
         // 向用户发送打工结束的信息
         return e.reply([msg]);
    
    
    }
}