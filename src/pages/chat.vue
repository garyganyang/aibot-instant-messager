<template>
  <view style="height: 100%;">
		<view class="topNav">
			<view class="nav-left" @tap="goBack()">
				<uni-icons type="left" size="24" class="icon" color="#000000"></uni-icons>
				<text>{{chatInfo.name}}</text>
			</view>
			<view @tap="clearContent">
				<text class="nav-right lines-green">清空对话</text>
			</view>
		</view>
    <!-- <cu-custom bgColor="bg-gradual-pink" :isBack="true"><block slot="backText">返回</block><block slot="content">聊天</block></cu-custom> -->
    <scroll-view class="scroll-view" :style="calcHeight" :scroll-y="true" :scroll-top="scrollTop"
                 :scroll-with-animation="true">
      <!-- :style="{height:scrollViewHeight+'px'}" -->
      <view id="scroll-view-content">
        <view class="cu-chat">
          <view v-for="(eachChat, chatIndex) in chat" :key="eachChat.id" class="cu-item" :class="eachChat.role">
            <view v-if="eachChat.role === 'assistant'" class="cu-avatar radius"
                  style="background-image:url(/ai-modeling/static/jiajie.png);background-color: transparent;"></view>
            <view class="main" style="flex-direction: column;">
              <view class="content shadow" :class="eachChat.role==='user'?'bg-green':''" style="padding: 0 !important;">
								<zero-markdown-view :markdown="eachChat.content" themeColor="black" style="padding: 0 5px !important;"></zero-markdown-view>
              </view>
							<view v-if="eachChat.role === 'assistant' && chatIndex === chat.length - 1 && eachChat.followUp" class="follow-up-view">
								<view v-for="(followUpItem) in eachChat.followUp"
								 :key="followUpItem.id"
								 class="follow-up-view-item pointer"
								 @tap.stop="message=followUpItem.content">
									<text class="follow-content">{{ followUpItem.content }}</text>
									<view class="follow-content-icon cuIcon-right"></view>
								</view>
							</view>
            </view>
            <view v-if="eachChat.role === 'user'" class="cu-avatar radius">
              <text class="cuIcon-people"></text>
            </view>
            <view class="date">{{ moment(eachChat.time).format("HH:mm") }}</view>
          </view>
          <view v-if="loading" class="cu-info">
            <!-- <text class="cu-load loading"></text> -->
            <text class="cu-load cuIcon-loading1 loading text-white"></text>
          </view>
          <view v-if="false" class="cu-item">
            <view class="cu-avatar radius" style="background-image:url(/chatgpt-im/static/icon-gpt.jpg);"></view>
            <view class="main">
              <view class="content shadow">
                <text>喵喵喵！喵喵喵！</text>
              </view>
            </view>
            <view class="date "> 13:23</view>
          </view>
        </view>
      </view>
    </scroll-view>

    <view class="cu-bar foot input" :style="[{bottom:InputBottom+'px'}]">
      <!-- <view class="action"> -->
      <!-- <text class="cuIcon-sound text-grey"></text> -->
      <!-- </view> -->
      <input type="text" v-model="message" class="solid-bottom" :adjust-position="false" :focus="false" maxlength="300"
             cursor-spacing="10" style="word-break: break-all;white-space: normal;" @focus="InputFocus" @blur="InputBlur" @confirm="confirm"></input>
      <!-- <view class="action"> -->
      <!-- <text class="cuIcon-emojifill text-grey"></text> -->
      <!-- </view> -->
      <button class="cu-btn shadow bg-green" @click="sendMessageCozeAI">发送</button>
    </view>
  </view>
</template>

<script>
import apiService from '@/services/api.js'
import * as moment from 'dayjs'
import MoveBtn from '@/components/move-btn.vue'
import {
  v4 as uuidv4
} from 'uuid';
import {ACCESS_TOKEN} from "../services/constant";

export default {
	components: { MoveBtn },
  data() {
    return {
      moment,
      message: '',
      conversationId: '',
      parentMessageId: '',
      InputBottom: 0,
      chat: [],
      scrollTop: 0, //滚动条位置
      scrollViewHeight: 300, //滚动视图的高度
      loading: false,
      user_id: '',
      conversation_id: '',
			chatInfo: {}
    };
  },
	computed: {
		calcHeight() {
			const InputBottom = this.InputBottom + 70 +'px'
			return { height: `calc(100% - ${InputBottom})`}
		},
	},
	onLoad(options) {
		this.chatInfo = uni.getStorageSync('chat-info')
	},
  mounted() {
    this.user_id = uni.getStorageSync("coze_USER_ID") || "7383871904441958439"
    this.conversation_id = uni.getStorageSync("coze_CONVERSATION_ID") || ''

    if (!this.conversation_id) {
      this.chat.push({
        id: uuidv4(),
        content: this.chatInfo.preMessage,
        role: "assistant",
        time: new Date(),
				followUp: [],
      })
    }
		if(uni.getStorageSync("coze_CHAT_HISTORY") && JSON.parse(uni.getStorageSync("coze_CHAT_HISTORY"))[this.chatInfo.botId]) {
			this.chat = JSON.parse(uni.getStorageSync("coze_CHAT_HISTORY"))[this.chatInfo.botId]
			this.scrollToBottom()
		}

    // uni.showLoading({
    //   title: 'ChatGPT初始化中'
    // })
    // apiService.initChatGPT().then(res => {
    //   apiService.sendMessage({
    //     message: "你好,请介绍一下你自己"
    //   }).then(res => {
    //     this.chat.push({
    //       source: "gpt",
    //       time: new Date(),
    //       ...res.data.result
    //     })
    //   }).finally(e => {
    //     uni.hideLoading()
    //   })
    // })
  },
  onHide() {
		this.storeData()
	},
	methods: {
		clearContent() {
			console.log('---clear')
			const that = this
			uni.showModal({
					title: '提示',
					content: '确认清空历史消息？',
					success: function (res) {
						if (res.confirm) {
							that.chat = []
							let newStorage = {}
							if(uni.getStorageSync("coze_CHAT_HISTORY")) {
								newStorage = JSON.parse(uni.getStorageSync("coze_CHAT_HISTORY")) || {}
							}
							newStorage[that.chatInfo.botId] = that.chat
							uni.setStorageSync('coze_CHAT_HISTORY', JSON.stringify(newStorage))
						} else if (res.cancel) {
							 return
						}
					}
			})
		},
		newConversation(additionalMessages) {
      return {
        conversation_id: this.conversation_id,
        bot_id: this.chatInfo.botId,
        user_id: this.user_id,
        stream: true,
        additional_messages: [additionalMessages]
      }
    },
    newMessages(content, content_type) {
      return {
        role: "user",
        content,
        content_type: content_type || "text"
      }
    },
    InputFocus(e) {
      this.InputBottom = e.detail.height
    },
    InputBlur(e) {
      this.InputBottom = 0
    },
    confirm(event,a,b) {
      console.log('键被按下', event, a, b);
      this.sendMessageCozeAI()
    },
    sendMessageCozeAI() {
      if (!this.message.trim()) return
      this.chat.push({
        id: uuidv4(),
        content: this.message.trim(),
        role: "user",
        time: new Date(),
        conversation_id: this.conversation_id
        // conversationId: this.chat[this.chat.length - 1].conversationId,
        // parentMessageId: this.chat[this.chat.length - 1].id
      })
      this.cozeAIForm = this.newConversation(this.newMessages(this.message.trim()))
      this.message = ""
      this.scrollToBottom()
      this.loading = true

      apiService.sendMessageToCoze(this.cozeAIForm, this.handleMessage, this.handleError, this.handleOpen)
    },

    handleMessage(event) {
      // console.log("Received message:");
      // console.log(event.event);
      const message = JSON.parse(event.data)
      if (!this.conversation_id) this.conversation_id = message.conversation_id
			// conversation.chat.completed
			if (event.event === 'conversation.message.delta' && message.type === 'answer') {
				this.loading = false
				const theOne = this.chat.find(e => e.id === message.id)
				if (!theOne) {
					this.chat.push({
						id: uuidv4(),
            time: new Date(),
						conversation_id: this.conversation_id,
						...message,
						followUp: []
						// conversationId: this.chat[this.chat.length - 1].conversationId,
						// parentMessageId: this.chat[this.chat.length - 1].id
					})
					return
				}
				if(message.content_type === 'text') {
					theOne.content = theOne.content + message.content
				} else if (message.content_type === 'card') {
					theOne.content = theOne.content + message.content
				}
				// 在这里处理接收到的数据
			} else if (event.event === 'conversation.message.completed' && message.type === 'follow_up') {
				console.log(message)
				const theOne = this.chat.find(e => e.chat_id === message.chat_id)
				console.log(this.chat)
				if (theOne) {
					theOne.followUp.push(message)
					return
				}
			} else if (event.event === 'conversation.message.completed' && message.type === 'verbose') {
				// console.log(message)
				// const theOne = this.chat.find(e => e.chat_id === message.chat_id)
				// console.log(this.chat)
				// if (theOne) {
				// 	theOne.followUp.push(message)
				// 	return
				// }
			}
			this.scrollToBottom()
    },
    handleError(error) {
      console.error("SSE Error:", error);
			this.loading = false
    },
    handleOpen() {
      console.log("Connection to server opened.");
    },

    sendMessageToOpenAI() {
      if (!this.message.trim()) return
      this.chat.push({
        id: uuidv4(),
        text: this.message.trim(),
        source: "self",
        time: new Date(),
        conversationId: this.chat[this.chat.length - 1].conversationId,
        parentMessageId: this.chat[this.chat.length - 1].id
      })
      // const message = this.message
      this.cozeAIForm.query = this.message
      this.message = ""
      this.scrollToBottom()
      this.loading = true
      apiService.sendMessageToCoze(this.cozeAIForm).then(res => {
        if (res.data.message.type === 'answer') {
          const newMessage = {
            source: "coze",
            time: new Date(),
            text: res.data.message.content
          }
          this.chat.push(newMessage)
        }
        this.scrollToBottom()
      }).finally(e => {
        this.loading = false
      })

      // apiService.sendMessage({
      //   message,
      //   conversationId: this.chat[this.chat.length - 2].conversationId,
      //   parentMessageId: this.chat[this.chat.length - 2].id
      // }).then(res => {
      //   this.chat.push({
      //     source: "gpt",
      //     time: new Date(),
      //     ...res.data.result
      //   })
      //   console.log(this.chat)
      //   this.scrollToBottom()
      // }).finally(e => {
      //   this.loading = false
      // })
    },
		storeData() {
			let newStorage = {}
			if(uni.getStorageSync("coze_CHAT_HISTORY")) {
				newStorage = JSON.parse(uni.getStorageSync("coze_CHAT_HISTORY")) || {}
			}
			newStorage[this.chatInfo.botId] = this.chat
			uni.setStorageSync('coze_CHAT_HISTORY', JSON.stringify(newStorage))
		},
		goBack() {
			this.storeData()
			uni.navigateBack({
				delta: 1,
			})
		},
    scrollToBottom() {
      this.$nextTick(() => {
        uni.createSelectorQuery().in(this).select('#scroll-view-content').boundingClientRect((res) => {
          let top = res.height - this.scrollViewHeight;
          if (top > 0 && this.scrollTop < top) {
            this.scrollTop = top;
          }
        }).exec()
      })
    }
  }
}
</script>

<style>
page {
  padding-bottom: 100 upx;
  height: 100%;
}

.follow-up-view {
	font-size: 24upx;
	width: 100%;
	margin-top: 10rpx;
}

.follow-up-view .follow-up-view-item {
	padding: 16upx;
	width: 100%;
	overflow: hidden;
	line-height: 28upx;
	border: 2rpx #e4e7e7 solid;
	border-radius: 6rpx;
	background-color: #ffffff;
	display: flex;
}
.follow-up-view .follow-up-view-item .follow-content {
	width: calc(100% - 12rpx);
  display: block;
	overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.follow-up-view .follow-up-view-item .follow-content-icon {
  display: inline-block;
}

.cu-load.loading::after {
  content: "思考中...";
}

.topNav {
	display: flex;
	align-items: center;
	padding: 24rpx 4rpx;
	font-size: 34rpx;
	line-height: 36rpx;
	justify-content: space-between;
	background-color: #fff;
}
.nav-left {
	display: flex;
	align-items: center;
}
.nav-right {
	/* color: #475cff; */
	font-size: 30rpx;
	line-height: 36rpx;
	margin-right: 24rpx;
}
</style>
