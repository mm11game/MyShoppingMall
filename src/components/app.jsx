import {
  App,
  f7,
  f7ready,
  Link,
  List,
  ListItem,
  Navbar,
  Page,
  PageContent,
  Panel,
  Toolbar,
  View,
  Icon,
  Badge,
  Views,
} from "framework7-react";
import "lodash";
import React, { useState, useEffect } from "react";
import { logout } from "../common/api";
import { getToken } from "../common/auth";
import store from "../common/store";
import { getDevice } from "../js/framework7-custom.js";
import routes from "../js/routes";
import i18n from "../lang/i18n";
import "tailwindcss/tailwind.css";
import {
  RecoilRoot,
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
  RecoilState,
} from "recoil";
import { cartCount, charCountState, itemsState } from "./atom";

global.i18next = i18n;

const MyApp = () => {
  const [count, setCount] = useRecoilState(cartCount);
  const state = useRecoilValue(itemsState);

  let loggedIn = !!getToken().token;
  const handleLogout = async () => {
    await logout();
    location.replace("/");
  };

  const device = getDevice();
  // Framework7 Parameters
  const f7params = {
    name: "Practice", // App name
    theme: "ios", // Automatic theme detection
    id: "com.insomenia.practice", // App bundle ID
    // App store
    store: store,
    // App routes
    routes: routes,
    // Input settings
    view: {
      iosDynamicNavbar: getDevice().ios,
    },
  };

  return (
    <App {...f7params}>
      {/* Left panel with cover effect*/}
      <Panel left cover>
        <Page hideToolbarOnScroll>
          <Navbar title="메뉴" />
          <PageContent>
            <List>
              {loggedIn && (
                <ListItem
                  title="로그아웃"
                  link="#"
                  icon="las la-question"
                  panelClose
                  onClick={handleLogout}
                ></ListItem>
              )}
              {!loggedIn && (
                <ListItem
                  title="로그인"
                  link="/users/sign_in"
                  icon="las la-question"
                  panelClose
                ></ListItem>
              )}
              {!loggedIn && (
                <ListItem
                  title="회원가입"
                  link="/users/sign_up"
                  icon="las la-question"
                  panelClose
                ></ListItem>
              )}
            </List>
          </PageContent>
        </Page>
      </Panel>
      <Views tabs className="safe-areas">
        <Toolbar tabbar labels bottom>
          <Link
            tabLink="#view-home"
            tabLinkActive
            icon="las la-home"
            text="홈"
          />
          <Link tabLink="#view-shopping" icon="las la-gift" text="쇼핑" />
          <Link
            tabLink="#view-mypage"
            icon="las la-address-book"
            text="마이페이지"
          />

          <Link
            tabLink="#view-carts"
            icon="las la-shopping-cart"
            text="장바구니"
            iconBadge={count}
            badgeColor="red"
          />
        </Toolbar>

        <View
          id="view-home"
          main
          tab
          tabActive
          url="/"
          iosDynamicNavbar={false}
        />

        <View id="view-mypage" name="mypage" tab url="/mypage" />
        <View id="view-carts" name="carts" tab url="/carts" />
        <View id="view-sign_up" name="sign_up" tab url="/users/sign_up" />
        <View id="view-sign_in" name="sign_in" tab url="/users/sign_in" />
        <View id="view-shopping" name="shopping" tab url="/shopping" />
      </Views>
    </App>
  );
};
export default MyApp;
