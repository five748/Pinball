// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {

    },

    obsFunc(contact,self,other){
        let player_speed = other.getComponent(cc.RigidBody).linearVelocity
        other.getComponent(cc.RigidBody).linearVelocity = cc.v2(player_speed.x*0.7,player_speed.y*0.7)
    },

    obsSetColliderData(contact,self,other){
        contact.setRestitution(0.5);
        contact.setFriction(0.7);
    },  


});
