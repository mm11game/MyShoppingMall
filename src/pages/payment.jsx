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
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  Page,
  Row,
} from "framework7-react";
import {
  RecoilRoot,
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
  useResetRecoilState,
} from "recoil";
import React, { useState, useEffect } from "react";
import { createAsyncPromise } from "../common/api/api.config";
import { cartCount, cartItems, itemsState } from "../components/atom.js";
import { showToastBottom, showToastIcon } from "../components/toast";

const Payment = () => {
  const [userInfo, setUserInfo] = useState({});
  const [state, setState] = useRecoilState(itemsState);
  const [myCartItems, setMyCartItems] = useRecoilState(cartItems);
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({
    name: "",
    address: "",
  });
  const { name, address } = form;

  const handleChange = (e) => {
    const nextForm = {
      ...form,
      [e.target.name]: e.target.value,
    };
    setForm(nextForm);
  };

  useEffect(async () => {
    if (!localStorage.getItem("practice_token")) {
      return;
    }
    let userinfo = await createAsyncPromise("get", "/userinfo")();
    setUserInfo(() => userinfo);
    let itemInfos = await createAsyncPromise("post", "/items/cartlist")();
    setItems(() => itemInfos.LineItems);
  }, [state]);

  console.log("페이먼트의 아이템정보", items);
  const handlePayment = async () => {
    if (!localStorage.getItem("practice_token")) {
      return;
    }
    let body = {
      name: form.name,
      address: form.address,
      info: myCartItems,
    };
    let result = await createAsyncPromise("post", "/items/payment")(body);
    setState((old) => !old);
    location.replace("/");
  };

  return (
    <Page>
      <Navbar title={"결제"} backLink="Back" />
      <Card>
        <CardContent>
          <div>이름 : {userInfo?.name}</div>
          <div>전화번호 : {userInfo?.phone}</div>
          <div>주소 : {userInfo?.address}</div>
        </CardContent>
        <CardContent>
          {items[0] && (
            <img
              slot="media"
              src={`http://localhost:3000/items/images/${items[0].Option.Item.name}`}
              width="120px"
            />
          )}
          {items[0]?.Option.Item.name} 외 {items?.length}개 총액
          {items.reduce((acc, cur) => {
            return acc + cur.total;
          }, 0)}
          할인가격은?{" "}
          {items.reduce((acc, cur) => {
            return acc + cur.total * cur.Option.sale;
          }, 0)}
        </CardContent>

        <CardContent>
          <div>
            {" "}
            <input
              name="name"
              placeholder="배송받을사람 이름"
              onChange={handleChange}
              value={name}
            ></input>
          </div>
          <div>
            {" "}
            <input
              name="address"
              placeholder="배송지 주소"
              onChange={handleChange}
              value={address}
            ></input>
          </div>
        </CardContent>
      </Card>

      <Button
        onClick={handlePayment}
        large
        className="button button-fill button-large disabled:opacity-50 mx-1"
        href="/payment"
      >
        결제하기
      </Button>
    </Page>
  );
};

export default Payment;
