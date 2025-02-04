import {
    isPlayerExist,
    compareLvValues
} from '../function.js';
import common from "../../../lib/common/common.js"
const List = /^(#|\/)?木鱼排行$/;

export class list extends plugin {
    constructor() {
        super({
            name: 'kmlist',
            dsc: '木鱼list',
            event: 'message',
            priority: 1,
            rule: [
                {
                    reg: List,
                    fnc: 'list'
                }
            ]
        });
    }

    async list(e) {
        const folderPath = './././plugins/KnockMuYu-plugin/data/player';
        if (!e.isGroup) 
            return e.reply('木鱼只能在群聊敲哦~');
        
        const ID = [e.user_id];
        if (!isPlayerExist(ID[0])) {
            return e.reply("你还没有木鱼哦~发送 查看木鱼 来获得你的第一个木鱼吧！");
        }

        // 调用compareLvValues并等待结果
        let msg = await compareLvValues(folderPath);
        const forward = [
            '木鱼排行榜'
            
        ];
          forward.push(msg);
          const fmsg = await common.makeForwardMsg(e, forward, ``);
        // 返回字符串化后的结果
        return e.reply(fmsg);
    }
}