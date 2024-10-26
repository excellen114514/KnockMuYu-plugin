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

const Bet =/^(#|\/)?赌银两(.*)$/
const AllBet =/^(#|\/)?梭哈$/

export class Kc extends plugin {
    constructor() {
        super({
            name: 'bm',
            dsc: '赌银两',
            event: 'message',
            priority: 1,
            rule: [
                { 
                 reg: Bet,
                 fnc: 'bet' 
                },
                { 
                 reg: AllBet,
                 fnc: 'allbet' 
                }
            ]
        })
    }

    async bet(e){
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
         const REMAINING_TIME = CURRENT_SECOND - USER_DATA['cd']['bet'];
    
         // 如果剩余冷却时间小于0，表示玩家可以再次敲木鱼
         if (REMAINING_TIME < 0) {
           // 将剩余冷却时间转换为分钟和秒
           const { minutes, remainingSeconds } = convertSecToMinAndSec(Math.abs(REMAINING_TIME));
    
         // 根据剩余时间向用户发送消息
         if (minutes > 0) {
             return e.reply([`赌博很累的！休息会吧~~\n还有${minutes}分${remainingSeconds}秒冷却`]);
         } else {
             return e.reply([`赌博很累的！休息会吧~~\n${remainingSeconds}秒冷却`]);
         }
         }
         let smoney = "";
           /**循环，遍历命令并写入smoney变量中 */
          for (let m of e.message) {
            smoney += m.text;
         } 
         //只保留赌以外的字段。写入变量
         smoney = smoney.replace(/#|赌银两/g, "").trim();
         console.log(smoney);
         let msg = `你来到了赌坊，带上了你的${smoney}银两，准备大展身手......\n5秒后宣布赌局结果！`;
         await e.reply([msg]);
         let count = 5;
         const beting = Math.random();
         
         const interval = setInterval(() => {
         console.log(`${count}秒后执行下一个`);
         count--;
         if (count <= 0) {
           clearInterval(interval);
           if(beting < 0.50){
            let end = `真遗憾，你赌输了，失去了${smoney}银两！目前银两：${USER_MONEY - smoney}`
            USER_DATA['cd']['bet'] = CURRENT_SECOND + configData['cd_bet'];
            USER_DATA['log']['bet'].push(`[${getCurrentDate()}] 输了${smoney}银两`);
            USER_DATA['money'] -= smoney;
       
            // 将更新后的玩家数据存储到数据库
            storagePlayerData(ID[0], USER_DATA);
            return e.reply([end])
           }else{
            let MoneyNumber = lodash.random(configData['min_bet'], configData['max_bet']);
            let end = `你赌赢了，得到了${MoneyNumber}银两！目前银两：${USER_MONEY + MoneyNumber}`
            USER_DATA['cd']['bet'] = CURRENT_SECOND + configData['cd_bet'];
            USER_DATA['log']['bet'].push(`[${getCurrentDate()}] 赢了${MoneyNumber}银两`);
            USER_DATA['money'] += MoneyNumber;
       
            // 将更新后的玩家数据存储到数据库
            storagePlayerData(ID[0], USER_DATA);
            return e.reply([end])
           }
         }
         }, 1000);
        
    }

    async allbet(e){
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
        
             // 获取玩家的当前银两
             const USER_MONEY = USER_DATA['money'];
        
             // 获取当前时间（以秒为单位）
             const CURRENT_SECOND = timestampToSeconds(Date.now());
        
             // 计算剩余冷却时间
             const REMAINING_TIME = CURRENT_SECOND - USER_DATA['cd']['bet'];
        
             // 如果剩余冷却时间小于0，表示玩家可以再次敲木鱼
             if (REMAINING_TIME < 0) {
               // 将剩余冷却时间转换为分钟和秒
               const { minutes, remainingSeconds } = convertSecToMinAndSec(Math.abs(REMAINING_TIME));
        
             // 根据剩余时间向用户发送消息
             if (minutes > 0) {
                 return e.reply([`赌博很累的！休息会吧~~\n还有${minutes}分${remainingSeconds}秒冷却`]);
             } else {
                 return e.reply([`赌博很累的！休息会吧~~\n${remainingSeconds}秒冷却`]);
             }
            }

            let smoney = USER_MONEY;
            console.log(smoney);
         let msg = `你来到了赌坊，带上了你的${smoney}银两，准备大展身手......\n5秒后宣布赌局结果！`;
         await e.reply([msg]);
         let count = 5;
         const beting = Math.random();
         
         const interval = setInterval(() => {
         console.log(`${count}秒后执行下一个`);
         count--;
         if (count <= 0) {
           clearInterval(interval);
           if(beting < 0.50){
            let end = `真遗憾，你赌输了，失去了${smoney}银两！目前银两：${USER_MONEY - smoney}`
            USER_DATA['cd']['bet'] = CURRENT_SECOND + configData['cd_bet'];
            USER_DATA['log']['bet'].push(`[${getCurrentDate()}] 输了${smoney}银两`);
            USER_DATA['money'] -= smoney;
       
            // 将更新后的玩家数据存储到数据库
            storagePlayerData(ID[0], USER_DATA);
            return e.reply([end])
           }else{
            let MoneyNumber = lodash.random(configData['min_bet'], configData['max_bet']);
            let end = `你赌赢了，得到了${MoneyNumber}银两！目前银两：${USER_MONEY + MoneyNumber}`
            USER_DATA['cd']['bet'] = CURRENT_SECOND + configData['cd_bet'];
            USER_DATA['log']['bet'].push(`[${getCurrentDate()}] 赢了${MoneyNumber}银两`);
            USER_DATA['money'] += MoneyNumber;
       
            // 将更新后的玩家数据存储到数据库
            storagePlayerData(ID[0], USER_DATA);
            return e.reply([end])
           }
         }
         }, 1000);


    }
}

