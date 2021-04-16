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
import "framework7-icons";
import { getToken } from "../common/auth/index.js";
import { createAsyncPromise } from "../common/api/api.config";
import {
  showToastBottom,
  showToastIcon,
  showToastErr,
} from "../components/toast";
import { cartCount, itemsState } from "../components/atom.js";
import Star from "../components/star.jsx";
import { set } from "lodash";

const ShoppingDetail = (props) => {
  const [detail, setDetail] = useState(null);
  const [likes, setLikes] = useState([]);
  const [optionName, setOptionName] = useState("");
  const [number, setNumber] = useState(1);
  const [state, setState] = useRecoilState(itemsState);
  const [average, setAverage] = useState(0);
  const [myOffset, setMyOffset] = useState(0);
  const [myLimit, setMyLimit] = useState(3);
  const [myReviews, setMyReviews] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:3000/items/detail/${props.id}`).then((res) => {
      setDetail(() => res.data);
      setLikes(() => res.data.Likes);
      setAverage(() => {
        if (res.data.Reviews.length === 0) {
          return 0;
        } else {
          return (
            res.data.Reviews?.reduce((acc, cur) => {
              return acc + cur.star;
            }, 0) / res.data.Reviews.length
          ).toFixed(2);
        }
      });
    });

    // let body = {
    //   limit: 0,
    //   offset: myOffset,
    // };
    // handleReviews(body);
  }, []);

  const handleReviews = async (body) => {
    let result = await createAsyncPromise(
      "post",
      `/items/seeReviews/${props.id}`
    )(body);
    if (body.readable) {
      setMyReviews([...myReviews, ...result]);
    } else {
      setMyReviews(() => result);
    }
  };
  console.log("나의 리뷰는?", myReviews);
  const handleMoreReviews = async () => {
    let body = {
      limit: myLimit,
      offset: myOffset,
      readable: true,
    };
    let newOffset = myOffset + myLimit;
    handleReviews(body);
    setMyOffset(newOffset);
  };

  const changeLike = async () => {
    let props = detail.id;
    let result = await createAsyncPromise(
      "post",
      "http://localhost:3000/items/like"
    )(props);
    setLikes(() => result);
  };
  const handleChange = (e) => {
    setOptionName(() => e.target.value);
  };

  const handleNumber = (e) => {
    setNumber(() => e);
  };
  const handleSubmit = async () => {
    if (!!optionName) {
      showToastIcon("장바구니 등록");
    } else {
      showToastErr("옵션을 골라주세요");
    }

    let body = {
      itemId: detail.id,
      quantity: number,
      option: optionName,
    };
    let result = await createAsyncPromise("post", "items/pushcart")(body);
    await setState((old) => !old);
  };

  return (
    <Page>
      <Navbar title={detail?.name} backLink="back" />
      <Row>
        <Col className="p-5">
          <Card className="flex flex-col content-center shadow-2xl">
            <CardHeader className="text-xl font-medium border-b-2">
              {detail?.name}
            </CardHeader>

            <CardContent className="border-b-2" padding={"50px"}>
              {detail && (
                <img
                  src={`http://localhost:3000/items/images/${detail.name}`}
                  width="100%"
                />
              )}
            </CardContent>

            <CardFooter className="border-b-2 text-left text-base max-h-25 overflow-scroll">
              {detail && (
                <div className="max-h-25 overflow-scroll">
                  {detail.description}
                </div>
              )}
            </CardFooter>
            <CardFooter className="border-b-2">
              <List>
                {detail && (
                  <ListItem
                    title="옵션"
                    smartSelect
                    smartSelectParams={{
                      openIn: "sheet",
                    }}
                  >
                    <select
                      name={detail.name}
                      defaultValue={detail.Options[0].itemoption}
                      onChange={handleChange}
                    >
                      {detail.Options.map((e) => {
                        return (
                          <option value={e.itemoption} key={e.id}>
                            {e.itemoption}
                          </option>
                        );
                      })}
                    </select>
                  </ListItem>
                )}
              </List>
              <Button large fill onClick={handleSubmit}>
                장바구니
              </Button>
            </CardFooter>
            <CardFooter className="border-b-2">
              {!!optionName || "옵션을 골라주세요"}
              {optionName && (
                <div className="text-base">
                  {optionName}:
                  <span className="text-black text-xl">
                    {detail.Options.filter(
                      (e) => e.itemoption === optionName
                    )[0].price * number}
                  </span>
                  <div>
                    {detail.Options.filter(
                      (e) => e.itemoption === optionName
                    )[0].price *
                      detail.Options.filter(
                        (e) => e.itemoption === optionName
                      )[0].sale *
                      number}
                  </div>
                </div>
              )}
              <Row>
                <Col>
                  <small className="display-block"></small>
                  <Stepper onStepperChange={handleNumber} value={number} />
                </Col>
              </Row>
            </CardFooter>
            <CardFooter className="border-b-2">
              <Star average={average} reviewsCount={detail?.Reviews} />
              {getToken().token && (
                <>
                  <Button
                    iconF7={
                      likes?.length === 0 ? "suit heart" : "suit_heart_fill"
                    }
                    onClick={changeLike}
                    iconColor="red"
                  ></Button>
                </>
              )}
            </CardFooter>

            {myReviews?.map((review) => {
              return (
                <CardFooter key={review.id}>
                  <div>{review.title}</div>
                  <div>{review.content}</div>
                  <div>{review.star}</div>
                </CardFooter>
              );
            })}
          </Card>
          <Button onClick={handleMoreReviews}>눌러서 리뷰보기</Button>
        </Col>
      </Row>
    </Page>
  );
};
export default ShoppingDetail;
//pusher === socket // 훅?
