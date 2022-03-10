// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        decSprites : [cc.SpriteFrame],
        des_spr : cc.Sprite,
        _state : null
    },

    onLoad(){

    },


    /////0是成功，1是失败
    showDes(state){
        this.node.active = true
        this.des_spr.spriteFrame = this.decSprites[state]
        
        this._state = state
    },

    confirmOnClick(){
        this.node.active = false
        if(this._state == 0){
            this.node.dispatchEvent(new cc.Event.EventCustom('gameStart', true))
        }
        else{
            this.node.dispatchEvent(new cc.Event.EventCustom('gameFail', true))
        }
    }
});
