import {
    getPlayerData,
    storagePlayerData,
    isPlayerExist
} from '../function.js';

const MuYu =/^(#|\/)?查看木鱼$/
const Name =/^(#|\/)?改名(.*)$/
let ciku = ['练气', '筑基', '金丹', '元婴', '化神', '炼虚', '大乘', '渡劫', '真仙', '金仙', '太乙', '大罗', '道祖'];
let mlv 
export class gmy extends plugin {
    constructor() {
        super({
            name: '木鱼',
            dsc: '查看木鱼&获得木鱼',
            event: 'message',
            priority: 1,
            rule: [
                { 
                 reg: MuYu,
                 fnc: 'Muyu' 
                },
                { 
                    reg: Name,
                    fnc: 'Cname' 
                   }
            ]
        })
    }

    async Muyu(e){
        if (!e.isGroup) 
            return e.reply(['木鱼只能在群聊敲哦~'])
        const ID = [e.user_id, e.at]
        if (!isPlayerExist(ID[0])) {
            storagePlayerData(ID[0], {
            name: e.sender.card || '未设置昵称',
            number: 0,
            money: 0,
            mlv: 0,
            mlvv: 1,
            lv: 0,
            qy: 0,
            cd: { knock: 0, random: 0,money: 0, break:0, fight: 0, bet: 0},
            log: { knock: [], random: [], money: [], break:[], fight: [], bet: []}
        })
        e.reply('基础信息创建成功')
     }
        
     /** 返回消息 */
     let msg

     if (!ID[1]) { // 看自己
         /** 用户数据 */
         const USER_DATA = await getPlayerData(ID[0])
         let mlvCount = USER_DATA['mlv'];
         mlv = ciku[mlvCount];
         msg = `你现在的功德为${USER_DATA['number']}，\n有${USER_DATA['money']}银两，\n等级为${USER_DATA['lv']}!\n境界为${mlv}`

         return e.reply([msg], true)
     } else { // 看别人
         // 判断是否存在该用户
         if (!isPlayerExist(ID[1])) return e.reply([`ta貌似还没有踏入修仙世界哦`], true)

         /** 用户数据 */
         const USER_DATA = await getPlayerData(ID[1])
         let mlvCount = USER_DATA['mlv'];
         mlv = ciku[mlvCount];
         msg = `@${USER_DATA['name']}现在的功德为${USER_DATA['number']}，\n有${USER_DATA['money']}银两，\n等级为${USER_DATA['lv']}!\n境界为${mlv}`
         return e.reply([msg], true)
     }
    } 

    async Cname(e){
        if (e.isGroup) 
            return e.reply(['木鱼只能在群聊敲哦~'])
        const ID = [e.user_id]
        if (!isPlayerExist(ID[0])) {
            e.reply("你还没有木鱼哦~发送 查看木鱼 来获得你的第一个木鱼吧！", true)
        }
        let name = "";
        /**循环，遍历命令并写入smoney变量中 */
       for (let m of e.message) {
         name += m.text;
      } 
      //获取你的新昵称，写入
      name = name.replace(/#|改名/g, "").trim();
      const USER_DATA = await getPlayerData(ID[0])
      USER_DATA['name'] = name;
      storagePlayerData(ID[0], USER_DATA);
      return await this.reply(`修改名字成功！你现在的名字是${name}`, true)

    }
}
