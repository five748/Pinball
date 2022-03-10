// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        _pos : cc.v2,
        _target : cc.Node,
        _oldPos : null,
        _initParent : cc.Node, 
        _obsFactory : null,
        _self_type : 0
    },
    

    _initData(target,parent,obsFactory,type){
        this._target = target;
        this._oldPos = this.node.position;
        this.node.parent = parent;
        this.node.position = cc.v2(0,0);
        this._obsFactory = obsFactory;
        this._self_type = type
    },

    start () {
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this._onTouchMove, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this._onTouchEnd, this);
        this._oldPos = this.node.position;
    },

    _onTouchMove(touchEvent) {
        let location = touchEvent.getLocation();
        this.node.position = this.node.parent.convertToNodeSpaceAR(location); // 确定位置
    },

    _onTouchEnd(touchEvent) {


        let inTarget = false;
         if (this.judgeObsOnNode(this._target,touchEvent)) {
            inTarget = true;
            this.refreshNum()
        }
        console.log(inTarget)
        if (!inTarget) {
            this.node.position = this._oldPos; // 回去
        }
        // 
        
    },

    onPreSolv: function (contact, selfCollider, otherCollider) {
        //console.log(contact.getW)
        this.obsSetColliderData(contact ,selfCollider.node, otherCollider.node);
    },

    onBeginContact: function (contact, selfCollider, otherCollider) {
        //console.log(contact.getW)
        this.obsFunc(contact ,selfCollider.node, otherCollider.node);
    },
    onEndContact: function (contact, selfCollider, otherCollider) {
        this.startObsMove(otherCollider.node);
    },

    refreshNum(){
        if (this._obsFactory.ObsTypeNum[this._self_type].string >= 2) {
            this._obsFactory._instantiateObs(this._self_type,this._target,this._target.parent)
        }

        this._obsFactory.subSingleObsNum(this._self_type)
    },
    
    obsFunc(contact,self,other){

    },

    obsSetColliderData(contact,self,other){

    },

    startObsMove(other){
    },

    judgeObsOnNode(node , touchEvent){
        let rect = node.getBoundingBox();
        let location = touchEvent.getLocation();
        let point = node.parent.convertToNodeSpaceAR(location);
        return rect.contains(point);
    },

});
