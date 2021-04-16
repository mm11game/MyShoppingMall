import {
  Block,
  BlockTitle,
  Button,
  Col,
  Swiper,
  SwiperSlide,
  Link,
  List,
  ListItem,
  Navbar,
  NavLeft,
  NavRight,
  NavTitle,
  Page,
  Row,
} from "framework7-react";
import React, { useState, useEffect } from "react";
import { createAsyncPromise } from "../common/api/api.config";
import "../css/swiper.css";

const HomePage = () => {
  const images = [
    "airpods",
    "alexa",
    "camera",
    "iphone",
    "mouse",
    "playstation",
  ];
  const [items, setItems] = useState([]);
  useEffect(async () => {
    let result = await createAsyncPromise("get", "/items/homeSale")();
    setItems(() => result);
  }, []);

  return (
    <Page name="home">
      <img src="https://user-images.githubusercontent.com/73922056/114502774-43eb7100-9c67-11eb-9bd8-cdc2c716578a.png"></img>
      <Navbar sliding={false}>
        <NavLeft>
          <Link icon="las la-bars" panelOpen="left" />
        </NavLeft>
        <NavTitle>
          <a className="link" href="/">
            기운`s shop
          </a>
        </NavTitle>
      </Navbar>
      <p className="font-mono text-center mb-5">
        Only Today <span className="text-4xl ">BIG</span> off
      </p>
      <Row>
        <Col>
          <Swiper pagination navigation scrollbar>
            {items &&
              items.map((item) => {
                return (
                  <SwiperSlide key={item.id}>
                    <Link href={`/shopping/${item.id}`}>
                      <img
                        className="h-64 w-full"
                        src={`http://localhost:3000/items/images/${item.name}`}
                      ></img>
                    </Link>
                  </SwiperSlide>
                );
              })}
          </Swiper>
        </Col>
      </Row>
    </Page>
  );
};
export default HomePage;
