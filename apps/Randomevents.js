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

const Random = /^(#|\/)?奇遇$/
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
                let num = Math.floor(Math.random() * 12) + 1; 
                if(num === 1 ){
                    e.reply('今天，你去给木鱼买精油。突然，一个老者跳了出来，拦住了你的去路。“嘿嘿，小友，我看你骨骼精奇，我把我这本书赠与你，如何？”\n你看着老者，陷入沉思...\n1：欸嘿，不要白不要！\n2：放肆！我有成帝之姿，今日你这老者用破书羞辱我？\n3：拒绝老者，径直离开');
                    this.setContext('Event1')
                } else if(num === 2){
                    e.reply('你在闲逛的时候看到一个小女孩在乞讨，在经过她时，她用她那双卡姿兰大眼睛含情脉脉地看着你\n你陷入了沉思...\n1:施舍与她一些银两\n2:把她带回家当童养媳玩养成游戏。\n3:跟她犯贱');
                    this.setContext('Event2')
                } else if(num === 3){
                    e.reply('你行走于野外，突然一道人影向你袭来，说那时那时快，等你反应过来时，一把刀已快到你的脖子上...\n1:向后退\n2:向旁边避开并攻击黑影\n3:大哥大哥大哥大哥，大哥别杀我，我我我我把钱都给你。');
                    this.setContext('Event3')
                } else if(num === 4){
                    e.reply('你在路上捡到一个破旧的葫芦，里面似乎有东西在动。你打开一看，一个可爱的小精灵跳了出来。\n1:收服小精灵\n2:让它自由\n3:把它送给别人');
                    this.setContext('Event4')
                } else if(num === 5){
                    e.reply('你路过一家酒馆，听到有人在谈论宝藏的秘密。你决定...\n1:加入他们\n2:偷听更多\n3:不理他们');
                    this.setContext('Event5')
                } else if(num === 6){
                    e.reply('你在森林里迷路了，突然看到一只受伤的狐狸。\n1:救助它\n2:无视它\n3:捉住它');
                    this.setContext('Event6')
                } else if(num === 7){
                    e.reply('你在河边钓鱼，突然钓上了一个古老的戒指。\n1:戴上它\n2:卖掉它\n3:扔掉它');
                    this.setContext('Event7')
                } else if(num === 8){
                    e.reply('你在市场上看到一个骗子正在骗人。你决定...\n1:揭穿他\n2:加入他\n3:旁观');
                    this.setContext('Event8')
                } else if(num === 9){
                    e.reply('你在山洞里发现了一个神秘的雕像，它的眼睛似乎在发光。\n1:触摸它\n2:离开\n3:拿走雕像');
                    this.setContext('Event9')
                } else if(num === 10){
                    e.reply('你在路上遇到一个迷路的旅人，他看起来很着急。\n1:帮助他\n2:无视他\n3:骗他');
                    this.setContext('Event10')
                } else {
                    e.reply('没有遇到什么趣事哦，你很累，休息下吧！');
                    USER_DATA['cd']['random'] = CURRENT_SECOND + configData['cd_random'];
                    storagePlayerData(ID[0], USER_DATA);
                }
            }
        }, 1000);
    }    
    
    async Event1(e){
        const ID = [e.user_id]
        const USER_DATA = await getPlayerData(ID[0]);
        const configData = await readConfiguration()
        const CURRENT_SECOND = timestampToSeconds(Date.now());
        const USER_NUMBER = USER_DATA['number'];
        e = this.e
        if(e.msg === '1'){
            let KnockNumber = lodash.random(configData['min_random'], configData['max_random']);
            let end1 = `你接过书，竟然是《一次性功德速成大法》！功德增加${KnockNumber}!\r目前功德：${USER_NUMBER + KnockNumber}`;
            USER_DATA['number'] += KnockNumber;
            e.reply([end1])
            this.finish('Event1')
            delete answer[e.user_id]
            USER_DATA['cd']['random'] = CURRENT_SECOND + configData['cd_random'];
            USER_DATA['log']['random'].push(`[${getCurrentDate()}] 加了${KnockNumber}功德`);
            storagePlayerData(ID[0], USER_DATA);
        } else if(e.msg === '2'){
            let KnockNumber = lodash.random(configData['min_random'], configData['max_random']);
            let end2 = `你越想越气，一把抓住老者，顷刻炼化！老者没料到你想杀他！老者被你炼化了，只可惜他只是凡人，你没有得到什么。功德减${KnockNumber}!\r目前功德：${USER_NUMBER - KnockNumber}`;
            USER_DATA['number'] -= KnockNumber;
            e.reply([end2])
            this.finish('Event1')
            delete answer[e.user_id]
            USER_DATA['cd']['random'] = CURRENT_SECOND + configData['cd_random'];
            USER_DATA['log']['random'].push(`[${getCurrentDate()}] 减了${KnockNumber}功德`);
            storagePlayerData(ID[0], USER_DATA);
        } else if(e.msg === '3'){
            let end3 = '你谢过了老者，径直离开了';
            e.reply([end3])
            this.finish('Event1')
            delete answer[e.user_id]
            USER_DATA['cd']['random'] = CURRENT_SECOND + configData['cd_random'];
            USER_DATA['log']['random'].push(`[${getCurrentDate()}] 结束随机事件，没有加减功德`);
            storagePlayerData(ID[0], USER_DATA);
        }
    }

    async Event2(e){
        const ID = [e.user_id]
        const USER_DATA = await getPlayerData(ID[0]);
        const configData = await readConfiguration()
        const CURRENT_SECOND = timestampToSeconds(Date.now());
        const USER_NUMBER = USER_DATA['number'];
        e = this.e
        if(e.msg === '1'){
            let MoneyNumber = USER_DATA['money']
            if (MoneyNumber <= 1000) {
                e.reply('你没有足够的银两！重新选择吧~~')
                this.setContext('Event2')
            }else{
                let KnockNumber = lodash.random(configData['min_random'], configData['max_random']);
                let end1 = `你给了她500银两，功德得到${KnockNumber}!\r目前功德：${USER_NUMBER + KnockNumber},目前银两:${MoneyNumber - 500}`;
                USER_DATA['number'] += KnockNumber;
                USER_DATA['money'] -= 500;
                e.reply([end1])
                this.finish('Event2')
                delete answer[e.user_id]
                USER_DATA['cd']['random'] = CURRENT_SECOND + configData['cd_random'];
                USER_DATA['log']['random'].push(`[${getCurrentDate()}] 加了${KnockNumber}功德,扣除500银两`);
                storagePlayerData(ID[0], USER_DATA);
            }
        } else if(e.msg === '2'){
            let KnockNumber = lodash.random(configData['min_random'], configData['max_random']);
            let end2 = `你把她诱拐回家，过了一天后，有人上报官府说你是人贩子，捕快立刻来到你家并把你抓了起来判死刑。你把一缕元神封存进木鱼，再被判死刑斩首后得以依靠功德复生。功德减${KnockNumber}!\r目前功德：${USER_NUMBER - KnockNumber}`;
            USER_DATA['number'] -= KnockNumber;
            e.reply([end2])
            this.finish('Event2')
            delete answer[e.user_id]
            USER_DATA['cd']['random'] = CURRENT_SECOND + configData['cd_random'];
            USER_DATA['log']['random'].push(`[${getCurrentDate()}] 减了${KnockNumber}功德`);
            storagePlayerData(ID[0], USER_DATA);
        } else if(e.msg === '3'){
            let KnockNumber = lodash.random(configData['min_random'], configData['max_random']);
            let end3 = `你装模作样地把银两给她，她立刻向你投来感激的目光，但随即却又拿走说了一句：“不会吧，不会吧，你不会真想让我给你钱吧，哈哈哈”。功德减${KnockNumber}!\r目前功德：${USER_NUMBER - KnockNumber}`;
            USER_DATA['number'] -= KnockNumber;
            e.reply([end3])
            this.finish('Event2')
            delete answer[e.user_id]
            USER_DATA['cd']['random'] = CURRENT_SECOND + configData['cd_random'];
            USER_DATA['log']['random'].push(`[${getCurrentDate()}] 减了${KnockNumber}功德`);
            storagePlayerData(ID[0], USER_DATA);
        }
    }

    async Event3(e){
        const ID = [e.user_id]
        const USER_DATA = await getPlayerData(ID[0]);
        const configData = await readConfiguration()
        const CURRENT_SECOND = timestampToSeconds(Date.now());
        const USER_NUMBER = USER_DATA['number'];
        e = this.e
        if(e.msg === '1'){
            let KnockNumber = lodash.random(configData['min_random'], configData['max_random']);
            let end1 = `你赶忙向后退，但那把刀依然不依不饶地向你捅来，突然你被一块石头绊倒，那把刀也顺势插入了你的脖子，你觉得眼前一红，在临死前你看清了他的脸，是一名在官府上通缉已久的劫修。你死了。但你的木鱼却保存了你的一丝元神得已在之后复活。功德降低${KnockNumber}!\r目前功德：${USER_NUMBER - KnockNumber}`;
            USER_DATA['number'] -= KnockNumber;
            e.reply([end1])
            this.finish('Event3')
            delete answer[e.user_id]
            USER_DATA['cd']['random'] = CURRENT_SECOND + configData['cd_random'];
            USER_DATA['log']['random'].push(`[${getCurrentDate()}] 减了${KnockNumber}功德`);
            storagePlayerData(ID[0], USER_DATA);
        } else if(e.msg === '2'){
            let KnockNumber = lodash.random(configData['min_random'], configData['max_random']);
            let end2 = `你在情急之中肾上腺素完全激发，身体状态大幅度上升，使你大脑快速运转，向旁避开，并且在避开之后对那个黑影进行了肘击，那黑影在刺完一击后正出于旧力已去新力未生的状态，被你突如其来的肘击给肘倒，你乘胜追击，接连几下把黑影打的毫无还手之力，在月光下你看清楚了他的脸是官府通缉的一名江洋大盗，于是你把刀夺下把他杀了，并把人头割下，交到官府得到了报酬。功德加${KnockNumber}!\r目前功德：${USER_NUMBER + KnockNumber}`;
            USER_DATA['number'] += KnockNumber;
            e.reply([end2])
            this.finish('Event3')
            delete answer[e.user_id]
            USER_DATA['cd']['random'] = CURRENT_SECOND + configData['cd_random'];
            USER_DATA['log']['random'].push(`[${getCurrentDate()}] 加了${KnockNumber}功德`);
            storagePlayerData(ID[0], USER_DATA);
        } else if(e.msg === '3'){
            let KnockNumber = lodash.random(configData['min_random'], configData['max_random']);
            let end3 = `你以平生未有之语速，迅速地向黑影求饶，但似乎没有什么卵用，你被杀了。但你的木鱼却保存了你的一丝元神得已在之后复活。功德降低${KnockNumber}!\r目前功德：${USER_NUMBER - KnockNumber}`;
            USER_DATA['number'] -= KnockNumber;
            e.reply([end3])
            this.finish('Event3')
            delete answer[e.user_id]
            USER_DATA['cd']['random'] = CURRENT_SECOND + configData['cd_random'];
            USER_DATA['log']['random'].push(`[${getCurrentDate()}] 减了${KnockNumber}功德`);
            storagePlayerData(ID[0], USER_DATA);
        }
    }

    async Event4(e){
        const ID = [e.user_id]
        const USER_DATA = await getPlayerData(ID[0]);
        const configData = await readConfiguration()
        const CURRENT_SECOND = timestampToSeconds(Date.now());
        const USER_NUMBER = USER_DATA['number'];
        e = this.e
        if(e.msg === '1'){
            let KnockNumber = lodash.random(configData['min_random'], configData['max_random']);
            let end1 = `你成功收服了小精灵，它成为了你的伙伴。功德加${KnockNumber}!\r目前功德：${USER_NUMBER + KnockNumber}`;
            USER_DATA['number'] += KnockNumber;
            e.reply([end1])
            this.finish('Event4')
            delete answer[e.user_id]
            USER_DATA['cd']['random'] = CURRENT_SECOND + configData['cd_random'];
            USER_DATA['log']['random'].push(`[${getCurrentDate()}] 加了${KnockNumber}功德`);
            storagePlayerData(ID[0], USER_DATA);
        } else if(e.msg === '2'){
            let KnockNumber = lodash.random(configData['min_random'], configData['max_random']);
            let end2 = `你让小精灵自由了，它感激地看着你离去。功德加${KnockNumber}!\r目前功德：${USER_NUMBER + KnockNumber}`;
            USER_DATA['number'] += KnockNumber;
            e.reply([end2])
            this.finish('Event4')
            delete answer[e.user_id]
            USER_DATA['cd']['random'] = CURRENT_SECOND + configData['cd_random'];
            USER_DATA['log']['random'].push(`[${getCurrentDate()}] 加了${KnockNumber}功德`);
            storagePlayerData(ID[0], USER_DATA);
        } else if(e.msg === '3'){
            let KnockNumber = lodash.random(configData['min_random'], configData['max_random']);
            let end3 = `你把小精灵送给了别人，它看起来很不开心。功德减${KnockNumber}!\r目前功德：${USER_NUMBER - KnockNumber}`;
            USER_DATA['number'] -= KnockNumber;
            e.reply([end3])
            this.finish('Event4')
            delete answer[e.user_id]
            USER_DATA['cd']['random'] = CURRENT_SECOND + configData['cd_random'];
            USER_DATA['log']['random'].push(`[${getCurrentDate()}] 减了${KnockNumber}功德`);
            storagePlayerData(ID[0], USER_DATA);
        }
    }

    async Event5(e){
        const ID = [e.user_id]
        const USER_DATA = await getPlayerData(ID[0]);
        const configData = await readConfiguration()
        const CURRENT_SECOND = timestampToSeconds(Date.now());
        const USER_NUMBER = USER_DATA['number'];
        e = this.e
        if(e.msg === '1'){
            let KnockNumber = lodash.random(configData['min_random'], configData['max_random']);
            let end1 = `你加入了他们，一起寻找宝藏，收获颇丰。功德加${KnockNumber}!\r目前功德：${USER_NUMBER + KnockNumber}`;
            USER_DATA['number'] += KnockNumber;
            e.reply([end1])
            this.finish('Event5')
            delete answer[e.user_id]
            USER_DATA['cd']['random'] = CURRENT_SECOND + configData['cd_random'];
            USER_DATA['log']['random'].push(`[${getCurrentDate()}] 加了${KnockNumber}功德`);
            storagePlayerData(ID[0], USER_DATA);
        } else if(e.msg === '2'){
            let KnockNumber = lodash.random(configData['min_random'], configData['max_random']);
            let end2 = `你偷听到了更多宝藏的秘密，但被他们发现了，险些丧命。功德减${KnockNumber}!\r目前功德：${USER_NUMBER - KnockNumber}`;
            USER_DATA['number'] -= KnockNumber;
            e.reply([end2])
            this.finish('Event5')
            delete answer[e.user_id]
            USER_DATA['cd']['random'] = CURRENT_SECOND + configData['cd_random'];
            USER_DATA['log']['random'].push(`[${getCurrentDate()}] 减了${KnockNumber}功德`);
            storagePlayerData(ID[0], USER_DATA);
        } else if(e.msg === '3'){
            let end3 = `你没有理会他们，继续自己的旅程。`;
            e.reply([end3])
            this.finish('Event5')
            delete answer[e.user_id]
            USER_DATA['cd']['random'] = CURRENT_SECOND + configData['cd_random'];
            USER_DATA['log']['random'].push(`[${getCurrentDate()}] 结束随机事件，没有加减功德`);
            storagePlayerData(ID[0], USER_DATA);
        }
    }

    async Event6(e){
        const ID = [e.user_id]
        const USER_DATA = await getPlayerData(ID[0]);
        const configData = await readConfiguration()
        const CURRENT_SECOND = timestampToSeconds(Date.now());
        const USER_NUMBER = USER_DATA['number'];
        e = this.e
        if(e.msg === '1'){
            let KnockNumber = lodash.random(configData['min_random'], configData['max_random']);
            let end1 = `你救助了受伤的狐狸，它感激地看着你离去。功德加${KnockNumber}!\r目前功德：${USER_NUMBER + KnockNumber}`;
            USER_DATA['number'] += KnockNumber;
            e.reply([end1])
            this.finish('Event6')
            delete answer[e.user_id]
            USER_DATA['cd']['random'] = CURRENT_SECOND + configData['cd_random'];
            USER_DATA['log']['random'].push(`[${getCurrentDate()}] 加了${KnockNumber}功德`);
            storagePlayerData(ID[0], USER_DATA);
        } else if(e.msg === '2'){
            let KnockNumber = lodash.random(configData['min_random'], configData['max_random']);
            let end2 = `你无视了受伤的狐狸，它失望地看着你离去。功德减${KnockNumber}!\r目前功德：${USER_NUMBER - KnockNumber}`;
            USER_DATA['number'] -= KnockNumber;
            e.reply([end2])
            this.finish('Event6')
            delete answer[e.user_id]
            USER_DATA['cd']['random'] = CURRENT_SECOND + configData['cd_random'];
            USER_DATA['log']['random'].push(`[${getCurrentDate()}] 减了${KnockNumber}功德`);
            storagePlayerData(ID[0], USER_DATA);
        } else if(e.msg === '3'){
            let end3 = `你决定捉住狐狸，结果它用力挣脱了，逃走了。`;
            e.reply([end3])
            this.finish('Event6')
            delete answer[e.user_id]
            USER_DATA['cd']['random'] = CURRENT_SECOND + configData['cd_random'];
            USER_DATA['log']['random'].push(`[${getCurrentDate()}] 结束随机事件，没有加减功德`);
            storagePlayerData(ID[0], USER_DATA);
        }
    }

    async Event7(e){
        const ID = [e.user_id]
        const USER_DATA = await getPlayerData(ID[0]);
        const configData = await readConfiguration()
        const CURRENT_SECOND = timestampToSeconds(Date.now());
        const USER_NUMBER = USER_DATA['number'];
        e = this.e
        if(e.msg === '1'){
            let KnockNumber = lodash.random(configData['min_random'], configData['max_random']);
            let end1 = `你戴上了古老的戒指，感觉到一股神秘的力量。功德加${KnockNumber}!\r目前功德：${USER_NUMBER + KnockNumber}`;
            USER_DATA['number'] += KnockNumber;
            e.reply([end1])
            this.finish('Event7')
            delete answer[e.user_id]
            USER_DATA['cd']['random'] = CURRENT_SECOND + configData['cd_random'];
            USER_DATA['log']['random'].push(`[${getCurrentDate()}] 加了${KnockNumber}功德`);
            storagePlayerData(ID[0], USER_DATA);
        } else if(e.msg === '2'){
            let end2 = `你决定把戒指卖掉，获得了一些银两。\n获得了300银两！`;
            e.reply([end2])
            this.finish('Event7')
            delete answer[e.user_id]
            USER_DATA['money'] += 300;
            USER_DATA['cd']['random'] = CURRENT_SECOND + configData['cd_random'];
            USER_DATA['log']['random'].push(`[${getCurrentDate()}] 结束随机事件，没有加减功德`);
            storagePlayerData(ID[0], USER_DATA);
        } else if(e.msg === '3'){
            let KnockNumber = lodash.random(configData['min_random'], configData['max_random']);
            let end3 = `你把戒指扔掉了，感觉有些可惜。功德减${KnockNumber}!\r目前功德：${USER_NUMBER - KnockNumber}`;
            USER_DATA['number'] -= KnockNumber;
            e.reply([end3])
            this.finish('Event7')
            delete answer[e.user_id]
            USER_DATA['cd']['random'] = CURRENT_SECOND + configData['cd_random'];
            USER_DATA['log']['random'].push(`[${getCurrentDate()}] 减了${KnockNumber}功德`);
            storagePlayerData(ID[0], USER_DATA);
        }
    }

    async Event8(e){
        const ID = [e.user_id]
        const USER_DATA = await getPlayerData(ID[0]);
        const configData = await readConfiguration()
        const CURRENT_SECOND = timestampToSeconds(Date.now());
        const USER_NUMBER = USER_DATA['number'];
        e = this.e
        if(e.msg === '1'){
            let KnockNumber = lodash.random(configData['min_random'], configData['max_random']);
            let end1 = `你揭穿了骗子，大家都感谢你，功德加${KnockNumber}!\r目前功德：${USER_NUMBER + KnockNumber}`;
            USER_DATA['number'] += KnockNumber;
            e.reply([end1])
            this.finish('Event8')
            delete answer[e.user_id]
            USER_DATA['cd']['random'] = CURRENT_SECOND + configData['cd_random'];
            USER_DATA['log']['random'].push(`[${getCurrentDate()}] 加了${KnockNumber}功德`);
            storagePlayerData(ID[0], USER_DATA);
        } else if(e.msg === '2'){
            let KnockNumber = lodash.random(configData['min_random'], configData['max_random']);
            let end2 = `你加入了骗子的行列，功德减${KnockNumber}!\r目前功德：${USER_NUMBER - KnockNumber}`;
            USER_DATA['number'] -= KnockNumber;
            e.reply([end2])
            this.finish('Event8')
            delete answer[e.user_id]
            USER_DATA['cd']['random'] = CURRENT_SECOND + configData['cd_random'];
            USER_DATA['log']['random'].push(`[${getCurrentDate()}] 减了${KnockNumber}功德`);
            storagePlayerData(ID[0], USER_DATA);
        } else if(e.msg === '3'){
            let end3 = `你选择旁观，没有参与其中。`;
            e.reply([end3])
            this.finish('Event8')
            delete answer[e.user_id]
            USER_DATA['cd']['random'] = CURRENT_SECOND + configData['cd_random'];
            USER_DATA['log']['random'].push(`[${getCurrentDate()}] 结束随机事件，没有加减功德`);
            storagePlayerData(ID[0], USER_DATA);
        }
    }

    async Event9(e){
        const ID = [e.user_id]
        const USER_DATA = await getPlayerData(ID[0]);
        const configData = await readConfiguration()
        const CURRENT_SECOND = timestampToSeconds(Date.now());
        const USER_NUMBER = USER_DATA['number'];
        e = this.e
        if(e.msg === '1'){
            let KnockNumber = lodash.random(configData['min_random'], configData['max_random']);
            let end1 = `你触摸了雕像，感受到一股力量，功德加${KnockNumber}!\r目前功德：${USER_NUMBER + KnockNumber}`;
            USER_DATA['number'] += KnockNumber;
            e.reply([end1])
            this.finish('Event9')
            delete answer[e.user_id]
            USER_DATA['cd']['random'] = CURRENT_SECOND + configData['cd_random'];
            USER_DATA['log']['random'].push(`[${getCurrentDate()}] 加了${KnockNumber}功德`);
            storagePlayerData(ID[0], USER_DATA);
        } else if(e.msg === '2'){
            let end2 = `你决定离开，不再理会雕像。`;
            e.reply([end2])
            this.finish('Event9')
            delete answer[e.user_id]
            USER_DATA['cd']['random'] = CURRENT_SECOND + configData['cd_random'];
            USER_DATA['log']['random'].push(`[${getCurrentDate()}] 结束随机事件，没有加减功德`);
            storagePlayerData(ID[0], USER_DATA);
        } else if(e.msg === '3'){
            let KnockNumber = lodash.random(configData['min_random'], configData['max_random']);
            let end3 = `你把雕像拿走了，感到一阵不安。功德减${KnockNumber}!\r目前功德：${USER_NUMBER - KnockNumber}`;
            USER_DATA['number'] -= KnockNumber;
            e.reply([end3])
            this.finish('Event9')
            delete answer[e.user_id]
            USER_DATA['cd']['random'] = CURRENT_SECOND + configData['cd_random'];
            USER_DATA['log']['random'].push(`[${getCurrentDate()}] 减了${KnockNumber}功德`);
            storagePlayerData(ID[0], USER_DATA);
        }
    }

    async Event10(e){
        const ID = [e.user_id]
        const USER_DATA = await getPlayerData(ID[0]);
        const configData = await readConfiguration()
        const CURRENT_SECOND = timestampToSeconds(Date.now());
        const USER_NUMBER = USER_DATA['number'];
        e = this.e
        if(e.msg === '1'){
            let KnockNumber = lodash.random(configData['min_random'], configData['max_random']);
            let end1 = `你帮助了迷路的旅人，他非常感激你，功德加${KnockNumber}!\r目前功德：${USER_NUMBER + KnockNumber}`;
            USER_DATA['number'] += KnockNumber;
            e.reply([end1])
            this.finish('Event10')
            delete answer[e.user_id]
            USER_DATA['cd']['random'] = CURRENT_SECOND + configData['cd_random'];
            USER_DATA['log']['random'].push(`[${getCurrentDate()}] 加了${KnockNumber}功德`);
            storagePlayerData(ID[0], USER_DATA);
        } else if(e.msg === '2'){
            let end2 = `你无视了旅人，继续自己的仙途`;
            e.reply([end2])
            this.finish('Event10')
            delete answer[e.user_id]
            USER_DATA['cd']['random'] = CURRENT_SECOND + configData['cd_random'];
            USER_DATA['log']['random'].push(`[${getCurrentDate()}] 结束随机事件，没有加减功德`);
            storagePlayerData(ID[0], USER_DATA);
        } else if(e.msg === '3'){
            let KnockNumber = lodash.random(configData['min_random'], configData['max_random']);
            let end3 = `你骗了旅人，他愤怒地离开了。功德减${KnockNumber}!\r目前功德：${USER_NUMBER - KnockNumber}`;
            USER_DATA['number'] -= KnockNumber;
            e.reply([end3])
            this.finish('Event10')
            delete answer[e.user_id]
            USER_DATA['cd']['random'] = CURRENT_SECOND + configData['cd_random'];
            USER_DATA['log']['random'].push(`[${getCurrentDate()}] 减了${KnockNumber}功德`);
            storagePlayerData(ID[0], USER_DATA);
        }
    }
}