<template>
	<div>
		<div class="app-title">
			<v-row>
				<v-col cols="5" align="right">
					<v-img src="../../assets/logo-icon.png" max-width="60" />
				</v-col>
				<v-col cols="7">
					<span class="display-2">Vue-Socket</span>
				</v-col>
			</v-row>
		</div>
		<div class="home">
			<v-container fluid>
				<v-row>
					<v-col>
						<h1>Chat Room Demo</h1>
						<v-card v-if="signedOn" class="pa-3 mb-4" id="chat-room-card">
							<ul id="messages">
								<li
									v-for="message of messages"
									:key="message.messageId"
									:class="message.class"
									:id="'msg-' + message.messageId"
								>
									{{
										`${message.prefix} ${msgWrap} ${message.content} ${msgWrap}`
									}}
								</li>
							</ul>
							<v-card id="form">
								<span id="typingNotification">
									{{ typingNotification }}
								</span>
								<input
									id="input"
									v-model="chatInput"
									@keyup.enter.exact="sendMsg"
									autocomplete="off"
								/>
								<v-btn @click.stop.prevent="sendMsg">Send</v-btn>
							</v-card>
						</v-card>
						<v-card v-else class="pa-3 mb-4" id="sign-on-card">
							<h3>Enter your username to sign on.</h3>
							<v-text-field
								v-model="username"
								placeholder="Username"
							></v-text-field>
							<v-btn @click="signOn">Sign On</v-btn>
						</v-card>
					</v-col>
				</v-row>
			</v-container>
		</div>
		<br /><br />
	</div>
</template>

<script>
export default {
	name: "HomePage",
	data() {
		return {
			signedOn: false,
			username: "",
			msgWrap: "'",
			chatInput: "",
			socketMessage: "",
			messages: [],
			chatWasSent: false,
			isTyping: false,
			typingTimeout: {},
			typingDelay: 1000,
			typers: [],
			typingNotification: "",
			recentlyAppended: false
		};
	},
	sockets: {
		connect() {
			this.isConnected = true;
		},
		disconnect() {
			this.isConnected = false;
		},
		chatMessage(data) {
			this.appendMsg(data, "other");
		},
		otherIsTyping(typer) {
			this.handleOtherTyping(typer);
		}
	},
	watch: {
		chatInput() {
			if (this.chatWasSent) {
				this.chatWasSent = false;
				return;
			}
			if (!this.isTyping) {
				this.isTyping = true;
				this.$socket.emit("typing", true);
				this.typingTimeout = setTimeout(this.typingStopped(), this.typingDelay);
			} else {
				clearTimeout(this.typingTimeout);
				this.typingTimeout = setTimeout(this.typingStopped(), this.typingDelay);
			}
		}
	},
	updated() {
		this.updateMessageScroll();
	},
	methods: {
		signOn() {
			if (this.username === "") return;
			this.$socket.emit("signOn", this.username);
			this.signedOn = true;
		},
		sendMsg() {
			if (this.chatInput.length > 0) {
				this.$socket.emit("chatMessage", this.chatInput, (messageId) => {
					this.appendMsg({
						messageId,
						prefix: "You say: ",
						content: this.chatInput,
						class: ""
					});
					this.chatWasSent = true;
					this.chatInput = "";
				});
			}
		},
		appendMsg(message, source = "") {
			if (!this.signedOn) return;
			this.recentlyAppended = true;
			const messagesCopy = this.messages.slice(0);
			messagesCopy.push({ ...message, class: source });
			this.messages = messagesCopy;
		},
		typingStopped() {
			return () => {
				if (this.isTyping) {
					this.isTyping = false;
					this.$socket.emit("typing", false);
				}
			};
		},
		handleOtherTyping(typer) {
			if (typer.isTyping === true) {
				if (!this.typers.includes(typer.username)) {
					this.typers.push(typer.username);
				}
			} else {
				let typerIndex = this.typers.findIndex((t) => t === typer.username);
				this.typers.splice(typerIndex, 1);
			}

			if (this.typers.length > 0) {
				let typerString = "";
				for (let i = 0; i < this.typers.length; i++) {
					typerString += this.typers[i];

					if (i !== this.typers.length - 1 && this.typers.length > 2) {
						typerString += ", ";
					}
					if (this.typers.length === 2) {
						typerString += " ";
					}
					if (i === this.typers.length - 2) {
						typerString += "and ";
					}
				}
				if (this.typers.length > 1) {
					typerString += " are typing...";
				} else {
					typerString += " is typing...";
				}
				this.typingNotification = typerString;
			} else {
				if (this.typingNotification !== "") {
					this.typingNotification = "";
				}
			}
		},
		elementScrolledToBottom(el) {
			const scrollPos = el.scrollHeight - el.scrollTop;
			const tolerance = 10; // allow for first message that begins scrolling
			return (
				scrollPos === el.clientHeight + 40 ||
				scrollPos < el.clientHeight + tolerance
			);
		},
		elementExists(el) {
			return el !== null;
		},
		elementHasChildren(el) {
			return el.children.length > 0;
		},
		updateMessageScroll() {
			if (this.recentlyAppended) {
				const messageList = this.$el.querySelector("#messages");
				if (
					this.elementExists(messageList) &&
					this.elementHasChildren(messageList)
				) {
					if (this.elementScrolledToBottom(messageList)) {
						messageList.scrollTop = messageList.scrollHeight;
					} else {
						// TODO: Display a 'scroll to bottom' prompt
					}
				}
				this.recentlyAppended = false;
			}
		}
	}
};
</script>

<style>
.v-expansion-panel-header {
	color: white;
}
.panel-expander-icon {
	color: white !important;
}
.panel-inner-content {
	margin: 1em;
}
body {
	margin: 0;
	padding-bottom: 4rem;
	font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica,
		Arial, sans-serif;
}
#chat-room-card {
	height: 70vh;
}
#form {
	background: rgba(0, 0, 0, 0.15);
	padding: 0.25rem;
	position: absolute;
	bottom: 0;
	left: 0;
	right: 0;
	display: flex;
	height: 3rem;
	box-sizing: border-box;
	backdrop-filter: blur(10px);
}
#input {
	border: solid 0.1em black;
	border-top: solid 0.15em black;
	padding: 0 1rem;
	flex-grow: 1;
	border-radius: 2rem;
	margin: 0.25rem;
}
#input:focus {
	outline: none;
}
#form > button {
	background: #333;
	border: none;
	padding: 0 1rem;
	margin: 0.25rem;
	border-radius: 3px;
	outline: none;
	color: #fff;
}

#messages {
	list-style-type: none;
	margin: 0;
	padding: 0;
	padding-bottom: 1em;
	overflow-y: auto;
	max-height: 90%;
}
#messages > li {
	padding: 0.5rem 1rem;
	background: #efefef;
}
#messages > .other {
	background: #fff;
}

#typingNotification {
	position: fixed;
	bottom: 3rem;
	padding-left: 1rem;
}
</style>
