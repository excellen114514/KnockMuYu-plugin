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
let smoneyres = ``;
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
         if(USER_MONEY < smoney){
            await e.reply('你够钱嘛！不许赌！')
            return false
         }
         smoneyres = smoney;
         console.log(smoney);
         await e.reply(`你投入了${smoney}银两，发送“大”或“小”来猜\n(提示:1,2,3为小,4,5,6为大)`, true)
         this.setContext('guess');
        }      

    async allbet(e){
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

            let smoney = USER_MONEY;
            if(smoney <= 0){
                await e.reply('还梭哈呢，你够钱嘛！不许赌！')
                return false
            }
            smoneyres = smoney;
            console.log(smoney);
            await e.reply(`你投入了${smoney}银两，发送“大”或“小”来猜\n(提示:1,2,3为小,4,5,6为大)`, true)
            this.setContext('guess');


    }

    async guess(e){
        const ID = [e.user_id]
        const configData = await readConfiguration();
        const USER_DATA = await getPlayerData(ID[0]);
        const CURRENT_SECOND = timestampToSeconds(Date.now());
        let smoney = smoneyres; 
        // 获取玩家的当前银两
        const USER_MONEY = USER_DATA['money'];
        const beting = Math.floor(Math.random() * 6) + 1;
        let betres = await bettres(beting);
        console.log(beting, betres);
        e = this.e
        console.log(e.msg);
        if(e.msg !== betres){
            let end = `真遗憾，你赌输了，结果是${beting}!失去了${smoney}银两！目前银两：${USER_MONEY - smoney}`
            USER_DATA['cd']['bet'] = CURRENT_SECOND + configData['cd_bet'];
            USER_DATA['log']['bet'].push(`[${getCurrentDate()}] 输了${smoney}银两`);
            USER_DATA['money'] -= smoney;
        
            // 将更新后的玩家数据存储到数据库
            storagePlayerData(ID[0], USER_DATA);
            this.finish('guess')
            return e.reply([end])
            }else{
            let MoneyNumber = lodash.random(configData['min_bet'], configData['max_bet']) * 2.5;
                let end = `你赌赢了，结果是${beting}!得到了${MoneyNumber}银两！目前银两：${USER_MONEY + MoneyNumber}`
                USER_DATA['cd']['bet'] = CURRENT_SECOND + configData['cd_bet'];
                USER_DATA['log']['bet'].push(`[${getCurrentDate()}] 赢了${MoneyNumber}银两`);
                USER_DATA['money'] += MoneyNumber;
            
                // 将更新后的玩家数据存储到数据库
                storagePlayerData(ID[0], USER_DATA);
                this.finish('guess')
                return e.reply([end])
            }
    
        

    }
}
async function bettres(beting) {
    if(beting >= 4){
        let betres = `大`;
        return betres
    }else {
        let betres = `小`;
        return betres
    }
    
}
