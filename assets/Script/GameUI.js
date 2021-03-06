// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

var GlobalData = require("./GlobalData");
const Tool = require("./Tool");
const scoreArr = [0,100,200,300,400,500]
cc.Class({
    extends: cc.Component,

    properties: {
        _levelJson : null,
        _playJson : null,
        shop : cc.Node,
        item : [cc.Node],
        shopBack : cc.Node,
        _shopNum : 0,
    },


    onLoad () {
        cc.sys.localStorage.clear()

        this.readAllJson();
    },

    start () {
        this.initShop();
    },

   

    readAllJson(){
        Tool.gameData = Tool._loadData();
        Tool._initMap("json/level",this)
        Tool._initPlayer("json/play",this)
        
    },

    playGameOnClick(){
        GlobalData._levelJson = this._levelJson
        GlobalData._playData = this._playJson
        cc.director.loadScene("game");
        
    },


    initShop(){
        this.changeColor(GlobalData._SelectID);
        this.changeLock();
    },
    
    shopOnClick(){
        if(this._shopNum == 0){
            this.shopBack.active = true
            cc.tween(this.shop)
            .by(0.5,{position:cc.v3(470,0,0)})
            .start()
            this._shopNum = 1
        }
        else{
            cc.tween(this.shop)
            .by(0.5,{position:cc.v3(-470,0,0)})
            .call(()=>{
                this.shopBack.active = false
            })
            .start()
            this._shopNum = 0

        }
    },

    selectOnClick(event,customEventData){
        console.log("--------点击了--------")
        GlobalData._SelectID = customEventData;
        this.changeColor(customEventData)
    },

    changeLock(){
        for (let i = 0; i < GlobalData._unlockNum.length; i++) {
            this.item[i].getChildByName('lockMask').active = false;
        }
    },

    changeColor(tempNum){
        for (let index = 0; index < this.item.length; index++) {
            if (index == tempNum) {
                this.item[index].color = new cc.Color(193,0,0)
            }
            else{
                this.item[index].color = new cc.Color(252,255,255)
            }
        }
    },
    //打开/关闭开放数据域,同时获取好友赠送的金币
    changeOpenArea() {

        cc.find("Canvas/background/RankNode").active = true
        window.wx.postMessage({
            messageType: 1,
            MAIN_MENU_NUM: "x1"
        });
    },
    //关闭开放数据域
    closeOpenArea() {
        cc.find("Canvas/background/RankNode").active = false
    },

    

    
});
