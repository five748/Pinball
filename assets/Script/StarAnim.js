

cc.Class({
    extends: cc.Component,

    properties: {
       
    },

    

    onLoad () {
        cc.tween(this.node)
        .repeatForever(
            cc.tween()
            .by(20,{position:cc.v2(0,-1250)})
            .by(0,{position:cc.v2(0,1250)})
            
            //.by(0.8,{position:cc.v2(0,-40)})
        )
        .start()
     },

    
});
