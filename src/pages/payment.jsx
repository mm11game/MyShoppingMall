import {
  Block,
  BlockTitle,
  Button,
  Col,
  Icon,
  Link,
  List,
  ListItem,
  Navbar,
  ListInput,
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
import { getToken } from "../common/auth/index.js";
import DaumPostcode from "react-daum-postcode";
import { createAsyncPromise } from "../common/api/api.config";
import {
  cartCount,
  cartItems,
  deliveryPrice,
  itemsState,
  myCoupons,
} from "../components/atom.js";
import * as Yup from "yup";
import { Formik } from "formik";

const Payment = () => {
  const [userInfo, setUserInfo] = useState({});
  const [state, setState] = useRecoilState(itemsState);
  const [myCartItems, setMyCartItems] = useRecoilState(cartItems);
  const [items, setItems] = useState([]);
  const [searchPostToggle, setSearchPostToggle] = useState(false);
  const priceForDelivery = useRecoilValue(deliveryPrice);

  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [myAddress1, setMyAddress1] = useState("");
  const [myAddress2, setMyAddress2] = useState("");
  const [myMileage, setMyMileage] = useState(0);
  const [coupons, setCoupons] = useRecoilState(myCoupons);
  const [couponCost, setCouponCost] = useState(coupons[0]?.cost);
  const [couponId, setCouponId] = useState(coupons[0]?.id);

  useEffect(async () => {
    if (!getToken().token) {
      return;
    }
    let userinfo = await createAsyncPromise("get", "/userinfo")();
    setUserInfo(() => userinfo);
    let itemInfos = await createAsyncPromise("get", "/items/cart")();
    setItems(() => itemInfos.LineItems);
  }, [state]);

  const calculatedPrice =
    items?.reduce((acc, cur) => {
      return acc + cur.total * cur.Option.sale;
    }, 0) + priceForDelivery;

  const handleName = (e) => {
    setName(() => e.target.value);
  };
  const handlePhoneNumber = (e) => {
    setPhoneNumber(() => e.target.value);
  };
  const handleAddress1 = (e) => {
    setMyAddress1(() => e.target.value);
  };
  const handleAddress2 = (e) => {
    setMyAddress2(() => e.target.value);
  };
  const handleSearchPostToggle = () => {
    setSearchPostToggle((old) => !old);
  };

  const handlePayment = async () => {
    let price = items?.reduce((acc, cur) => {
      return acc + cur.total * cur.Option.sale;
    }, 0);
    let body = {
      name,
      mileage: myMileage,
      phone: phoneNumber,
      address1: myAddress1,
      address2: myAddress2,
      infos: myCartItems[0]?.order_id,
      pricetomileage: price * 0.1,
    };
    await createAsyncPromise("patch", "/items/payment")(body);
    setState((e) => e + 1);
    location.replace("/");
  };

  const handleComplete = (data) => {
    let fullAddress = data.address;
    let extraAddress = "";

    if (data.addressType === "R") {
      if (data.bname !== "") {
        extraAddress += data.bname;
      }
      if (data.buildingName !== "") {
        extraAddress +=
          extraAddress !== "" ? `, ${data.buildingName}` : data.buildingName;
      }
      fullAddress += extraAddress !== "" ? ` (${extraAddress})` : "";
    }
    setMyAddress1(fullAddress);
    setSearchPostToggle(false);
    setMyAddress2("");
  };

  const handleSameInfo = () => {
    setName(() => userInfo?.name);
    setPhoneNumber(() => userInfo?.phone);
    setMyAddress1(() => userInfo?.address1);
    setMyAddress2(() => userInfo?.address2);
  };

  const handleMileage = (e) => {
    setMyMileage(() => e.target.value);
  };
  const handleChange = (e) => {
    setCouponCost(e.target.value);
    setCouponId(e.target.id);
  };

  console.log("=============", couponCost, coupons[0].cost);
  return (
    <Page noToolbar>
      <Navbar title="결제" backLink="Back" />

      <BlockTitle className="flex items-center text-lg font-black bg-yellow-200 h-8 p-2">
        <Icon f7="cube_box" size="24px"></Icon> <p className="ml-2">주문상품</p>
      </BlockTitle>
      <Card>
        <CardContent>
          <Row>
            <Col>
              {items[0] && (
                <img
                  slot="media"
                  src={`http://localhost:3000/items/images/${items[0].Option.Item.category}/${items[0].Option.Item.name}`}
                  width="120px"
                />
              )}
            </Col>
            <Col>
              <p className="text-xl font-bold">
                {items[0]?.Option.Item.name}{" "}
                <span className="text-sm "> 외 {items?.length - 1}개</span>
              </p>
              <div className=" text-sm mt-3 float-right">
                배송비 {priceForDelivery.toLocaleString()}￦
              </div>
              <div className="font-bold text-base  float-right">
                <span className="font-bold text-2xl">
                  {(calculatedPrice - myMileage).toLocaleString()}￦
                </span>
              </div>
              <div className="line-through text-base mb-0 float-right text-gray-500">
                {items
                  ?.reduce((acc, cur) => {
                    return acc + cur.total;
                  }, 0)
                  .toLocaleString()}
                ￦
              </div>
            </Col>
          </Row>
        </CardContent>
      </Card>
      <List inlineLabels noHairlinesMd className="px-4 mb-6 mt-1">
        <ListInput
          label="마일리지"
          min="0"
          max={
            calculatedPrice > userInfo.mileage
              ? userInfo.mileage
              : calculatedPrice
          }
          type="number"
          placeholder={userInfo.mileage?.toLocaleString()}
          validate
          errorMessageForce={true}
          onChange={handleMileage}
        ></ListInput>
        <ListInput
          label="쿠폰"
          type="select"
          defaultValue={coupons[0].cost}
          value={coupons[0].cost}
          onChange={handleChange}
        >
          {coupons.map((coupon) => {
            return (
              <option
                name="coupons"
                key={coupon.id}
                value={coupon.cost}
                id={coupon.id}
              >
                {coupon.name} : {coupon.cost}
              </option>
            );
          })}
        </ListInput>
      </List>
      <BlockTitle className="flex items-center text-lg font-black bg-yellow-200 h-8 p-2">
        <Icon material="account_box" size="24px"></Icon>{" "}
        <p className="ml-2">주문자 정보</p>
      </BlockTitle>
      <List className="my-2 px-5 border-t-0">
        <ListItem
          header={<div className="text-xs text-gray-400">이름</div>}
          title={<div className="text-base">{userInfo?.name}</div>}
          className="text-sm"
        ></ListItem>
        <ListItem
          header={<div className="text-xs text-gray-400">전화번호</div>}
          title={<div className="text-base">{userInfo?.phone}</div>}
          className="text-sm"
        ></ListItem>
        <ListItem
          header={<div className="text-xs text-gray-400">주소</div>}
          title={<div className="text-base">{userInfo?.address1}</div>}
          className="text-sm"
        ></ListItem>
        <ListItem
          header={<div className="text-xs text-gray-400">상세주소</div>}
          title={<div className="text-base">{userInfo?.address2}</div>}
          className="text-sm"
        ></ListItem>
      </List>

      <BlockTitle className="flex items-center justify-between text-lg font-black bg-yellow-200 h-8 p-2 mt-8 mb-1">
        <div className="flex flex-row">
          <Icon material="home" size="24px"></Icon>{" "}
          <p className="ml-2">받는분 주소</p>
        </div>
        <div className="flex flex-row">
          <Button
            outline
            onClick={handleSameInfo}
            small
            text="주문자와 동일"
          ></Button>
          <Button
            outline
            className="ml-2"
            onClick={handleSearchPostToggle}
            small
            text="주소찾기"
          ></Button>
        </div>
      </BlockTitle>

      {searchPostToggle && <DaumPostcode onComplete={handleComplete} />}
      <List
        noHairlines
        className="mt-0 px-5 py-0"
        style={{ paddingBottom: "0px", paddingTop: "0px" }}
      >
        <ListInput
          className="text-sm"
          onChange={handleName}
          floatingLabel
          value={name}
          label={<div className="text-sm">이름</div>}
          clearButton
          outline
        ></ListInput>
        <ListInput
          className="text-sm "
          floatingLabel
          clearButton
          label={<div className="text-sm">전화번호</div>}
          value={phoneNumber}
          onChange={handlePhoneNumber}
          outline
        ></ListInput>
        <ListInput
          className="text-sm "
          floatingLabel
          clearButton
          label={<div className="text-sm">주소</div>}
          value={myAddress1}
          onChange={handleAddress1}
          outline
        ></ListInput>
        <ListInput
          className="text-sm"
          label={<div className="text-sm">상세주소</div>}
          value={myAddress2}
          floatingLabel
          clearButton
          onChange={handleAddress2}
          outline
        ></ListInput>
      </List>

      <Button
        onClick={handlePayment}
        large
        className="button button-fill button-large disabled:opacity-50 mx-1 -mt-4"
        href="/payment"
      >
        결제하기
      </Button>
    </Page>
  );
};

export default Payment;
