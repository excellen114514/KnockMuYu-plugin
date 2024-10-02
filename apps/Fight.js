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

const Fight =/^(#|\/)?决斗$/

export class fmy extends plugin {
    constructor() {
        super({
            name: '木鱼决斗',
            dsc: '玩家决斗',
            event: 'message',
            priority: 1,
            rule: [
                { 
                 reg: Fight,
                 fnc: 'fight' 
                }
            ]
        })
    }

    async fight(e){
        if (!e.isGroup) 
            return e.reply(['木鱼只能在群聊敲哦~'])
        const ID = [e.user_id, e.at]
        /** 配置数据 */
        const configData = await readConfiguration()
        if (!isPlayerExist(ID[0])) {
           e.reply("你还没有木鱼哦~发送 查看木鱼 来获得你的第一个木鱼吧！")
        }
        const USER_DATA = await getPlayerData(ID[0]);
        
        // 获取当前时间（以秒为单位）
        const CURRENT_SECOND = timestampToSeconds(Date.now());

     // 计算剩余冷却时间
        const REMAINING_TIME = CURRENT_SECOND - USER_DATA['cd']['fight'];

     // 如果剩余冷却时间小于0，表示玩家可以再次决斗
        if (REMAINING_TIME < 0) {
       // 将剩余冷却时间转换为分钟和秒
        const { minutes, remainingSeconds } = convertSecToMinAndSec(Math.abs(REMAINING_TIME));

     // 根据剩余时间向用户发送消息
         if (minutes > 0) {
           return e.reply([`决斗很累的，休息会吧~~\n还有${minutes}分${remainingSeconds}秒冷却`]);
        } else {
           return e.reply([`决斗很累的，休息会吧~~\n${remainingSeconds}秒冷却`]);
        }
        }
        if(ID[1]){
          const USER_DATA = await getPlayerData(ID[0]);
          const USER_DATA1 = await getPlayerData(ID[1]);
          const USER_LEVEL = USER_DATA['lv'];
          const USER_LEVEL1 = USER_DATA1['lv'];
          const USER_MLEVEL = USER_DATA['mlv'];
          const USER_MLEVEL1 = USER_DATA1['mlv'];
           if(CURRENT_SECOND - USER_DATA1['cd']['fight'] < 0){
            return e.reply([`你的对手刚经历决斗，不能再和ta决斗哦~~`]);
          } 
           e.reply(`欢迎来看${USER_DATA['name']}和${USER_DATA1['name']}决斗，决斗将会在五秒后宣布结果！`)
           let fightg = lodash.random(1, 100);
           let count = 5;
           const interval = setInterval(() => {
            console.log(`${count}秒后执行下一个`);
            count--;
  
           // 当计数器达到 1 时，清除定时器并停止循环
            if (count <= 0) {
              clearInterval(interval);

              if((USER_LEVEL > USER_LEVEL1) && (USER_MLEVEL > USER_MLEVEL1)){
                if(fightg >= 20){
                  USER_DATA['number'] += 15000;
                  USER_DATA1['number'] -= 15000;
                  USER_DATA['lv'] += 3;
                  USER_DATA1['lv'] -= 2;
                  USER_DATA['cd']['fight'] = CURRENT_SECOND + configData['cd_fight'];
                  USER_DATA['log']['fight'].push(`[${getCurrentDate()}]决斗一次 `);
                  USER_DATA1['cd']['fight'] = CURRENT_SECOND + configData['cd_fight'];
                  USER_DATA1['log']['fight'].push(`[${getCurrentDate()}]决斗一次 `);
                  storagePlayerData(ID[0], USER_DATA);
                  storagePlayerData(ID[1], USER_DATA1);
                  e.reply(`毫无悬念的战斗！本局的胜者是${USER_DATA['name']}!\n胜者加15000功德，败者失去同等功德！\n胜者等级加3，败者等级减2！`)
                }else{
                  USER_DATA['number'] -= 8000;
                  USER_DATA1['number'] += 9000;
                  USER_DATA['lv'] -= 2;
                  USER_DATA1['lv'] += 1;
                  USER_DATA['cd']['fight'] = CURRENT_SECOND + configData['cd_fight'];
                  USER_DATA['log']['fight'].push(`[${getCurrentDate()}]决斗一次 `);
                  USER_DATA1['cd']['fight'] = CURRENT_SECOND + configData['cd_fight'];
                  USER_DATA1['log']['fight'].push(`[${getCurrentDate()}]决斗一次 `);
                  storagePlayerData(ID[0], USER_DATA);
                  storagePlayerData(ID[1], USER_DATA1);
                  e.reply(`令人震惊！${USER_DATA1['name']}以微薄之势赢下比赛！\n胜者加9000功德，败者失去8000功德\n胜者加1等级，败者失去2等级！`)
                }
             }else{
                if(fightg >= 20){
                  USER_DATA['number'] -= 15000;
                  USER_DATA1['number'] += 15000;
                  USER_DATA['lv'] -= 2;
                  USER_DATA1['lv'] += 3;
                  USER_DATA['cd']['fight'] = CURRENT_SECOND + configData['cd_fight'];
                  USER_DATA['log']['fight'].push(`[${getCurrentDate()}]决斗一次 `);
                  USER_DATA1['cd']['fight'] = CURRENT_SECOND + configData['cd_fight'];
                  USER_DATA1['log']['fight'].push(`[${getCurrentDate()}]决斗一次 `);
                  storagePlayerData(ID[0], USER_DATA);
                  storagePlayerData(ID[1], USER_DATA1);
                  e.reply(`毫无悬念的战斗！本局的胜者是${USER_DATA1['name']}!\n胜者加15000功德，败者失去同等功德！\n胜者等级加3，败者等级减2！`) 
                }else{
                  USER_DATA['number'] += 9000;
                  USER_DATA1['number'] -= 8000;
                  USER_DATA['lv'] += 1;
                  USER_DATA1['lv'] -= 2;
                  USER_DATA['cd']['fight'] = CURRENT_SECOND + configData['cd_fight'];
                  USER_DATA['log']['fight'].push(`[${getCurrentDate()}]决斗一次 `);
                  USER_DATA1['cd']['fight'] = CURRENT_SECOND + configData['cd_fight'];
                  USER_DATA1['log']['fight'].push(`[${getCurrentDate()}]决斗一次 `);
                  storagePlayerData(ID[0], USER_DATA);
                  storagePlayerData(ID[1], USER_DATA1);
                  e.reply(`令人震惊！${USER_DATA['name']}以微薄之势赢下比赛！\n胜者加9000功德，败者失去8000功德\n胜者加1等级，败者失去2等级！`)
                }
             }
           }
            }, 1000); // 每隔1000毫秒（1秒）执行一次
          

        }else{
             return e.reply(`人呢！我问你人呢！你不at你和自己决斗吗！`)
        }
    }
}