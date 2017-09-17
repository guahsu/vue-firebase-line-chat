<template>
  <div class="container">
    <!-- UserName input -->
    Input Your Name :
    <input type="text" class="username" v-model="userName">
    <button class="js-enterName" type="button" @click="setName()">Enter</button>

    <!-- chatRoom -->
    <div class="chatRoom">
      <!-- Head -->
      <div class="roomHead">
        <img src="https://www.w3schools.com/bootstrap/cinqueterre.jpg" class=" roomHead__img rounded-circle">
        <div class="roomHead__title">Test Room</div>
      </div>

      <!-- Body -->
      <div class="roomBody">
        <!-- otherPeople -->
        <div class="messageBox">
          <img src="https://www.w3schools.com/bootstrap/cinqueterre.jpg" class=" messageBox__img rounded-circle">
        </div>
        <div class="messageBox__name">
          User
        </div>
        <div class="messageBox__text">
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ducimus fugit ullam voluptas quasi, delectus, labore fugiat quidem rerum repellat architecto quam nihil? Temporibus nisi quibusdam necessitatibus porro optio, aperiam ad consequuntur id assumenda fuga, fugit qui enim labore odit beatae veritatis, eveniet placeat dolorum? Assumenda alias aspernatur eveniet veniam minus.
          <div class="messageBox__time">
            下午 9:30
          </div>
        </div>

        <!-- self -->
        <div class="messageBox">
          <div class="messageBox__text--self">
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ducimus fugit ullam voluptas quasi, delectus, labore fugiat quidem rerum repellat architecto quam nihil? Temporibus nisi quibusdam necessitatibus porro optio, aperiam ad consequuntur id assumenda fuga, fugit qui enim labore odit beatae veritatis, eveniet placeat dolorum? Assumenda alias aspernatur eveniet veniam minus.
            <div class="messageBox__time--self">
              下午 9:30
            </div>
          </div>
        </div>

        <!-- Bottom -->
        <div class="roomBottom">
          <div class="roomBottom__tools"></div>
          <textarea class="roomBottom__input"></textarea>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
let msgRef = firebase.database().ref('/messages/');
export default {
  name: 'ChatRoom',
  data() {
    return {
      userName: '',
      messages: [
        {
          userName: 'User',
          message: 'im user'
        },
        {
          userName: 'GuaHsu',
          message: 'im GuaHsu'
        }
      ]
    }
  },
  methods: {
    setName() {
      let vm = this;
      messages = [];
    }
  },
  mounted() {
    let vm = this;
    msgRef.on('value', function(snapshot) {
      var val = snapshot.val();
      vm.messages = val;
    });
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.container {
  padding: 50px;
}

.username {
  margin-bottom: 20px;
}

.chatRoom {
  padding: 5px 0px;
  background: linear-gradient(to bottom, #2B364B 0%, #FFFFFF 100%);
  width: 500px;
  border-radius: 5px;
  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
}

.roomHead {
  width: 100%;
  height: 80px;
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
  background-color: #fff;
  height: 100%;
}

.messageBox {
  padding: 20px 10px;
  display: inline-block;
  position: relative;
}

.messageBox__img {
  height: 40px;
  width: 40px;
  border-radius: 50%;
}

.messageBox__name {
  font-size: 13px;
  color: #727C8A;
  margin: -60px 0px 0px 60px;
}

.messageBox__text {
  max-width: 380px;
  font-size: 12px;
  background-color: #E3E8EB;
  padding: 6px 15px;
  border-radius: 10px;
  margin: 0px 100px 0px 60px;
}

.messageBox__time {
  font-size: 12px;
  color: #ACB0B8;
  text-align: right;
  margin: -10px -75px 0px 0px;
}


/* self */

.messageBox__text--self {
  max-width: 380px;
  font-size: 12px;
  background-color: #AFF47E;
  padding: 6px 15px;
  border-radius: 10px;
  margin: 0px 20px 0px 120px;
}

.messageBox__time--self {
  font-size: 12px;
  color: #ACB0B8;
  margin: -10px 0px 0px -75px;
}


/* Bottom */

.roomBottom {
  bottom: 0px;
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
</style>
