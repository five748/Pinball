

cc.Class({
    extends: cc.Component,

    properties: {
       w : 120,
    },

    

    start () {

    },

    update(dt){
        this.node.angle += this.w * dt;
    }
    
});
