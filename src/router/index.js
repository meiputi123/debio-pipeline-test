import Vue from "vue"
import VueRouter from "vue-router"
import indexRoutes from "./routes"
import landingPageRoutes from "./routes/landing-page"


Vue.use(VueRouter)

const routes = [
  ...indexRoutes,
  ...landingPageRoutes,
  {
    path: "*",
    component: () => import(/* webpackChunkName */ "@/views/404")
  }
]

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
  scrollBehavior() {
    return { x: 0, y: 0 }
  }
})

export default router

