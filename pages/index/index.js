//index.js
//获取应用实例
var app = getApp()
const audioManager = wx.getBackgroundAudioManager()

const PROGRESS_WIDTH = 300

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    nodes:[{
      name:'ul',
      children:[{
        name:'li',
        children:[{
          type:'text',
          text:"aaaaafdsfdsf你好，发挥地方"
        }]
      },{
          name: 'li',
          children: [{
            type: 'text',
            text: "bbbbbbfdfsdfsf，大佛的身份房贷首付"
          }]
        }, {
          name: 'li',
          children: [{
            type: 'text',
            text: "bbbbbbfdfsdfsf，大佛的身份房贷首付"
          }]
      }, {
        name: 'li',
        children: [{
          type: 'text',
          text: "bbbbbbfdfsdfsf，大佛的身份房贷首付"
        }]
        }, {
          name: 'li',
          children: [{
            type: 'text',
            text: "bbbbbbfdfsdfsf，大佛的身份房贷首付fffff"
          }]
      }, {
        name: 'li',
        children: [{
          type: 'text',
          text: "bbbbbbfdfsdfsf，大佛的身份房贷首付"
        }]
      }
      ]
    }
    ],

    touchStartX: 0,
    touchStartTime: 0,
    seeking: false,
    currentKey: '',
    audios: {
      key1:{
        url:"http://img.codfly.com/insight/stay_here_forever.mp3",
        playing:false,
        duration: 0,
        time: 0
      },
      key2: {
        url: "http://img.codfly.com/insight/mademoiselle.mp3",
        playing:false,
        duration: 0,
        time: 0
      }
    }
  },
  getAudio(key) {
    return this.data.audios[key]
  },
  playAndStop: function(event) {
    console.log(event)
    var key = event.currentTarget.dataset.key
    var targetUrl = this.data.audios[key].url

    var nowKeyIndex = 'audios.' + key + '.playing'
    var preKeyIndex = 'audios.' + this.data.currentKey + '.playing'

    if(audioManager.src === targetUrl) {
      // 点击的就是当前播放
      this.data.currentKey = key

      if(audioManager.paused) {
        audioManager.play()

        var param = {}
        param[nowKeyIndex] = true
        this.setData(param)

      } else {
        audioManager.pause()

        var param = {}
        param[nowKeyIndex] = false
        this.setData(param)
      }

    } else {
      this.data.currentKey = key
      audioManager.startTime = this.data.audios[key].time
      audioManager.src = targetUrl

      var param = {}
      param[nowKeyIndex] = true
      param[preKeyIndex] = false
      this.setData(param) 

    }
  },
  setOneData(keyIndex, val) {
    var param = {}
    param[keyIndex] = val
    this.setData(param)
  },
  touchStart: function(event) {
    var key = event.target.dataset.key
    if (key !== this.data.currentKey) return

    this.data.touchStartX = event.touches[0].pageX
    this.data.touchStartTime = this.getAudio(key).time
  },
  touchMove: function (event) {
    // console.log(event)
    var key = event.target.dataset.key
    if(key !== this.data.currentKey) return

    this.data.seeking = true

    var audio = this.getAudio(key)
    var currentX = event.changedTouches[0].pageX
    var newTime = this.data.touchStartTime + (audio.duration * ((currentX - this.data.touchStartX)/PROGRESS_WIDTH))

    console.log(this.data.touchStartX +", " + currentX)
    console.log(audio.time +"," + newTime)

    this.setOneData('audios.' + key + '.time', newTime)
    
  },
  touchEnd: function (event) {
    console.log(event)
    var key = event.target.dataset.key
    if (key !== this.data.currentKey) return

    var audio = this.data.audios[key]
    console.log(this.data.touchStartTime + ", " + audio.time)
    if (audio.time === this.data.touchStartTime) {
      console.log("no need seek")
      this.data.seeking = false
      return 
    }

    console.log("seek time," + audio.time)
    audioManager.seek(audio.time)
    this.data.seeking = false
    console.log("current time," + audioManager.currentTime)
  },
  onLoad: function () {
    console.log('onLoad')
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        userInfo:userInfo
      })
    })

    audioManager.onCanplay(function() {
      console.log("can play")
      console.log(audioManager.duration)

      that.setOneData('audios.' + that.data.currentKey + '.duration', audioManager.duration)
    })

    audioManager.onTimeUpdate(function(){
      // console.log("time update")
      // console.log(audioManager.currentTime)
      var audio = that.getAudio(that.data.currentKey)

      if(audio.duration === 0 && audioManager.duration !== null) {
        that.setOneData('audios.' + that.data.currentKey + '.duration', audioManager.duration)
      }
      
      if(!audioManager.paused && !that.data.seeking){
        that.setOneData('audios.' + that.data.currentKey + '.time', audioManager.currentTime)
      }
    })
  }
})
