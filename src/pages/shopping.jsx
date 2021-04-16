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
  Row,
} from "framework7-react";
import React, { useState, useEffect } from "react";
import axios from "axios";

import Product from "../components/product";
import { height } from "dom7";

const Shopping = () => {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    axios.get("http://localhost:3000/items/list").then((res) => {
      setProducts(res.data);
    });
  }, []);
  //이 부분에서 할인율이 1이면 걍 냅두고
  // 할인율이 1보다 작으면 그걸 곱해줘서 보여준다
  return (
    <Page>
      <Navbar title="상품 목록" backLinkUrl="/" />
      <Row className="flex flex-wrap justify-center grid grid-cols-2">
        {products.map((product) => {
          return (
            <Block key={product.id} className="h-72">
              <Col>
                <List style={{ width: "100%" }}>
                  {products && <Product product={product} key={product.id} />}
                </List>
              </Col>
            </Block>
          );
        })}
      </Row>
    </Page>
  );
};

export default Shopping;
