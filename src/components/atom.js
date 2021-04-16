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
  default: true, // default value (aka initial value)
});

export const cartCount = atom({
  key: "cartCount", // unique ID (with respect to other atoms/selectors)
  default: null, // default value (aka initial value)
});

export const cartItems = atom({
  key: "cartItems",
  default: [],
});
