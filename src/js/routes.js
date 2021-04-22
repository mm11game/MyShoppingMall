import HomePage from "../pages/home.jsx";
import IntroPage from "../pages/intro.jsx";
import NotFoundPage from "../pages/404.jsx";
import LoginPage from "../pages/users/sessions/new.jsx";
import SignUpPage from "../pages/users/registrations/new.jsx";
import Shopping from "../pages/shopping.jsx";
import ShoppingDetail from "../pages/shoppingdetail.jsx";
import Carts from "../pages/carts.jsx";
import Payment from "../pages/payment.jsx";
import Review from "../pages/review.jsx";
import Mypage from "../pages/mypage.jsx";
import NeedLogin from "../pages/needlogin.jsx";

const routes = [
  { path: "/", component: HomePage },
  { path: "/users/sign_in", component: LoginPage },
  { path: "/users/sign_up", component: SignUpPage },
  { path: "/intro", component: IntroPage },
  { path: "/shopping", component: Shopping },
  { path: "/shopping/:id", component: ShoppingDetail },

  { path: "/carts", component: Carts },
  { path: "/payment", component: Payment },
  { path: "/review", component: Review },
  { path: "/mypage", component: Mypage },
  // { path: "/needtologin", component: NeedLogin },

  { path: "(.*)", component: NotFoundPage },
];

export default routes;
