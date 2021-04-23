import { List, Navbar, Page } from "framework7-react";
import React from "react";
import { useRecoilState, useResetRecoilState } from "recoil";
import { myCoupons } from "../components/atom";

const Coupons = () => {
  const [coupons, setCoupons] = useRecoilState(myCoupons);

  return (
    <Page>
      <Navbar backLink="back" />
      <div>누구누구의 쿠폰</div>
      <List>
        {coupons.map((coupon) => {
          return (
            <div>
              <div>{coupon.name}</div>
              <div>{coupon.cost}</div>
            </div>
          );
        })}
      </List>
    </Page>
  );
};

export default Coupons;
