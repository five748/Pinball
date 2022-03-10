module.exports = {


    _loadPrefabs(prefabsPath){
        cc.resources.load(prefabsPath, function (err, prefab) {
            if (err){
                throw err;
            } 
            else{
                cc.instantiate(prefab);
            }
            
        })
    },

    _initMap(jsonName,jsonObj){
        cc.resources.load(jsonName, cc.JsonAsset, (err, res) => {
            if (err){
                throw err;
            } 
            else{
                jsonObj._levelJson = res.json;
            }
                
        })
    },

    _initPlayer(jsonName,jsonObj){
        cc.resources.load(jsonName, cc.JsonAsset, (err, res) => {
            if (err){
                throw err;
            } 
            else{
                jsonObj._playJson = res.json;
            }
        })
    },

    _loadPrefab(prefab,parent){
        let gameObject = cc.instantiate(prefab)
        gameObject.parent = parent;
        gameObject.setSiblingIndex(20)
        return gameObject;
    },

    _saveData(){
        globalData.save();
    },

    _loadData(){
        let datajson = null;
        return datajson = globalData.load();
    },
}
