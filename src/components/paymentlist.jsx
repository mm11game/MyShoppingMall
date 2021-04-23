import {
  Button,
  List,
  ListItem,
  Card,
  CardFooter,
  CardHeader,
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
import yearDayDate from "../js/utils/yearDayDate";
import { createAsyncPromise } from "../common/api/api.config";
import {
  deliveryPrice,
  itemsState,
  LineItemLength,
  orderIdForReview,
} from "./atom";

const PaymentList = ({ orderInfos }) => {
  const [state, setState] = useRecoilState(itemsState);
  const [orderId, setOrderId] = useRecoilState(orderIdForReview);
  const priceForDelivery = useRecoilValue(deliveryPrice);

  const handleDelivery = async (orderId) => {
    let body = {
      myOrderId: orderId,
    };
    await createAsyncPromise("patch", "/items/delivery")(body);
    setState((e) => e + 1);
  };
  const TossToOrderId = async (orderId) => {
    await setOrderId(() => orderId);
  };

  return orderInfos.map((orderInfo) => {
    return (
      <Card className="mt-1 border-yellow-200 border-2" key={orderInfo.id}>
        <CardHeader className="bg-yellow-100 py-0.5 text-sm">
          <div>
            {orderInfo.LineItems[0] &&
              yearDayDate(orderInfo.LineItems[0].updatedAt)}
          </div>
          <div>{<div className="text-sm">{`주문상세 >`}</div>}</div>
        </CardHeader>
        <List mediaList key={orderInfo.id}>
          <ListItem
            title={
              <div className="flex items-center mb-1">
                {orderInfo.LineItems.length === 1
                  ? `${orderInfo.LineItems[0]?.Option.Item.name}`
                  : `${orderInfo.LineItems[0]?.Option.Item.name} 외 ${
                      orderInfo.LineItems?.length - 1
                    }개 `}
              </div>
            }
            subtitle={
              <div className="text-sm text-gray-500">
                {orderInfo.LineItems[0]?.Option.itemoption}
              </div>
            }
            text={
              <div className="text-base text-black mt-1">
                {(
                  orderInfo.LineItems?.reduce((acc, cur) => {
                    return acc + cur.total * cur.Option.sale;
                  }, 0) + priceForDelivery
                ).toLocaleString()}
                ￦{" "}
                <span className="text-sm text-black">{`${orderInfo.LineItems[0].quantity}개`}</span>
              </div>
            }
          >
            {orderInfo.LineItems[0] && (
              <img
                slot="media"
                width="80"
                src={`http://localhost:3000/items/images/${orderInfo.LineItems[0].Option.Item.category}/${orderInfo.LineItems[0].Option.Item.name}`}
              />
            )}
          </ListItem>
          <CardFooter className="bg-yellow-50 h-7">
            {orderInfo.state === "pay" ? (
              <>
                <div className="text-red-400 font-bold text-base ml-4">
                  배송중
                </div>
                <Button
                  color="red"
                  small
                  fill
                  outline
                  className="text-white-500"
                  onClick={() => {
                    handleDelivery(orderInfo.id);
                  }}
                >
                  수령확인
                </Button>
              </>
            ) : (
              <>
                <div className="text-gray-500 text-sm ml-3">배송완료</div>
                {orderInfo.LineItems.every((e) => e.reviewState === true) ? (
                  <div className="text-gray-500  text-sm  mr-3">리뷰완료</div>
                ) : (
                  <>
                    <Button
                      text="리뷰하기"
                      color="yellow"
                      small
                      fill
                      outline
                      onClick={() => TossToOrderId(orderInfo.id)}
                      href="/review"
                    ></Button>
                  </>
                )}
              </>
            )}
          </CardFooter>
        </List>
      </Card>
    );
  });
};

export default PaymentList;
