<template>
  <div class="container">
    <!-- 區塊：name area -->
    <div class="name">
      <h3>Name：{{ userName }}</h3>
      <!-- 註解：使用@click來偵測click，觸發時執行method中的setName() -->
      <div class="reset" @click="setName()">Reset Name</div>
    </div>
    <!-- 區塊：chat room -->
    <div class="chatRoom">
      <!-- 區塊：head -->
      <div class="roomHead">
        <div class="roomHead__topButtons">
          <div class="roomHead__button close"></div>
          <div class="roomHead__button minimize"></div>
          <div class="roomHead__button zoom"></div>
        </div>
        <img src="https://lorempixel.com/50/50/" class="roomHead__img" draggable="false">
        <div class="roomHead__title">Test Room</div>
      </div>
      <!-- 區塊：body -->
      <div id="js-roomBody" class="roomBody">
        <!-- 註解：使用template來當迴圈容器，或是判斷用的容器，當條件達成時產出template內容 -->
        <template v-for="item in messages">
          <!-- other people -->
          <template v-if="item.userName != userName">
            <div class="messageBox">
              <img src="https://lorempixel.com/40/40/" class="messageBox__user" draggable="false">
              <div class="messageBox__content">
                <!-- 註解：Vue使用雙花括號{{}}來顯示script中data:的資料 -->
                <div class="messageBox__name">{{item.userName}}</div>
                <div v-if="item.type == 'text'" class="messageBox__message">{{item.message}}</div>
                <div v-if="item.type == 'image'" class="messageBox__image"><img :src="item.message"></div>
              </div>
              <div class="messageBox__time">{{item.timeStamp}}</div>
            </div>
          </template>
          <!-- 區塊：self -->
          <template v-if="item.userName == userName">
            <div class="messageBox messageBox--self">
              <div class="messageBox__time">{{item.timeStamp}}</div>
              <div class="messageBox__content">
                <div v-if="item.type == 'text'" class="messageBox__message">{{item.message}}</div>
                <div v-if="item.type == 'image'" class="messageBox__image"><img :src="item.message"></div>
              </div>
            </div>
          </template>
        </template>
        <!-- 區塊：上傳進度條 -->
        <div v-show="upload" class="messageBox messageBox--self">
          <div class="messageBox__progress">
            <div id="js-progressBar" class="messageBox__progress--state"></div>
            <div class="messageBox__progress--number">{{progress}}</div>
          </div>
        </div>
      </div>
      <!-- 區塊：bottom -->
      <!-- 註解：使用:class來寫class是否顯示的判斷式{ class: 判斷式 } -->
      <div class="roomBottom" :class="{ disable: !userName }">
        <div class="roomBottom__tools">
          <div class="roomBottom__tools_upload">
            <input type="file" accept="image/*" @change="sendImage($event)">
            <img src="../assets/tools_file.png">
          </div>
        </div>
        <div class="roomBottom__input">
          <!-- 若要再帶入原生js的event(e)到function中，必須使用$event當參數傳入 -->
          <textarea id="js-message" class="roomBottom__input__textarea" :class="{ disable: !userName }" @keydown.enter="sendMessage($event)"></textarea>
        </div>
      </div>
    </div>
    <!-- 區塊：modal -->
    <div id="js-modal" class="modal">
      <div class="modal__container">
        <header class="modal__header">
          <h2 class="view-title">輸入名稱</h2>
        </header>
        <div class="modal__body">
          <!-- 註解：使用@keydown.enter來偵測keydown enter，觸發時執行method中的saveName() -->
          <input type="text" id="js-userName" class="userName" maxlength="6" @keydown.enter="saveName()">
          <div class="button" @click="saveName()">設定</div>
        </div>
        <footer class="modal__footer"></footer>
      </div>
    </div>
  </div>
</template>

<script>
// msgRef = firebase中的資料表/messages/，若沒有的會自動建立
const msgRef = firebase.database().ref('/messages/');
msgRef.orderByChild("type").equalTo('image').on("child_added", function(snapshot) {
  console.log(snapshot.key);
});
const storageRef = firebase.storage().ref('/images/');
export default {
  // 指定此頁使用的name
  name: 'ChatRoom',
  // 資料位置，於html中可用{{}}渲染出來
  data() {
    return {
      userName: '',
      messages: [],
      upload: false,
      progress: ''
    }
  },
  // 這個頁面的functions
  methods: {
    /** 彈出設定視窗 */
    setName() {
      document.querySelector('#js-modal').style.display = 'block';
    },
    /** 儲存設定名稱 */
    saveName() {
      // vue的mtthod中this是指export中這整塊的資料
      const vm = this;
      const userName = document.querySelector('#js-userName').value;
      if (userName.trim() == '') { return; }
      // 這裡的vm.userName(this.userName)就是data()裡面的userName
      vm.userName = userName;
      document.querySelector('#js-modal').style.display = 'none';
    },
    /** 取得時間 */
    getTime() {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      return `${(hours >= 12) ? "下午" : "上午"} ${hours}:${(minutes < 10) ? '0' + minutes : minutes}`;
    },
    /** 傳送訊息 */
    sendMessage(e) {
      const vm = this;
      const userName = document.querySelector('#js-userName');
      let message = document.querySelector('#js-message');
      // 如果是按住shift則不傳送訊息(多行輸入)
      if (e.shiftKey) {
        return false;
      }
      // 如果輸入是空則不傳送訊息
      if (message.value.length <= 1 && message.value.trim() == '') {
        // 避免enter產生的空白換行
        e.preventDefault();
        return false;
      }
      // 對firebase的db做push，db只能接受json物件格式，若要用陣列要先轉字串來存
      msgRef.push({
        userName: userName.value,
        type: 'text',
        message: message.value,
        // 取得時間，這裡的vm.getTime()就是method中的getTime
        timeStamp: vm.getTime()
      })
      // 清空輸入欄位並避免enter產生的空白換行
      message.value = '';
      e.preventDefault();
    },
    /** 傳送圖片 */
    sendImage(e) {
      const vm = this;
      const userName = document.querySelector('#js-userName');
      // 取得上傳檔案的資料
      const file = e.target.files[0];
      const fileName = Math.floor(Date.now() / 1000) + `_${file.name}`;
      const metadata = {
        contentType: 'image/*'
      };
      // 取得HTML進度條元素
      let progressBar = document.querySelector('#js-progressBar');
      // 上傳資訊設定
      const uploadTask = storageRef.child(fileName).put(file, metadata);
      // 上傳狀態處理
      uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
        /* 上傳進度 */
        function(snapshot) {
          let progress = Math.floor((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          if(progress < 100) {
            // 開啟進度條
            vm.upload = true;
            vm.progress = `${progress}%`;
            progressBar.setAttribute('style',`width:${progress}%`);
          }
        },
        /* 錯誤處理 */
        function(error) {
          msgRef.child('bug/').push({
            userName: userName.value,
            type: 'image',
            message: error.code,
            timeStamp: vm.getTime()
          })
        },
        /* 上傳結束處理 */
        function() {
          var downloadURL = uploadTask.snapshot.downloadURL;
          msgRef.push({
            userName: userName.value,
            type: 'image',
            message: downloadURL,
            timeStamp: vm.getTime()
          })
          // 關閉進度條 
          vm.upload = false;
        });
    }
  },
  // mounted是vue的生命週期之一，代表模板已編譯完成，已經取值準備渲染元件了
  mounted() {
    const vm = this;
    msgRef.on('value', function(snapshot) {
      const val = snapshot.val();
      vm.messages = val;
    })
  },
  // update是vue的生命週期之一，在元件渲染完成後執行
  updated() {
    // 當畫面渲染完成，把聊天視窗滾到最底部(讀取最新消息)
    const roomBody = document.querySelector('#js-roomBody');
    roomBody.scrollTop = roomBody.scrollHeight;
  }
}
</script>

<style scoped>
* {
  font-family: '微軟正黑體';
  margin: auto;
}
.container {
  padding: 10px 30px 0px 0px;
}
.name {
  text-align: center;
  margin: 10px 50px 10px 0px;
  color: #333333;
}
.reset {
  margin-top: 10px;
  padding: 5px 10px;
  border-radius: 10px;
  font-weight: 600;
  color: #333333;
  background-color: #CCCCCC;
  display: inline-block;
  cursor: pointer;
}
.chatRoom {
  border-radius: 5px;
  max-width: 500px;
  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
}

/* Head */
.roomHead {
  width: 100%;
  height: 85px;
  border-radius: 5px 5px 0px 0px;
  background-color: #2B364B;
  position: relative;
}
.roomHead__topButtons {
  padding: 2px 0px 5px 10px;
  text-align: left;
}
.roomHead__button {
  height: 10px;
  width: 10px;
  border-radius: 50%;
  margin: 0px 1px;
  display: inline-block;
  cursor: pointer;
}
.close {
  background-color: #FF625A;
}
.minimize {
  background-color: #FFC02F;
}
.zoom {
  background-color: #28CB40;
}
.roomHead__img {
  width: 50px;
  height: 50px;
  margin: 0px 10px 6px 12px;
  border-radius: 50%;
  position: absolute;
  cursor: pointer;
}
.roomHead__title {
  font-size: 13px;
  font-weight: 600;
  color: #FFFFFF;
  height: 80px;
  margin: 5px 0px 0px 75px;
  position: absolute;
  cursor: pointer;
}

/* Body */
.roomBody {
  padding: 10px 0px;
  background-color: #fff;
  height: 60vh;
  overflow-y: auto;
  overflow-x: hidden;
}
.messageBox {
  padding: 5px 10px;
  position: relative;
}
.messageBox__user {
  height: 40px;
  width: 40px;
  border-radius: 50%;
  vertical-align: top;
  display: inline-block;
  cursor: pointer;
}
.messageBox__content {
  max-width: 70%;
  display: inline-block;
}
.messageBox__name {
  margin: 5px 0px 5px 5px;
  font-size: 13px;
  color: #727C8A;
  vertical-align: top;
  cursor: pointer;
}
.messageBox__message{
  margin: 5px 0px 5px 5px;
  padding: 8px 10px 7px 11px;
  font-size: 12px;
  letter-spacing: 0.6px;
  background-color: #E3E8EB;
  border-radius: 12px;
  line-height: 1.5;
  text-align: left;
  word-break: break-all;
  /*：與html的<pre></pre>同效果，可以使textarea的換行元素正常顯示 */
  white-space: pre-line;
}
.messageBox__image {
  margin: 5px 25px 5px 5px;
}
.messageBox__image img {
  border-radius: 5px;
  max-width: 100%;
  max-height: 335px;
}
.messageBox__time {
  transform: scale(0.7);
  color: #ACB0B8;
  vertical-align: bottom;
  margin: 0px 0px 5px -12px;
  display: inline-block;
}
.messageBox__progress {
  width: 25%;
  margin-right: 60px;
  border-radius: 5px;
  background-color: #D4D9E1;
  height: 6px;
}
.messageBox__progress--state {
  background-color: #00CE00;
  height: 6px;
  width: 10%;
  border-radius: 5px;
  float: right;
}
.messageBox__progress--number {
  position: absolute;
  top: 0;
  right: 0;
  font-size: 12px;
  color: #B7B7B7;
  margin-right: 35px;
}
.messageBox--self {
  text-align: right;
}
.messageBox--self .messageBox__message {
  background-color: #AFF47E;
  margin-right: 25px;
}
.messageBox--self .messageBox__time {
  margin: 0px -16px 5px 0px;
}

/* Bottom */
.roomBottom {
  bottom: 0px;
  border-radius: 0px 0px 5px 5px;
  background-color: #FFFFFF;
}
.roomBottom__tools {
  border-top: solid 1px #E7E7E7;
  border-bottom: solid 2px #E7E7E7;
  background-color: #F6F6F6;
  height: 30px;
  padding: 0px 5px;
}
.roomBottom__tools_upload {
  height: 20px;
  margin: 5px;
  padding: 1px;
  display: inline-block;
  position: relative;
  overflow: hidden;
}
.roomBottom__tools_upload:hover {
  border: solid 1px #DCDCDC;
}
.roomBottom__tools_upload input {
  width: 100%;
  height: 100%;
  left: 0;
  right: 0;
  opacity: 0; 
  position: absolute;
  cursor: pointer;
  /* 讓input file可以支援pointer要加pl100% */
  padding-left: 100%;
}
.roomBottom__tools_upload img {
  height: 100%;
}
.roomBottom__input {
  padding: 10px 10px 5px 10px;
}
.roomBottom__input__textarea {
  width: 100%;
  height: 60px;
  border: none;
  resize: none;
  outline: none;
}

/* status */
.disable {
  pointer-events: none;
  background-color: #ebebeb;
}

/* modal */
.modal {
  z-index: 3;
  padding: 50px 0px;
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.4);
  animation: opac 0.8s;
  letter-spacing: 2px;
  text-align: unset;
}
.modal__container {
  margin: auto;
  position: relative;
  padding: 10px;
  outline: 0;
  max-width: 300px;
}
.modal__header {
  color: #fff;
  background-color: #2B364B;
  padding: 10px;
  text-align: center;
  border-radius: 5px 5px 0px 0px;
}
.modal__body {
  background-color: #fff;
  padding: 20px 50px;
  text-align: center;
}
.modal__body p {
  text-align: left;
  line-height: 24px;
}
.modal__img {
  max-width: 100%;
}
.modal__footer {
  color: #fff;
  background-color: #2B364B;
  height: 8px;
  border-radius: 0px 0px 5px 5px;
}

/* name set */
.userName {
  height: 30px;
  font-size: 16px;
  margin-bottom: 10px;
  border: solid 1px #cbcbcb;
  width: 70%;
  text-align: center;
  display: inline-block;
}
.button {
  font-size: 14px;
  color: #FFFFFF;
  background-color: #2B364B;
  padding: 10px 20px;
  display: inline-block;
  cursor: pointer;
}

/* media */
@media screen and (max-width: 425px) {
  .messageBox__content {
    max-width: 60%;
  }
}
@media screen and (max-width: 385px) {
  .messageBox__content {
    max-width: 50%;
  }
}
</style>
