import Vue from "vue";
import VueRouter from "vue-router";
import DefaultAnim from '../views/DefaultAnim'
import Home from "../views/Home.vue";
import Selected from "../views/Selected.vue";
import Rule from "../views/Rule.vue";
import Poster from "../views/Poster.vue";
Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "DefaultAnim",
    component: DefaultAnim,
  },
  {
    path: "/home",
    name: "Home",
    component: Home,
  },
  {
    path: "/selected",
    name: "Selected",
    component: Selected,
  },
  {
    path: "/rule",
    name: "Rule",
    component: Rule,
  },
  {
    path: "/poster",
    name: "Poster",
    component: Poster,
  },
];

const router = new VueRouter({
  mode: 'history',
  base: '/atmospactivity/',
  routes,
});

export default router;
