// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        player : cc.Node,
        PopWindow : cc.Node,
        obsFactory : cc.Component,
        
    },

    onLoad(){

        let self = this;
        this.node.on('gameSucceed', function ( event ) {
            self.gameSucceed(self);
        });
        this.node.once('gameOver', function ( event ) {
            self.gameOver(self);
        });
        this.node.on('gameStart', function ( event ) {
            self.gameStart(self);
        });
        this.node.on('gameFail', function ( event ) {
            self.gameFail(self);
        });

        cc.director.getCollisionManager().enabled = true;
        cc.director.getPhysicsManager().enabled = true;
    },

    gameStart(self){
        self.player.getComponent('PlayerMove').addLevel();
    },
    gameFail(self){
        self.player.getComponent('PlayerMove').initData();
    },
    gameOver(self){
        self.PopWindow.getComponent('PopWindow').showDes(1);
    },
    gameSucceed(self){
        self.PopWindow.getComponent('PopWindow').showDes(0)
    },


    
    

    
});
