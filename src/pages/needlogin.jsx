import { Navbar, Page, Button } from "framework7-react";
import React from "react";

const NeedLogin = () => {
  return (
    <Page>
      <Navbar />
      <div className="flex h-full flex-col justify-center items-center text-lg text-gray-500 ">
        로그인이 필요한 서비스입니다.
        <Button fill large href="/users/sign_in" className="mt-3">
          로그인
        </Button>
      </div>
    </Page>
  );
};

export default NeedLogin;
