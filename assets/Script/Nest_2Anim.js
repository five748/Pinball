

cc.Class({
    extends: cc.Component,

    properties: {
       
    },

    

     onLoad () {
        cc.tween(this.node)
        .repeatForever(
            cc.tween()
            
            .by(15,{position:cc.v2(200,100),angle:360})
            .by(15,{position:cc.v2(-175,-75),angle:-360})
            .by(15,{position:cc.v2(-25,-25),angle:1080})
        )
        .start()
     },

    

    
});
