// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const GlobalData = require("./GlobalData");
const Tool = require("./Tool");


cc.Class({
    extends: cc.Component,

    properties: {
        arrow : cc.Node,
        player : cc.Node,
        circleRadius : 1,
        carspeed:200,
        radian:0,
        maxDistance : 200,
        minDistance : 0,
        arrow_height : 0,
        arrow_width : 0,
        _touchProint : cc.v2(0,0),
        rigidbody:cc.RigidBody,
        collider : cc.PhysicsCircleCollider,
        _speed_x : 0,
        _speed_y : 0,
        _addDistance : 0,
        _backGround : cc.Node,
        _num : 0, //碰撞次数
        _level : 0, //当前关卡
        map : [cc.Prefab],
        _self_map : null,
        anim_Node : cc.Prefab,
        _gameSucceed : 0,
        _gameisScueed : true,
        _teamScore : 0,    //临时的分数（成功闯关才加上）
        obs :[cc.Prefab],   /////////   0是圆形，1是三角
        player_Spr : [cc.SpriteFrame],
        playerSprite : cc.Sprite,
        _pull : 0,   //拉力
        tail : cc.MotionStreak,
        obsFarme : cc.Node,
        canvas : cc.Node,
        gameManage : null
        
    },

    initData(pos,backGround,gameManage){
        this.initArrow();
        this.rigidbody.gravityScale = 0
        this._backGround = backGround
        this.gameManage = gameManage
        this._num = gameManage._num
        let _pos =pos
        this.node.position = cc.v2(_pos[0],_pos[1]);
        
        this.arrow.active = false;
        this.circleRadius = 38;
        //this.gameManage.ObsFactory.loadObs(this._self_map,x)
        //////////读表设置球的属性/////////////////
        this.playerSprite.spriteFrame = this.player_Spr[GlobalData._SelectID];
        this.collider.restitution = GlobalData._playData[GlobalData._SelectID].Stretch;
        this._pull = GlobalData._playData[GlobalData._SelectID].Pull;

    },


    

    onBeginContact: function (contact, selfCollider, otherCollider) {
        this.setPlayerCollider(otherCollider.node);
    },

    onEndContact: function (other, self) {
    },

    onPreSolve: function (contact, selfCollider, otherCollider) {

    },

    startTouch(event){
        if(this.gameManage.startGame){
        this.arrow.active = true;
        let pos = this.worldPosToLocalPos(this.node,event.getLocation());
        this._touchProint =cc.v2(pos.x,pos.y-300)
        }
    },
    moveTouch(event){
        let _pos = this.worldPosToLocalPos(this.node,event.getLocation());
        let pos = cc.v2(_pos.x,_pos.y-300)
        this.circleMove(pos,this);
    },
    endTouch(){
        if(this.gameManage.startGame){
            this.shootPlayer(this);
        }   
    },
    cancelTouch(){
        this.arrow.setContentSize(this.arrow_width,this.arrow_height)
    },
   

    

    //每次碰撞检测球的速度，如果速度过小，就取消弹性，并且结束游戏
    setPlayerCollider(other){
        
        let self_lineSpeed = this.rigidbody.linearVelocity;
        let selfSpeed = Math.sqrt(self_lineSpeed.x * self_lineSpeed.x + self_lineSpeed.y * self_lineSpeed.y)
        

        this._num -= 1;
        if(this._num <= 0){
            //this.addLevel();
            if (other.group != "well") return;
            
            let anim_boom =  Tool._loadPrefab(this.anim_Node,other)
            anim_boom.getComponent(cc.Animation).play();
            this.gameManage._gameisScueed = false
            anim_boom.getComponent(cc.Animation).scheduleOnce(function() {
                // 这里的 this 指向 component
                other.destroy();
                let _score = new cc.Event.EventCustom('pushScore', true)
                _score.setUserData(100)
                this.node.dispatchEvent(_score)
            }, 0.29);
            return;
        }

        if(selfSpeed <= 400 ||other.group == "gameOver"){
            this.collider.restitution = 0
            this.collider.apply()
            this.node.dispatchEvent(new cc.Event.EventCustom('gameOver', true))

            // this.node.emit("gameOver",function(event){
            //     msg : "游戏结束"
            // })
            return;
        }
        console.log("------碰到了-----",this._num)
        
    },

    removeLine(){
        this.rigidbody.linearVelocity = 0;
    },
    

    initArrow(){
        this.arrow_width = this.arrow.width;
        this.arrow_height = this.arrow.height;
    },

    circleMove (index,self) {
        // 先计算弧度
        let _angle = self.getVector(self.player.position,index);
        let distance = index.sub(self._touchProint).mag();
        let hudu = _angle*(Math.PI/180);
        self.radian = hudu;
        let x = self.circleRadius * Math.cos(self.radian)//+ self.player.position.x; 
        let y = self.circleRadius * Math.sin(self.radian) //+ self.player.position.y;
        let angle = 360- 180/Math.PI*self.radian;
        let pos = cc.v2(x, -y)
        self.arrow.position = cc.v2(x, -y);

        self.arrow.angle = angle + 90;
        self.setArrow(distance,self);
    },

    worldPosToLocalPos(node , position){
        return node.convertToNodeSpaceAR(position);
    },
    

    getVector(vec_1,vec_2){
        let dir_x = vec_1.x - vec_2.x;
        let dir_y = vec_1.y - vec_2.y;
        let dir = cc.v2(dir_x,dir_y);
        dir.normalizeSelf();
        let angle = dir.signAngle(cc.v2(1,0));
        var degree = angle / Math.PI * 180;
        return degree;
    },

    setArrow(distance , self){
        self.arrow.height = self.arrow_height
        if (distance >= self.minDistance) {
            distance = distance - self.minDistance
        }
        else if (distance <= self.minDistance) {
            distance = 0
        }
        if (distance >= self.maxDistance){
            distance = self.maxDistance
        }
        self._addDistance = distance / 4
        self.arrow.setContentSize(28,self.arrow.height + self._addDistance)
    },
    
   
    

    shootPlayer(self){
        self.arrow.active = false;
        self.rigidbody.gravityScale = 10
        let x = self.arrow.position.x * self._addDistance / (self.maxDistance - self.minDistance) * 1000;
        self.rigidbody.applyLinearImpulse(cc.v2((self.arrow.position.x * self._addDistance / (self.maxDistance - self.minDistance) * 1000),(self.arrow.position.y * self._addDistance / (self.maxDistance - self.minDistance) * 1000)), self.rigidbody.getWorldCenter(),true);
        this._backGround.pauseSystemEvents()
    },
});
