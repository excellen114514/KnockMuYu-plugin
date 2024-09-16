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
import plugin from '../../../lib/plugins/plugin.js'
const Random =/^(#|\/)?奇闻轶事|奇遇$/
let answer = {}
export class Kc extends plugin {
    constructor() {
        super({
            name: 'randomevent',
            dsc: '随机事件',
            event: 'message',
            priority: 1,
            rule: [
                { 
                 reg: Random,
                 fnc: 'random' 
                }
            ]
        })
    }

    async random(e){
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
 
      // 获取当前时间（以秒为单位）
      const CURRENT_SECOND = timestampToSeconds(Date.now());
 
      // 计算剩余冷却时间
      const REMAINING_TIME = CURRENT_SECOND - USER_DATA['cd']['random'];
 
      // 如果剩余冷却时间小于0，表示玩家可以再次敲木鱼
      if (REMAINING_TIME < 0) {
        // 将剩余冷却时间转换为分钟和秒
        const { minutes, remainingSeconds } = convertSecToMinAndSec(Math.abs(REMAINING_TIME));
 
      // 根据剩余时间向用户发送消息
      if (minutes > 0) {
          return e.reply([`下凡间寻求趣事很耗心神的！休息下吧~\n还有${minutes}分${remainingSeconds}秒冷却`]);
      } else {
          return e.reply([`下凡间寻求趣事很耗心神的！休息下吧~\n${remainingSeconds}秒冷却`]);
      }
      }
      
      e.reply('噔噔噔~你带着你的木鱼离开寺庙咯！今天会遇到什么趣事呢~\n(选择答案只需要发送对应选择的序号)')
      /**写一个计时器 */
      let count = 3;
      const interval = setInterval(() => {
      console.log(`${count}秒后执行下一个`);
      count--;
  
     // 当计数器达到 1 时，清除定时器并停止循环
      if (count <= 0) {
      clearInterval(interval);
      let num = Math.floor(Math.random() * 5) + 1;
       if(num === 1 ){
        e.reply('今天，你去给木鱼买精油。突然，一个老者跳了出来，拦住了你的去路。“嘿嘿，小友，我看你骨骼精奇，我把我这本书赠与你，如何？”\n你看着老者，陷入沉思...\n1：欸嘿，不要白不要！\n2：放肆！我有成帝之姿，今日你这老者用破书羞辱我？\n3：拒绝老者，径直离开')
        this.setContext('Events')
     }else{
        e.reply('没有遇到什么趣事哦，你很累，休息下吧！')
        USER_DATA['cd']['random'] = CURRENT_SECOND + configData['cd_random'];
        // 将更新后的玩家数据存储到数据库
        storagePlayerData(ID[0], USER_DATA);
     }
     }
     }, 1000);

    }    
    
    async Events(e){
        const ID = [e.user_id]
        const USER_DATA = await getPlayerData(ID[0]);
        const configData = await readConfiguration()
         // 获取当前时间（以秒为单位）
        const CURRENT_SECOND = timestampToSeconds(Date.now());
         // 获取玩家的当前功德数
        const USER_NUMBER = USER_DATA['number'];
        console.log(answer)
        // 将接收到的e覆盖第一次接收到的e
        e = this.e
        if(e.msg === '1'){
            let KnockNumber = lodash.random(configData['min_random'], configData['max_random']);
            let end1 = `你接过了书，竟是《一次性功德速成大法》！你马上翻阅起来，功德增加${KnockNumber}!\r目前功德：${USER_NUMBER + KnockNumber}`;
            USER_DATA['number'] += KnockNumber;
            e.reply([end1])
            this.finish('Events')
            delete answer[e.user_id]
            USER_DATA['cd']['random'] = CURRENT_SECOND + configData['cd_random'];
            USER_DATA['log']['random'].push(`[${getCurrentDate()}] 加了${KnockNumber}功德`);
        

            // 将更新后的玩家数据存储到数据库
            storagePlayerData(ID[0], USER_DATA);
        }else if(e.msg === '2'){
            let KnockNumber = lodash.random(configData['min_random'], configData['max_random']);
            let end2 = `你越想越气，一把抓住老者，顷刻炼化！老者没料到你想杀他！老者被你炼化了，只可惜他只是凡人，你没有得到什么。功德减${KnockNumber}!\r目前功德：${USER_NUMBER - KnockNumber}`
            USER_DATA['number'] -= KnockNumber;
            e.reply([end2])
            this.finish('Events')
            delete answer[e.user_id]
            USER_DATA['cd']['random'] = CURRENT_SECOND + configData['cd_random'];
            USER_DATA['log']['random'].push(`[${getCurrentDate()}] 加了${KnockNumber}功德`);
        

            // 将更新后的玩家数据存储到数据库
            storagePlayerData(ID[0], USER_DATA);
        }else if(e.msg === '3'){
            let end3 = '你谢过了老者，径直离开了'
            e.reply([end3])
            this.finish('Events')
            delete answer[e.user_id]
            USER_DATA['cd']['random'] = CURRENT_SECOND + configData['cd_random'];
        

            // 将更新后的玩家数据存储到数据库
            storagePlayerData(ID[0], USER_DATA);
        }

    }
    
}