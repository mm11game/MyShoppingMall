import {
  Block,
  BlockTitle,
  Button,
  Col,
  Link,
  List,
  ListItem,
  Navbar,
  NavLeft,
  NavRight,
  NavTitle,
  Page,
  Card,
  Accordion,
  AccordionContent,
  Icon,
  Row,
  CardHeader,
  CardFooter,
  Stepper,
  CardContent,
  f7,
} from "framework7-react";
import {
  RecoilRoot,
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
} from "recoil";

import React, { useState, useEffect } from "react";
import { createAsyncPromise } from "../common/api/api.config";
import { getToken } from "../common/auth/index.js";
import CartList from "../components/cartlist";
import {
  cartCount,
  cartItems,
  charCountState,
  deliveryPrice,
  itemsState,
} from "../components/atom.js";
import NeedLogin from "./needlogin";

const Carts = () => {
  const [items, setItems] = useState([]);
  const [checks, setChecks] = useState([]);
  const [state, setState] = useRecoilState(itemsState);
  const [cartNum, setCartNum] = useRecoilState(cartCount);
  const [myCartItems, setMyCartItems] = useRecoilState(cartItems);
  const priceForDelivery = useRecoilValue(deliveryPrice);

  useEffect(async () => {
    if (!getToken().token) {
      return;
    }
    let result = await createAsyncPromise("get", "/items/cart")();
    setItems(() => result.LineItems);
    setCartNum(() =>
      result.LineItems === undefined
        ? null
        : result.LineItems.length === 0
        ? null
        : result.LineItems.length
    );
    setMyCartItems(result.LineItems);

    let allCartItemsId = [];
    result.LineItems?.forEach((e) => allCartItemsId.push(e.id));
    setChecks(() => allCartItemsId);
  }, [state]);

  const handleAllDelete = async () => {
    await createAsyncPromise("delete", `/items/carts/${checks}`)();
    setState((e) => e + 1);
  };

  const handleDelete = async (itemId, optionId) => {
    await createAsyncPromise("delete", `/items/cart/${optionId}`)();
    setState((e) => e + 1);
  };

  const handleQuantityChange = async (itemId, quantity, optionId) => {
    let body = {
      itemId: itemId,
      quantity: quantity,
      option: optionId,
    };
    await createAsyncPromise("patch", "/items/cart")(body);
    setState((prev) => {
      return !prev;
    });
  };

  return getToken().token ? (
    <Page hideToolbarOnScroll>
      <Navbar title="카트" />
      {items && items.length !== 0 ? (
        <>
          <div className="flex mt-3 bg-yellow-200 h-8 items-center">
            <div className="float-right w-full mr-5">
              <Link onClick={handleAllDelete} className="float-right">
                <Icon f7="trash" size="23px" color="black"></Icon>
                <span>전체삭제</span>
              </Link>
            </div>
          </div>

          <Block>
            {items && (
              <CartList
                items={items}
                handleDelete={handleDelete}
                handleQuantityChange={handleQuantityChange}
              />
            )}
          </Block>
          <div className="text-base sborder flex justify-center mt-3 bg-yellow-100 h-8 items-center font-bold">
            배송비 : {priceForDelivery.toLocaleString()}￦
          </div>

          {items && (
            <div className="text-base border mb-3 my-0 flex justify-center bg-yellow-200 h-8 items-end font-bold align-bottom">
              <span className="mr-2 text-lg">총</span>
              <span className="text-2xl">
                {items &&
                  (
                    items.reduce((acc, cur) => {
                      return acc + cur.total * cur.Option.sale;
                    }, 0) + priceForDelivery
                  ).toLocaleString()}
              </span>
              <span className="text-xl">￦</span>
            </div>
          )}

          <Button
            className="button button-fill button-large disabled:opacity-50 mx-1"
            large
            href="/payment"
          >
            주문하기
          </Button>
        </>
      ) : (
        <div className="h-full flex justify-center">
          <img src="https://user-images.githubusercontent.com/73922056/114814603-70ca9000-9def-11eb-9dda-200dd424961c.png"></img>
        </div>
      )}
    </Page>
  ) : (
    <NeedLogin />
  );
};

export default Carts;
