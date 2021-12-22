import signInRoutes from "./signIn"
import generateAccountRoutes from "./generateAccount"

const landingPageRoutes = [{
  path: "/landing-page",
  component: () => import(/* webpackChunkName */ "@/views/LandingPage/Layout"),
  children: [
    {
      path: "/landing-page",
      name: "landing-page",
      component: () => import(/* webpackChunkName */ "@/views/LandingPage")
    },

    ...generateAccountRoutes,
    ...signInRoutes
  ]
}]

export default landingPageRoutes
