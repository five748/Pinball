

cc.Class({
    extends: cc.Component,

    properties: {
       
    },

    

     onLoad () {
        cc.tween(this.node)
        .repeatForever(
            cc.tween()
            .by(15,{position:cc.v2(-80,-100),angle:270})
            .by(15,{position:cc.v2(200,-80),angle:-180})
            .by(15,{position:cc.v2(-90,300),angle:270})
            .by(15,{position:cc.v2(-30,-120),angle:-360})
        )
        .start()
     },

    

    
});
