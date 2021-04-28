import {
  BlockTitle,
  Col,
  Link,
  List,
  ListItem,
  Navbar,
  Icon,
  Swiper,
  SwiperSlide,
  Page,
  Row,
} from "framework7-react";
import { useRecoilState } from "recoil";
import React, { useState, useEffect } from "react";
import { createAsyncPromise } from "../common/api/api.config";
import { itemsState, myCoupons } from "../components/atom.js";
import { getToken } from "../common/auth/index.js";

import PaymentList from "../components/paymentlist";
import NeedLogin from "./needlogin";

const Mypage = () => {
  const [userinfo, setUserInfo] = useState("");
  const [userLikes, setUserLikes] = useState([]);
  const [orderInfos, setOrderInfos] = useState([]);
  const [coupons, setCoupons] = useRecoilState(myCoupons);
  const [state, setState] = useRecoilState(itemsState);

  useEffect(async () => {
    if (!getToken().token) {
      return;
    }
    let userinfo = await createAsyncPromise("get", "/userinfo")();
    let myLikes = await createAsyncPromise("get", "/items/likes")();
    let payState = await createAsyncPromise("get", "/items/payment")();
    let myCoupons = await createAsyncPromise("get", "/items/coupon")();

    setCoupons(() => myCoupons);
    setUserInfo(() => userinfo);
    setUserLikes(() => myLikes);
    setOrderInfos(() => payState);
  }, [state]);
  return getToken().token ? (
    <Page hideToolbarOnScroll>
      <Navbar title="마이페이지" />
      <List className="mt-0">
        <BlockTitle className="flex items-center text-xl font-bold bg-yellow-200 h-8 p-2">
          <Icon material="account_box" size="24px"></Icon>{" "}
          <p className="ml-1 text-lg">회원정보</p>
        </BlockTitle>
        <List className="my-2 px-5 ">
          <ListItem
            header={<div className="text-xs text-gray-400">이름</div>}
            title={<div className="text-base">{userinfo?.name}</div>}
            className="text-sm "
          ></ListItem>
          <ListItem
            header={<div className="text-xs text-gray-400">이메일</div>}
            title={<div className="text-base">{userinfo?.email}</div>}
            className="text-sm"
          ></ListItem>
          <ListItem
            header={<div className="text-xs text-gray-400">전화번호</div>}
            title={<div className="text-base">{userinfo?.phone}</div>}
            className="text-sm"
          ></ListItem>
          <ListItem
            header={<div className="text-xs text-gray-400">주소</div>}
            title={<div className="text-base">{userinfo?.address1}</div>}
            className="text-sm"
          ></ListItem>
          <ListItem
            header={<div className="text-xs text-gray-400">상세주소</div>}
            title={<div className="text-base">{userinfo?.address2}</div>}
            className="text-sm"
          ></ListItem>
        </List>
        <Row className=" border-yellow-300 border-t-4 p-3">
          <Col>
            <Icon
              material="attach_money"
              size="50px"
              className="float-left ml-5 mt-2"
            ></Icon>{" "}
            <p className="text-lg font-bold mt-2">마일리지</p>
            <div className="text-base">
              {parseInt(userinfo?.mileage).toLocaleString()}￦
            </div>
          </Col>
          <Col>
            <Link href="/coupons">
              <Icon
                f7="ticket"
                size="55px"
                className="float-left mr-4 mt-2"
              ></Icon>
              <div>
                <div className="text-lg font-bold mt-2">쿠폰</div>
                <div className="text-base">{coupons?.length}개</div>
              </div>
            </Link>
          </Col>
        </Row>

        <BlockTitle className="flex items-center text-xl font-bold bg-yellow-200 h-8 px-2 mt-3">
          <Icon f7="suit_heart_fill" color="red" size="24px"></Icon>{" "}
          <p className="ml-1 text-lg">찜 목록</p>
        </BlockTitle>
        <Swiper slidesPerView={3} spaceBetween={10} observer observeParents>
          {userLikes?.map((like) => {
            return (
              <SwiperSlide className="w-full mx-3 border-0 mt-4" key={like.id}>
                <Link href={`/shopping/${like.item_id}`}>
                  <div className="flex flex-col border-black-300 border-2 p-1">
                    <div>
                      <img
                        src={`http://localhost:3000/items/images/${like.Item.category}/${like.Item.name}`}
                        width="100%"
                      ></img>
                    </div>
                    <div className="text-sm mt-1">{like.Item.name}</div>
                  </div>
                </Link>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </List>
      <BlockTitle className="flex items-center text-xl font-bold bg-yellow-200 h-8 p-2 mt-0 transform -translate-y-3">
        <Icon f7="car_fill" size="24px"></Icon>
        <p className="ml-1 text-lg">주문/배송조회</p>
      </BlockTitle>
      <PaymentList orderInfos={orderInfos} />
    </Page>
  ) : (
    <NeedLogin />
  );
};

export default Mypage;
