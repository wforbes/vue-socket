import Vue from "vue";
import App from "./app/views/App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";

import SocketIO from "socket.io-client";
import VueSocketIO from "vue-socket.io";

Vue.use(
	new VueSocketIO({
		debug: true,
		connection: SocketIO("localhost:3000/", {
			withCredentials: true
		}),
		vuex: {
			store,
			actionPrefix: "SOCKET_",
			mutationPrefix: "SOCKET_"
		}
	})
);

Vue.config.productionTip = false;

new Vue({
	router,
	store,
	vuetify,
	render: (h) => h(App)
}).$mount("#app");
