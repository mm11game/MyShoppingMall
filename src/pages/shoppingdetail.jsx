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
import "framework7-icons";
import { getToken } from "../common/auth/index.js";
import {
  showToastBottom,
  showToastIcon,
  showToastErr,
} from "../components/toast";
import {
  cartCount,
  deliveryPrice,
  itemsState,
  starAverage,
} from "../components/atom.js";
import Star from "../components/star.jsx";
import { createAsyncPromise } from "../common/api/api.config";
import StarForReviews from "../components/starforreviews.jsx";

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

  useEffect(async () => {
    let result = await createAsyncPromise("get", `/items/lists/${props.id}`)();
    setDetail(() => result);
    setLikes(() => result.Likes);
    setAverage(() => {
      if (result.Reviews && result.Reviews.length === 0) {
        return 0;
      } else {
        return (
          result.Reviews?.reduce((acc, cur) => {
            return acc + cur.star;
          }, 0) / (result.Reviews && result.Reviews.length)
        ).toFixed(2);
      }
    });
    setOptionName(() => result.Options[0].itemoption);
  }, [state]);

  const handleReviews = async (body) => {
    let result = await createAsyncPromise(
      "post",
      `/items/see_reviews/${props.id}`
    )(body);
    if (body.readable) {
      setMyReviews([...myReviews, ...result]);
    } else {
      setMyReviews(() => result);
    }
  };

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
      "http://localhost:3000/items/likes"
    )(props);

    setLikes(() => result);
    setState((e) => e + 1);
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
    let result = await createAsyncPromise("post", "items/cart")(body);
    setState((e) => e + 1);
  };
  const waringForLogin = () => {
    f7.dialog.alert("", "로그인이 필요합니다!");
  };

  return (
    <Page noToolbar>
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
                  src={`http://localhost:3000/items/images/${detail.category}/${detail.name}`}
                  width="100%"
                />
              )}
            </CardContent>
            <CardFooter className="border-b-2 text-gray-500 text-left text-base max-h-25 overflow-scroll">
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
                    title={<div className="text-gray-500 font-sm">옵션 : </div>}
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
              <Button
                large
                fill
                className="bg-gray-800"
                onClick={!!getToken().token ? handleSubmit : waringForLogin}
              >
                장바구니
              </Button>
            </CardFooter>
            <CardFooter className="border-b-2">
              {optionName && (
                <div className="text-gray-500">
                  {!!(detail.Options[0]?.sale !== 1) && (
                    <>
                      <div className="line-through mr-2 text-grey-500">
                        {(
                          detail.Options.filter(
                            (e) => e.itemoption === optionName
                          )[0].price * number
                        ).toLocaleString()}
                        ￦
                      </div>
                    </>
                  )}
                  <div className="flex flex-row justify-between items-center">
                    <div className="text-black text-xl">
                      {(
                        detail.Options.filter(
                          (e) => e.itemoption === optionName
                        )[0].price *
                        (detail.Options.filter(
                          (e) => e.itemoption === optionName
                        )[0].sale *
                          number)
                      ).toLocaleString()}
                      ￦
                    </div>
                    <div className="text-base font-bold text-black ml-2">
                      {`(${number}개)`}
                    </div>
                  </div>
                </div>
              )}
              <Row>
                <Col>
                  <small className="display-block"></small>
                  <Stepper
                    raised
                    buttonsOnly={true}
                    small
                    onStepperChange={handleNumber}
                    value={number}
                    min={1}
                  />
                </Col>
              </Row>
            </CardFooter>
            <CardFooter className="border-b-2">
              <Star average={average} reviewsCount={detail?.Reviews} />
              <Button
                iconF7={
                  !likes?.length || (likes && likes === undefined)
                    ? "suit heart"
                    : "suit_heart_fill"
                }
                onClick={!!getToken().token ? changeLike : waringForLogin}
                iconColor="red"
              ></Button>
            </CardFooter>
            {myReviews?.map((review) => {
              return (
                <List mediaList key={review.id}>
                  <ListItem
                    title={<div>{review.title}</div>}
                    after={<StarForReviews starNumber={review.star} />}
                    text={<div>{review.content}</div>}
                  />
                </List>
              );
            })}
            <Button onClick={handleMoreReviews} fill>
              눌러서 리뷰보기
            </Button>
          </Card>
        </Col>
      </Row>
    </Page>
  );
};
export default ShoppingDetail;
