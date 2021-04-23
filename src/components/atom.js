import React from "react";
import {
  RecoilRoot,
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
} from "recoil";

export const itemsState = atom({
  key: "itemsState", // unique ID (with respect to other atoms/selectors)
  default: 0,
});

export const cartCount = atom({
  key: "cartCount", // unique ID (with respect to other atoms/selectors)
  default: null, // default value (aka initial value)
});

export const cartItems = atom({
  key: "cartItems",
  default: [],
});

export const myProducts = atom({
  key: "myProducts",
  default: [], //만약 최근 넣은 정보를 새로고침을 하게 되면 전부 날라간다? 그래서 로컬스토리지에 넣어줘야하나?
});

export const starAverage = atom({
  key: "starAverage",
  default: 0,
});

export const orderIdForReview = atom({
  key: "orderIdForReview",
  default: null,
});
export const deliveryPrice = atom({
  key: "deliveryPrice",
  default: 2500,
});

export const myCoupons = atom({
  key: "myCoupons",
  default: [],
});
