const _saveDataKey = 'saveData'
var _saveData = null
var _gameData = null

class SaveData{
    _level = 0;
    _allScore = 0;
    _SelectID = 0;
    _unlockNum = [0,1];
    _levelJson = null;
    _playData = null;

    save(){
        cc.sys.localStorage.setItem(_saveDataKey, JSON.stringify(this))
    }

    load() {
        if (cc.sys.localStorage.getItem(_saveDataKey) == '' || typeof cc.sys.localStorage.getItem(_saveDataKey) == 'undefined' || cc.sys.localStorage.getItem(_saveDataKey) == null) {

        }
        else {
            let _saveData1 = JSON.parse(cc.sys.localStorage.getItem(_saveDataKey))
            if (_saveData1) {
                _saveData = _saveData1
                _saveData.__proto__ = SaveData.prototype;
            }
            else {
                // first playgame, keep init value
            }
        }

        return _saveData
    }
}

module.exports = _saveData = new SaveData()
