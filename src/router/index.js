import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
	{
		path: "/",
		name: "HomePage",
		component: () =>
			import(/* webpackChunkName: "home" */ "@/home/views/HomePage.vue")
	},
	{
		path: "/about",
		name: "AboutPage",
		component: () =>
			import(/* webpackChunkName: "home" */ "@/home/views/AboutPage.vue")
	},
	{
		path: "/contact",
		name: "ContactPage",
		component: () =>
			import(/* webpackChunkName: "home" */ "@/home/views/ContactPage.vue")
	}
];

const router = new VueRouter({
	mode: "history",
	base: process.env.BASE_URL,
	routes
});

export default router;
