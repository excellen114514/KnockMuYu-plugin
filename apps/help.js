import {
    PLUGIN_PATH,
} from '../function.js';

import puppeteer from '../../../lib/puppeteer/puppeteer.js'



export class Kc extends plugin {
    constructor() {
        super({
            name: 'help',
            dsc: '菜单',
            event: 'message',
            priority: 1,
            rule: [
                { 
                 reg: /^(#|\/)?木鱼帮助$/i,
                 fnc: 'help'
                }
            ]
        })
    }

    async help(e){
        if (!e.isGroup) 
            return e.reply(['木鱼只能在群聊敲哦~'])
         /** 帮助图片 */
        const image = await puppeteer.screenshot('木鱼帮助', {
            tplFile: 'plugins/KnockMuYu-plugin/resources/help/index.html',
            filePath: `${PLUGIN_PATH}/resources/`,
            
        })

        return e.reply([image])

    }
}