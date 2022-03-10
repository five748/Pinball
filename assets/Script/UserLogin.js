var wxShareTitle = "一起跟我去打病毒吧";
var wxFlauntTitle = "不好意思又又又破纪录了";
var globalData = require('globalData')

//const gamesystem = require('./gamesystem');
var userLogin = {
    hasLogin: false,
    nickname: '自己',
    avatarUrl: '',
    sharePicUrl: 'https://wxapp.sodapaopao.com/gameicons/DFJ.png',//分享图片的下载地址
    FlauntSharePicUrl: 'https://wxapp.sodapaopao.com/qinggong/gameimg/FlauntShare.jpg',
    gameIcons: [], //texture file path
    reviveVideoAd: null,
    reviveVideoAdCb: null,
    interstitialAd: null,
    adBanner: null,
    mainVer: 1,
    subVer: 0,
    videoAdunitId: 'adunit-4af98a3c4a38a3ea',
    bannerAdunitId: "adunit-e5025b2c1e8690fc",
    interstitialAdunitId: "adunit-99db6ca0f6f7f9a7",
    wxSystemInfo: null,
    downloadingIcons: 0,//正在下载的图片数量



    //目前包含了初始化功能。
    login() {
        var self = userLogin;

        //检查需要下载图片吗
        //download other games pic
        //从服务器上下载其他游戏的图片
        //userLogin.downloadOtherGamePic();

        if (self.hasLogin) return;

        //registe system event
        cc.game.on(cc.game.EVENT_HIDE, self.onHide.bind(self));
        cc.game.on(cc.game.EVENT_SHOW, self.onShow.bind(self));

        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            //get wx systeminfo
            self.wxSystemInfo = wx.getSystemInfoSync();


            //wx share ui
            wx.showShareMenu();
            var shareCallback = function () {
                // 用户点击了“转发”按钮
                return {
                    title: wxShareTitle,
                    imageUrl: userLogin.sharePicUrl,
                }
            };

            wx.onShareAppMessage(shareCallback);

            // user login 
            wx.login({
                success(res) {
                    if (res.code) {
                        //发起网络请求
                        wx.request({
                            url: 'https://wxapp.sodapaopao.com/server/xiaomiebingdu/userlogin',
                            data: {
                                code: res.code
                            },
                            success: userLogin.onUserLoginSuccess,
                            fail: userLogin.onUserLoginFail,
                        })
                    } else {
                        console.log('登录失败！' + res.errMsg)
                    }
                },
                fail(res) {
                    console.log("--登陆失败--");
                }
            })


            const data = wx.getSystemInfoSync()
            if (data.platform != "ios") {
                wx.showShareMenu({
                    withShareTicket: true,
                    menus: ['shareAppMessage', 'shareTimeline']
                })
                console.log("run to this")

                //判断版本库是否大于2.11.3
                let versionNum
                wx.getSystemInfo({
                    success: function (res) {
                        console.log("成功_看看基础库版本");
                        console.log(res);
                        versionNum = res.SDKVersion
                        if (self.compareVersion(versionNum, "2.11.3") >= 0) {
                            wx.onShareTimeline(() => {
                                return {
                                    title: '一起跟我去打病毒吧',
                                    imageUrl: 'https://wxapp.sodapaopao.com/qinggong/gameimg/FlauntShare.jpg', // 图片 URL
                                    query: 'a=1&b=2'
                                }
                            })
                        }

                    },
                    fail: function (err) {
                        console.log("失败,使用本地基础库版本");
                        console.log(err);
                        versionNum = globalData.baseLibrary
                        if (self.compareVersion(versionNum, "2.11.3") >= 0) {
                            wx.onShareTimeline(() => {
                                return {
                                    title: '一起跟我去打病毒吧',
                                    imageUrl: 'https://wxapp.sodapaopao.com/qinggong/gameimg/FlauntShare.jpg', // 图片 URL
                                    query: 'a=1&b=2'
                                }
                            })
                        }


                    }
                })


            }

        }



        self.hasLogin = true;
    },

    //版本号比较
    compareVersion(v1, v2) {
        v1 = v1.split('.')
        v2 = v2.split('.')
        const len = Math.max(v1.length, v2.length)

        while (v1.length < len) {
            v1.push('0')
        }
        while (v2.length < len) {
            v2.push('0')
        }

        for (let i = 0; i < len; i++) {
            const num1 = parseInt(v1[i])
            const num2 = parseInt(v2[i])

            if (num1 > num2) {
                return 1
            } else if (num1 < num2) {
                return -1
            }
        }
        return 0
    },


    AddVideo() {
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            //创建视频广告组件
            if (userLogin.reviveVideoAd == null) {
                this.videoAd = wx.createRewardedVideoAd({
                    adUnitId: userLogin.videoAdunitId
                })
                userLogin.reviveVideoAd = this.videoAd;
                this.videoAd.onError(userLogin.onReviveAdError.bind(userLogin));
                this.videoAd.load()
                    .catch(err => console.log(err.errMsg))
            }
        }

    },
    //创建插屏广告组件
    AddInterstitialAd() {
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {

            if (userLogin.InterstitialAd == null) {
                userLogin.interstitialAd = wx.createInterstitialAd({
                    adUnitId: userLogin.interstitialAdunitId
                })
            }

            userLogin.interstitialAd.onLoad(() => {
                  console.log('插屏 广告加载成功')
            })
            userLogin.interstitialAd.onError(err => {
                console.log(err)
            })
            userLogin.interstitialAd.onClose(res => {
                //  console.log('插屏 广告关闭')
            })
        }

    },

    onUserLoginSuccess(res) {
        console.log('login success')
        console.log(res.data);
        console.log(res.data.toString());
        console.log(res.session_key)
        //gamesystem.getMainMenuUI().openid = res.data.openid
        //向子域传自身的openid
        window.wx.postMessage({
            messageType: 4,
            opid: res.data.openid
        });
        //check auth then get userinfo
        userLogin.checkWXAuth();
    },

    onUserLoginFail(res) {
        console.log('login faile', res);
    },

    checkWXAuth() {
        wx.getSetting({ success: userLogin.onGetSettingSuc });

    },
    // 微信授权
    // onGetSettingSuc(res) {
    //     if (!res.authSetting['scope.userInfo']) {
    //         wx.authorize({
    //             scope: 'scope.userInfo',
    //             success: userLogin.onAuthorizeSuc,
    //             //fail: userLogin.createWXUserInfoButton(),
    //         })
    //     }
    //     else {
    //         userLogin.onAuthorizeSuc();
    //     }
    // },

    createWXUserInfoButton() {
        const button = wx.createUserInfoButton({
            type: 'text',
            text: '获取用户信息',
            style: {
                left: 10,
                top: 76,
                width: 200,
                height: 40,
                lineHeight: 40,
                backgroundColor: '#ff0000',
                color: '#ffffff',
                textAlign: 'center',
                fontSize: 16,
                borderRadius: 4
            }
        })
        button.onTap((res) => {
            console.log(res)
        })
    },

    onAuthorizeSuc() {
        // 用户已经同意小程序使用功能，后续调用 wx.getUserInfo 接口不会弹窗询问
        wx.getUserInfo({ withCredentials: true, success: userLogin.onUserInfoSuc, fail: userLogin.onUserInfoFail });
    },

    onUserInfoSuc(res) {
        userLogin.nickname = res.userInfo.nickName;
        userLogin.avatarUrl = res.userInfo.avatarUrl;
        //suc get user no encrypt info
        cc.systemEvent.emit('UserLoginNoEncryptSuccess');

        //发起网络请求
        wx.request({
            url: 'https://wxapp.sodapaopao.com/server/xiaomiebingdu/userlogin',
            method: 'Poth',
            data: {
                code: res,
            },
            success: userLogin.onSendUserInfoSuccess,
            fail: userLogin.onSendUserInfoFail,
        })

    },

    onUserInfoFail(e) {
        console.log(e);
    },

    onSendUserInfoSuccess(res) {
        console.log('onSendUserInfoSuccess')
    },

    onSendUserInfoFail() {

        console.log('onSendUserInfoFail')
    },
    onGameNavigateClick(AppId) {
        if (typeof (wx) == "underfined") return;
        wx.navigateToMiniProgram({
            appId: AppId,
            path: '',
            success(res) {
                // 打开成功
            }
        })
    },

    onClickShareApp() {
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            wx.shareAppMessage({
                title: wxShareTitle,
                imageUrl: userLogin.sharePicUrl,
            });
        }
    },

    onClickFlauntShareApp() {
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            // wx.shareAppMessage({
            //    title: wxFlauntTitle,
            //    imageUrl: userLogin.FlauntSharePicUrl,
            // });

            var canvas = cc.game.canvas;
            var width = cc.winSize.width;
            var height = cc.winSize.height;
            canvas.toTempFilePath({
                x: 0,
                y: 0,
                width: width,
                height: height,
                destWidth: width,
                destHeight: height,
                success(res) {
                    wx.shareAppMessage({
                        title: wxFlauntTitle,
                        imageUrl: res.tempFilePath
                    })
                }
            })

        }
    },

    downloadOtherGamePic() {
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            var urls = ['https://wxapp.sodapaopao.com/gameicons/leitingnuxue.png',
                'https://wxapp.sodapaopao.com/gameicons/wanjieqingyuan.png',
                'https://wxapp.sodapaopao.com/gameicons/guashoubiezou.png',
                'https://wxapp.sodapaopao.com/gameicons/woaijiemi.png',];


            var fm = wx.getFileSystemManager();
            var fdir = `${wx.env.USER_DATA_PATH}` + '/shareGameIcons';
            //check dir
            try {
                fm.accessSync(fdir);
            }
            catch (err) {
                console.log(err);
                fm.mkdirSync(fdir);
            }

            for (var furl of urls) {
                //check file exist
                var fname = furl.split('/');
                fname = fname.pop();
                // var fpath = wx.env.USER_DATA_PATH+'/shareGameIcons/'+ fname;
                var fpath = fdir + '/' + fname;
                userLogin.gameIcons.push(fpath);
                try {
                    fm.accessSync(fpath);
                }
                catch (err) {
                    userLogin.downloadingIcons += 1;
                    userLogin.doDownloadFile(furl, fpath);
                }

            }

            //不需要下载icons
            if (userLogin.downloadingIcons < 1) {
                console.log("no game icons need download");
                cc.systemEvent.emit("OtherGameIconFinish");
            }
        }
    },

    doDownloadFile(theUrl, path) {
        wx.downloadFile({
            url: theUrl,
            filePath: path,
            success: function (res) {
                userLogin.downloadingIcons -= 1;
                console.log("success download file:" + path + " ,statecode:" + res.statusCode);
                //all icons finish
                if (userLogin.downloadingIcons < 1) {
                    console.log("all game icons downloaded");
                    cc.systemEvent.emit("OtherGameIconFinish");
                }
                // fm.saveFile({
                //    tempFilePath:res.tempFilePath,
                //    filePath:fpath,
                //    success:function(){
                //        console.log("success to save temp file:"+fpath);
                //    },
                //    fail:function(res){
                //        console.log("fail to save temp file:"+fpath, res.errMsg);
                //    },
                // });
            },
            fail: function () {
                console.log("fail download file:" + furl);
            },
        });
    },

    //广告相关
    showReviveAd(callbackFunc) {
        if (callbackFunc != null) {
            var reviveVideoAd = userLogin.reviveVideoAd;
            userLogin.reviveVideoAdCb = callbackFunc;
            console.log(this.reviveVideoAdCb + "=v=");
            console.log(userLogin.reviveVideoAd + "+v+");
            reviveVideoAd.onClose(userLogin.onReviveAdClose);

            reviveVideoAd.show()
                .catch(err => {
                    reviveVideoAd.load()
                        .then(() => reviveVideoAd.show())
                })
        }

    },
    //取消广告监听小心，此处监听会不断累加，重新加载场景后，前面添加的回调会失效出错。
    onReviveAdClose(res) {
        userLogin.reviveVideoAd.offClose(userLogin.onReviveAdClose);
        console.log(res + "########################");
        if (res && res.isEnded || res === undefined) {
            userLogin.reviveVideoAdCb();
            console.log("!!!!!!!!!!");
        }
        else {
            // 播放中途退出，不下发游戏奖励
        }

        //userLogin.reviveVideoAdCb = null;

    },

    //emptyFunc

    onReviveAdError(res) {
        console.log(res);
        userLogin.reviveVideoAd = null;
        console.log("没看完")

    },

    //插屏广告
    showInterstitialAd() {
        if (userLogin.interstitialAd) {
            userLogin.interstitialAd.show().catch((err) => {
                console.error(err)
            })
        }
    },



    hideBannerAd() {
        if (userLogin.adBanner) {
            userLogin.adBanner.hide();
        }
    },

    showBannerAd() {
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            userLogin.showWXBannerAd();
        }
    },

    showWXBannerAd() {
        //创建banner广告组件
        if (userLogin.adBanner != null) {
            userLogin.adBanner.destroy();
        }

        userLogin.adBanner = wx.createBannerAd({
            adUnitId: userLogin.bannerAdunitId,
            style: {
                left: 0,
                top: userLogin.wxSystemInfo.windowHeight - userLogin.wxSystemInfo.windowWidth / 3,
                width: userLogin.wxSystemInfo.windowWidth,
                height: userLogin.wxSystemInfo.windowWidth / 4,
            }
        })

        userLogin.adBanner.onError(err => {
            console.log(err)
        })

        userLogin.adBanner.onLoad(() => {
            console.log('banner 广告加载成功')
        })

        userLogin.adBanner.show()
            .then(() => console.log('banner 广告显示'))
            .catch(err => console.log(err))

        userLogin.adBanner.onResize(res => {
            console.log(`banner onresize width:${res.width}, height:${res.height}`);
            //调整banner宽高
            var h = userLogin.wxSystemInfo.windowWidth / 4;
            var w = userLogin.wxSystemInfo.windowWidth;

            if (res.width == 300) {
                h = res.height;
                w = res.width;
            }
            else if (res.height > h + 0.5) {
                w = Math.ceil(w * (h / res.height));
                if (w < 300) {
                    w = 300;
                }
            }
            else {
                w = res.width;
                h = res.height;
            }

            userLogin.adBanner.style.left = (userLogin.wxSystemInfo.windowWidth - w) / 2;
            userLogin.adBanner.style.top = userLogin.wxSystemInfo.windowHeight - h;
            userLogin.adBanner.style.width = w;
            userLogin.adBanner.style.height = h;
        })

    },


    //game control

    onHide() {
        console.log('---------game on hide-------');
        cc.game.pause();
    },

    onShow() {
        console.log('---------game on show-------');
        cc.game.resume();
    },
    updateEnvVersion() {
        
       
       console.log("这的版本是"+globalData.version)
        return globalData.version
    },
    //开放数据域排行榜代码
    submitScore(index) {
        let _check = index;
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            window.wx.postMessage({
                messageType: 3,
                MAIN_MENU_NUM: "x1",
                score: _check
            });
            cc.log("提交得分: x1 : " + _check)
        } else {
            cc.log("提交得分: x1 : " + _check)
        }
    },
    //判断是否是该场景和是否接受邀请进入游戏，向子域发送事件
    isReceiveInvite() {
        let query = wx.getLaunchOptionsSync().query
        if (wx.getLaunchOptionsSync() && query.shareMessageToFriendScene === '1') {
            window.wx.postMessage({
                event: 'reciveInvite',
            });
        }
    },
    //判断是否修改互动数据
    isModified(callbackFunc){
        wx.onInteractiveStorageModified(
            callbackFunc
        )
    }


}

module.exports = userLogin;
