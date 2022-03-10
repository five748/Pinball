// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,    
    //编辑器属性定义
    properties: {
        zIndex: {
            type: cc.Integer, //使用整型定义
            default: 0,            
            //使用notify函数监听属性变化
            notify(oldValue) {                
                //减少无效赋值
                if (oldValue === this.zIndex) {               
                    return;
                }
                this.node.zIndex = this.zIndex;
            }
        }
    },
    onLoad () {        
        this.node.zIndex = this.zIndex;
    }
});
