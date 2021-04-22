import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
  Block,
  Link,
  ListItem,
  Button,
  f7,
  List,
} from "framework7-react";
import {
  RecoilRoot,
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
} from "recoil";
import React, { useEffect, useState } from "react";
import { itemsState, starAverage } from "./atom";
import { getToken } from "../common/auth/index.js";
import Starshoppingpage from "./starshoppingpage";
import { createAsyncPromise } from "../common/api/api.config";

const Product = ({ product }) => {
  const Sale = product.Options[0].sale;
  const Price = product.Options[0].price;
  const Name = product.name;
  const [average, setAverage] = useState(0);
  const [likes, setLikes] = useState([]);
  const [state, setState] = useRecoilState(itemsState);

  useEffect(async () => {
    let result = await createAsyncPromise(
      "get",
      `/items/lists/${product.id}`
    )();
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
  }, [state]);

  const changeLike = async () => {
    let props = product.id;
    let result = await createAsyncPromise(
      "post",
      "http://localhost:3000/items/likes"
    )(props);

    setLikes(() => result);
    setState((e) => e + 1);
  };

  const waringForLogin = () => {
    f7.dialog.alert("", "로그인이 필요합니다!");
  };

  return (
    <>
      {product && (
        <Link href={`/shopping/${product.id}`}>
          <Card className="m-1">
            <CardContent className="p-0">
              <img
                src={`http://localhost:3000/items/images/${product.category}/${Name}`}
                width="100%"
              />
            </CardContent>
            <CardHeader className="bg-red font-bold py-0">
              <p>{Name}</p>
            </CardHeader>
            {Sale !== 1 ? (
              <>
                <CardFooter className="py-0">
                  <p className="text-gray-400 line-through text-sm py-0 ">{`${Price.toLocaleString()}￦ `}</p>
                  <p className="font-bold text-red-500">{Sale * 100}%</p>
                </CardFooter>

                <CardFooter className="font-bold py-0">
                  <p>{(`${Price}` * `${Sale}`).toLocaleString()}￦</p>
                </CardFooter>
                <CardFooter className="py-0">
                  {" "}
                  <Starshoppingpage average={average} />
                  <Button
                    iconSize="22px"
                    iconF7={!likes?.length ? "suit heart" : "suit_heart_fill"}
                    onClick={!!getToken().token ? changeLike : waringForLogin}
                    iconColor="red"
                  ></Button>
                </CardFooter>
              </>
            ) : (
              <>
                <CardFooter className="font-bold pt-1 pb-0">
                  {(`${Price}` * `${Sale}`).toLocaleString()}￦
                </CardFooter>
                <CardFooter className="py-0">
                  <Starshoppingpage average={average} />
                  <Button
                    iconSize="22px"
                    iconF7={!likes?.length ? "suit heart" : "suit_heart_fill"}
                    onClick={!!getToken().token ? changeLike : waringForLogin}
                    iconColor="red"
                  ></Button>
                </CardFooter>
              </>
            )}
          </Card>
        </Link>
      )}
    </>
  );
};

export default Product;
