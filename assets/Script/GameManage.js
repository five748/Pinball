// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const Tool = require("./Tool");
const userLogin = require("./UserLogin");
var globalData = null
cc.Class({
    extends: cc.Component,

    properties: {
        player : cc.Prefab,
        PopWindow : cc.Node,
        obsFactory : cc.Component,

        _playerMove : null,
        _player:cc.Node,
        _num : 0, //碰撞次数
        _level : 0, //当前关卡
        map : [cc.Prefab],
        _self_map : null,
        _gameSucceed : 0,
        _gameisScueed : true,
        _teamScore : 0,    //临时的分数（成功闯关才加上）
        obs :[cc.Prefab],   /////////   0是圆形，1是三角
        obsFarme : cc.Node,
        canvas : cc.Node,
        backGround : cc.Node,
        obsParnet : cc.Node,
        playGameButton : cc.Node,
        checkPointNode :cc.Node,

        startGame : false,
        scoreNum : cc.Label,
        levelNum : cc.Label,


    },

    start () {
        this.initGameData()
    },

    initGameData(){
        globalData = Tool.gameData
        this._level = globalData._level;
        console.log(Tool.gameData)
        this._num = globalData._levelJson[this._level].Num;
        

        let _pos = globalData._levelJson[this._level].playerPos.split(",")
        if(this._self_map != null){
            this._self_map.destroy();
        }

        this._self_map = Tool._loadPrefab(this.map[this._level],this.backGround)
        let area = this._self_map.getChildByName("area")
        this.obsFactory = this.canvas.getComponent("ObsFactory")
        this.obsFactory.loadObs(this._self_map,area,this._level)

        
        this._player = Tool._loadPrefab(this.player,this.backGround);
        this._playerMove = this._player.getComponent("PlayerMove")
        this._player.active = false

        this._playerMove.initData(_pos,this.backGround,this)
        this.obsFarme.active = true;
        this.playGameOnClick.active = true;
        this.playGameButton.active = true;

        this.showScoreLevel();
        
    },
    showScoreLevel(){
        this.changeGameCheckPoint(globalData._level+1);
        this.scoreNum.string = globalData._allScore;
    },
    addLevel(){
        globalData._level += 1
        this.changeGameCheckPoint(globalData._level+1);
        this.initGameData();
        this.pushScore( globalData._levelJson[this._level].Score)
    },
    addScore(){
        this._teamScore += 100;
        console.log(this._teamScore)
        
    },



    playGameOnClick(){
        this.startGame = true;
        this.touchMove();
        this.obsFarme.active = false;
        this._player.active = true;
        this.playGameButton.active = false;
    },

    
    

    touchMove(){
        this.backGround.resumeSystemEvents()
        let self = this;
        this.backGround.on(cc.Node.EventType.TOUCH_START,(event)=>{
            self._playerMove.startTouch(event);
        })
        this.backGround.on(cc.Node.EventType.TOUCH_MOVE,(event)=>{
            self._playerMove.moveTouch(event);

        })
        this.backGround.on(cc.Node.EventType.TOUCH_END,(event)=>{
            self._playerMove.endTouch();
        })
        this.backGround.on(cc.Node.EventType.TOUCH_CANCEL,(event)=>{
            self._playerMove.cancelTouch();
        })
    },

    //设置游戏内关卡显示
    changeGameCheckPoint: function (level) {
        let node_checkPoint = this.checkPointNode
        if (level == 1) {
            node_checkPoint.getChildByName('leftCheckPointSpr').active = false
            node_checkPoint.getChildByName('leftCheckPointLabel').active = false

            node_checkPoint.getChildByName('centerCheckPointLabel').getComponent(cc.Label).string = level
            node_checkPoint.getChildByName('rightCheckPointLabel').getComponent(cc.Label).string = level + 1
        }
        else {
            node_checkPoint.getChildByName('leftCheckPointSpr').active = true
            node_checkPoint.getChildByName('leftCheckPointLabel').active = true

            node_checkPoint.getChildByName('leftCheckPointLabel').getComponent(cc.Label).string = level - 1
            node_checkPoint.getChildByName('centerCheckPointLabel').getComponent(cc.Label).string = level
            node_checkPoint.getChildByName('rightCheckPointLabel').getComponent(cc.Label).string = level + 1
        }
    },

    update(dt){
        if(this._gameisScueed == false){
            this._gameSucceed += dt;
            if(this._gameSucceed >= 2){
                this.node.dispatchEvent(new cc.Event.EventCustom('gameSucceed', true))
                this._gameSucceed = 0;
                this._gameisScueed = true;
            } 
        }

    },

    onLoad(){

        let self = this;
        this.node.on('gameSucceed', function ( event ) {
            self.gameSucceed(self);
        });
        this.node.on('gameOver', function ( event ) {
            self.gameOver(self);
        });
        this.node.on('gameStart', function ( event ) {
            self.gameStart(self);
        });
        this.node.on('gameFail', function ( event ) {
            self.gameFail(self);
        });
        this.node.on("pushScore",function(event){
            self.pushScore(event.getUserData());
        }),
        this.node.on("colliderAddScore",function(event){
            self.addScore();
        }),

        cc.director.getCollisionManager().enabled = true;
        cc.director.getPhysicsManager().enabled = true;
    },

    gameStart(self){
        self.addLevel();
        globalData.save();

    },
    gameFail(self){
        self.initGameData();
    },
    gameOver(self){
        self._player.destroy();
        self.obsParnet.removeAllChildren()
        self._playerMove.removeLine();
        this.startGame = false;
        for (let i = 0; i < this.obsFactory.obsS.length; i++) {
            this.obsFactory.obsS[i].destroy();
        }
        this.obsFactory.obsS = new Array();
        self.PopWindow.getComponent('PopWindow').showDes(1);
    },
    gameSucceed(self){
        self._player.destroy();
        self.obsParnet.removeAllChildren()
        self._playerMove.removeLine();
        this.startGame = false;
        for (let i = 0; i < this.obsFactory.obsS.length; i++) {
            this.obsFactory.obsS[i].destroy()
        }
        this.obsFactory.obsS = new Array();
        self.PopWindow.getComponent('PopWindow').showDes(0)

    },


    
    pushScore(score){
        globalData._allScore += score;
        userLogin.submitScore(globalData._allScore)
        this.scoreNum.string = globalData._allScore;
    }


    
    

    
});
