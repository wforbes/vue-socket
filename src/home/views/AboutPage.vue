<template>
	<div>
		<v-container fluid>
			<v-row>
				<v-col>
					<h1>About Vue-Socket</h1>
					<p>
						<span style="font-size: 0.7em">
							last updated 11/20/2021 by
							<a href="https://wforbes.net" target="_blank">Will Forbes</a>
						</span>
					</p>
				</v-col>
			</v-row>
			<v-row>
				<v-col>
					<v-card class="pa-3 mb-4">
						<p>
							Vue-Socket is a small project I'm working on so that I can learn
							how to use WebSockets. I'm a Vue.js developer so it only made
							sense to use Vue as the frontend of the app. On the backend, a
							Node.js server is using Express and Socket.io.
						</p>
					</v-card>
				</v-col>
			</v-row>
		</v-container>
	</div>
</template>

<script>
export default {
	name: "AboutPage",
	data() {
		return {};
	}
};
</script>
