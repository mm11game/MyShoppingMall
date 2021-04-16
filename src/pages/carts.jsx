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
import axios from "axios";
import { createAsyncPromise } from "../common/api/api.config";
import CartList from "../components/cartlist";
import {
  cartCount,
  cartItems,
  charCountState,
  itemsState,
} from "../components/atom.js";

const Carts = () => {
  const [items, setItems] = useState([]);
  const [checks, setChecks] = useState([]);
  const [state, setState] = useRecoilState(itemsState);
  const [cartNum, setCartNum] = useRecoilState(cartCount);
  const [myCartItems, setMyCartItems] = useRecoilState(cartItems);

  useEffect(async () => {
    if (!localStorage.getItem("practice_token")) {
      return;
    }
    let result = await createAsyncPromise("post", "/items/cartlist")();
    setItems(() => result.LineItems);
    setCartNum(() =>
      result.LineItems === undefined
        ? null
        : result.LineItems.length === 0
        ? null
        : result.LineItems.length
    );
    setMyCartItems(result.LineItems);
  }, [state]);

  const handleAllDelete = async () => {
    let body = {
      lineitemid: checks,
    };
    let result = await createAsyncPromise(
      "post",
      "/items/cartlistdelall"
    )(body);

    setChecks(checks.filter((e) => e !== e));
    setState((prev) => !prev);
  };

  const handleDelete = async (itemId, optionId) => {
    let body = {
      option_id: optionId,
    };
    let result = await createAsyncPromise("post", "/items/cartlistdel")(body);
    setChecks(
      checks.filter((e) => {
        return e !== itemId;
      })
    );
    setState((prev) => !prev);
  };

  const handleChecked = (checked, itemId, optionId) => {
    if (checked) {
      setChecks([...checks, itemId]);
    } else {
      setChecks(
        checks.filter((e) => {
          return e !== itemId;
        })
      );
    }
  };

  const handleAllChecked = (checked) => {
    if (checked) {
      setChecks([...items.map((item) => item.id)]);
    } else {
      setChecks([]);
    }
  };

  const handleQuantityChange = async (itemId, quantity, optionId) => {
    let body = {
      itemId: itemId,
      quantity: quantity,
      option: optionId,
    };
    let result = await createAsyncPromise("post", "/items/cartchange")(body);
    setState((prev) => {
      return !prev;
    });
  };
  // background-color: #ffc604;
  // opacity: 0.8;
  //items-center / content-center
  return (
    <Page>
      <Navbar title="카트" />
      {items && items.length !== 0 ? (
        <>
          <div className="flex mt-3 bg-yellow-300 h-10 items-center">
            <input
              className="ml-2"
              name="check"
              type="checkbox"
              onChange={(e) => {
                handleAllChecked(e.target.checked);
              }}
              checked={
                checks.length === 0 ? false : checks.length === items.length
              }
            ></input>
            <div className="border-2 font-sans text-base ml-2">전체선택</div>
            <Link onClick={handleAllDelete}>
              <Icon f7="trash" size="23px" color="black"></Icon>
            </Link>
          </div>

          <Block>
            {items && (
              <CartList
                items={items}
                handleDelete={handleDelete}
                handleChecked={handleChecked}
                handleQuantityChange={handleQuantityChange}
                checks={checks}
              />
            )}
          </Block>

          <Row>
            <Col>
              {items && (
                <div className="text-base border mb-3 flex justify-center mt-3 bg-yellow-300 h-10 items-center">
                  총
                  {items &&
                    items.reduce((acc, cur) => {
                      return acc + cur.total * cur.Option.sale;
                    }, 0)}
                  원 입니다
                </div>
              )}
            </Col>
          </Row>

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
  );
};

export default Carts;
