// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends:require("ObsMoveBase") ,

    properties: {

    },

    obsFunc(contact,self,other){
        let player_speed = other.getComponent(cc.RigidBody).linearVelocity
        other.getComponent(cc.RigidBody).linearVelocity = cc.v2(player_speed.x*1.5,player_speed.y*1.5)
    },

    
});
