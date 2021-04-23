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
import { itemsState, myProducts } from "../components/atom";
import Product from "../components/product";

const Shopping = () => {
  const [products, setProducts] = useRecoilState(myProducts);
  const [filteredProducts, setFilterProducts] = useState([]);
  const [clickedButton, setClickedButton] = useState("All");
  const [state, setState] = useRecoilState(itemsState);

  useEffect(async () => {
    let result = await createAsyncPromise("get", "/items/lists")();
    setProducts(result);
    setFilterProducts(result);
  }, []);

  const showSortedItems = (categoryName) => {
    if (categoryName) {
      setFilterProducts(
        [...products].filter((el) => el.category === categoryName)
      );
      setState((e) => e + 1);
    } else {
      setFilterProducts([...products]);
      setClickedButton("All");
      setState((e) => e + 1);
      return;
    }
    setClickedButton(() => categoryName);
    setState((e) => e + 1);
    return;
  };

  return (
    <Page hideToolbarOnScroll>
      <Navbar title="상품 목록" backLinkUrl="/" />
      <Row className="w-full bg-grey mt-1 px-2">
        <Col width="20">
          <Button
            raised
            fill={clickedButton === "All"}
            onClick={() => showSortedItems()}
          >
            All
          </Button>
        </Col>
        <Col width="33">
          <Button
            className="w-full text-red"
            raised
            fill={clickedButton === "electronic"}
            onClick={(e) => showSortedItems(e.target.textContent)}
          >
            electronic
          </Button>
        </Col>
        <Col width="33">
          <Button
            raised
            fill={clickedButton === "furniture"}
            onClick={(e) => showSortedItems(e.target.textContent)}
          >
            furniture
          </Button>
        </Col>
        <Col width="25">
          <Button
            raised
            fill={clickedButton === "food"}
            onClick={(e) => showSortedItems(e.target.textContent)}
          >
            food
          </Button>
        </Col>
      </Row>
      <Row className="flex flex-wrap  justify-center grid grid-cols-2 px-1 md:grid-cols-5">
        {filteredProducts.map((product) => {
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
