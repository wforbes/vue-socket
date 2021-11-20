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
							<ul
								id="messages"
								v-for="message of messages"
								:key="message.messageId"
							>
								<li>
									{{
										`${message.prefix} ${msgWrap} ${message.content} ${msgWrap}`
									}}
								</li>
							</ul>
							<span id="typingNotification"></span>
							<v-card id="form">
								<input id="input" v-model="chatInput" autocomplete="off" />
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
			messages: []
		};
	},
	sockets: {
		connect() {
			this.isConnected = true;
		},
		disconnect() {
			this.isConnected = false;
		},
		// Fired when the server sends something on the "messageChannel" channel.
		chatMessage(data) {
			this.appendMsg(data);
		}
	},
	methods: {
		signOn() {
			if (this.username === "") return;
			this.$socket.emit("signOn", this.username);
			this.signedOn = true;
		},
		sendMsg() {
			console.log(this.chatInput);
			if (this.chatInput.length > 0) {
				this.$socket.emit("chatMessage", this.chatInput);
				this.messages.push({ prefix: "You say: ", content: this.chatInput });
				this.chatInput = "";
			}
		},
		appendMsg(message) {
			if (!this.signedOn) return;
			this.messages.push(message);
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
}
#messages > li {
	padding: 0.5rem 1rem;
}
#messages > li:nth-child(odd) {
	background: #efefef;
}

#typingNotification {
	position: fixed;
	bottom: 3rem;
	padding-left: 1rem;
}
</style>
