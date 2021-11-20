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
						<v-card class="pa-3 mb-4">
							<h1>Chat Room Demo</h1>
							<p></p>
						</v-card>
					</v-col>
				</v-row>
			</v-container>
		</div>
		<br /><br />
	</div>
</template>
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
</style>

<script>
export default {
	name: "HomePage",
	data() {
		return {
			openPanels: 0
		};
	},
	methods: {
		navigateToDashboard() {
			this.$router.push("dashboard");
		}
	}
};
</script>
