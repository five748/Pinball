// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
const GlobalData = require("../GlobalData");
const Tool = require("../Tool");


cc.Class({
    extends: cc.Component,

    properties: {
        obs: [cc.Prefab],


        //障碍物对应的格子坐标
        _obs_1_pos: null,
        _obs_2_pos: null,
        _obs_3_pos: null,
        _obs_4_pos: null,

        obsParent: [cc.Node],
        targetNode: cc.Node,
        ObsTypeNum : [cc.Label],
        obsS : new Array()
    },


    //----------------------------------------------

    subSingleObsNum(index){
        this.ObsTypeNum[index].string = this.ObsTypeNum[index].string - 1;
    },


    refreshObsNum(level){
        this.ObsTypeNum[0].string = GlobalData.levelJson[level].Obs_1Num;
        this.ObsTypeNum[1].string = GlobalData.levelJson[level].Obs_2Num;

        this.ObsTypeNum[2].string = GlobalData.levelJson[level].Obs_3Num;
        this.ObsTypeNum[3].string = GlobalData.levelJson[level].Obs_4Num;
    },



    //-------------------------------------------------------------------------------------
    //-------------------------------------------------------------------------------------


    // start() {
    //     this.node.on('loadObs', function (event) {
    //         self.getObs(event.getUserData);
    //     });
    // },

    // getObs(ObsData) {
    //     let _obsData = ObsData.split("|");
    //     for (let i = 0; i < _obsData.length; i++) {
    //         let _obsdata = _obsData[i].split(",");
    //         this._instantiateObs(_obsdata[0], _obsdata[1]);
    //     }
    // },

    //加载障碍物
    loadObs(parent, area, level) {
        for (let i = 0; i < 4; i++) {
            this.obsS.push(this._instantiateObs(i,area , parent)) 
        }
        this.refreshObsNum(level)
        console.log(this.obsS)
    },

    _instantiateObs(index,area,parent) {
        let obs = Tool._loadPrefab(this.obs[index], parent)
        obs.getComponent("ObsMoveBase")._initData(area, this.obsParent[index],this,index);
        return obs
    },

});
