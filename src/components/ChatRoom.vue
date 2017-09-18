<template>
  <div class="container">
    <!-- UserName input -->
    <div class="nameInput">
      UserName :
      <input type="text" id="js-userName" class="userName">
      <button type="button" @click="setName()">Set</button>
    </div>
    <!-- chatRoom -->
    <div class="chatRoom">
      <!-- Head -->
      <div class="roomHead">
        <img src="https://www.w3schools.com/bootstrap/cinqueterre.jpg" class="roomHead__img">
        <div class="roomHead__title">Test Room</div>
      </div>

      <!-- Body -->
      <div id="js-roomBody" class="roomBody">
        <div v-for="item in messages">
          <!-- Other People -->
          <template v-if="item.userName != userName">
            <div class="messageBox">
              <img src="https://www.w3schools.com/bootstrap/cinqueterre.jpg" class="messageBox__img">
              <div class="messageBox_content">
                <div class="messageBox__name">{{item.userName}}</div>
                <div class="messageBox__text">{{item.message}}</div>
              </div>
              <div class="messageBox__time">{{item.timeStamp}}</div>
            </div>
          </template>
          <!-- Self -->
          <template v-if="item.userName == userName">
            <div class="messageBox messageBox--self">
              <div class="messageBox__time messageBox__time--self">{{item.timeStamp}}</div>
              <div class="messageBox_content messageBox_content--self">
                <div class="messageBox__text messageBox__text--self">{{item.message}}</div>
              </div>
            </div>
          </template>
        </div>
      </div>
      <!-- Bottom -->
      <div class="roomBottom">
        <div class="roomBottom__tools"></div>
        <textarea id="js-message" class="roomBottom__input" v-bind:class="{ disable: !userName }" @keyup.enter="sendMessage($event)"></textarea>
      </div>
    </div>
  </div>
</template>


<script>
const msgRef = firebase.database().ref('/messages/');

export default {
  name: 'ChatRoom',
  data() {
    return {
      userName: '',
      messages: []
    }
  },
  methods: {
    setName() {
      const vm = this;
      const userName = document.querySelector('#js-userName').value;
      console.log(userName);
      vm.userName = userName;
    },
    getTime() {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const format = (hours >= 12) ? "下午" : "上午";
      const timeDatas = {
        nowTime: `${format} ${hours}:${minutes}`,
        timeStamp: Math.floor(now / 1000)
      }
      return timeDatas;
    },
    sendMessage(e) {
      if (e.shiftKey) { return; }
      const vm = this;
      const userName = document.querySelector('#js-userName');
      const message = document.querySelector('#js-message');
      const timeDatas = vm.getTime();
      msgRef.child(timeDatas.timeStamp).set({
        userName: userName.value,
        message: message.value,
        timeStamp: timeDatas.nowTime
      })
      message.value = '';
      // 當資料載入完成後再滾到底
      vm.$nextTick(() => {
        const roomBody = document.querySelector('#js-roomBody');
        roomBody.scrollTop = roomBody.scrollHeight;
      })
    }
  },
  mounted() {
    const vm = this;
    msgRef.on('value', function(snapshot) {
      const val = snapshot.val();
      vm.messages = val;
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
* {
  font-family: '微軟正黑體';
  margin: auto;
}

.disable {
  pointer-events: none;
}

.container {
  padding: 50px 0px;
}

.nameInput {
  text-align: center;
}

.userName {
  margin-bottom: 20px;
}

.chatRoom {
  border-radius: 5px;
  max-width: 500px;
  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
}

.roomHead {
  padding-top: 5px;
  width: 100%;
  height: 80px;
  border-radius: 5px 5px 0px 0px;
  background-color: #2B364B;
  position: relative;
}

.roomHead__img {
  width: 50px;
  height: 50px;
  margin: 20px 10px 6px 12px;
  border-radius: 50%;
  position: absolute;
}

.roomHead__title {
  font-size: 13px;
  color: #FFFFFF;
  height: 80px;
  margin: 25px 0px 0px 75px;
  position: absolute;
}

.roomBody {
  padding: 10px 0px;
  background-color: #fff;
  height: 600px;
  overflow-y: auto;
  overflow-x: hidden;
}

.messageBox {
  padding: 5px 10px;
  position: relative;
}

.messageBox__img {
  height: 40px;
  width: 40px;
  border-radius: 50%;
  vertical-align: top;
  display: inline-block;
}

.messageBox_content {
  max-width: 70%;
  display: inline-block;
}

.messageBox__name {
  margin: 5px 0px 5px 5px;
  font-size: 13px;
  color: #727C8A;
  vertical-align: top;
}

.messageBox__text {
  margin: 5px 0px 5px 5px;
  padding: 8px 12px;
  font-size: 12px;
  letter-spacing: 0.6px;
  background-color: #E3E8EB;
  border-radius: 12px;
  line-height: 1.5;
  text-align: left;
  word-break: break-all;
}

.messageBox__time {
  transform: scale(0.7);
  color: #ACB0B8;
  vertical-align: bottom;
  margin: 0px 0px 5px -12px;
  display: inline-block;
}






/* self */

.messageBox--self {
  text-align: right;
}

.messageBox__text--self {
  background-color: #AFF47E;
  margin-right: 25px;
}

.messageBox__time--self {
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
  height: 30px
}

.roomBottom__input {
  margin: 10px 0px 0px 10px;
  width: 95%;
  height: 60px;
  border: none;
  resize: none;
  outline: none;
}

@media screen and (max-width: 425px) {
  .messageBox_content {
    max-width: 60%;
  }
}

@media screen and (max-width: 385px) {
  .messageBox_content {
    max-width: 50%;
  }
}
</style>
