import {
  Block,
  BlockTitle,
  Button,
  Col,
  Link,
  f7,
  List,
  ListItem,
  Navbar,
  NavLeft,
  NavRight,
  Icon,
  NavTitle,
  Page,
  TextEditor,
  Card,
  Row,
  ListInput,
} from "framework7-react";
import React, { useState, useEffect } from "react";
import { Formik } from "formik";
import {
  RecoilRoot,
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
} from "recoil";

import * as Yup from "yup";
import { createAsyncPromise } from "../common/api/api.config";
import { getToken } from "../common/auth/index.js";
import {
  itemsState,
  LineItemLength,
  orderIdForReview,
} from "../components/atom";

const Review = () => {
  const [infos, setInfos] = useState([]);
  const [orderId, setOrderId] = useRecoilState(orderIdForReview);
  const stars = [5, 4, 3, 2, 1];
  const [state, setState] = useRecoilState(itemsState);

  const SignInSchema = Yup.object().shape({
    title: Yup.string()
      .min(4, "길이가 너무 짧습니다")
      .max(20, "20자 이하로 써주세요")
      .required("필수 입력사항 입니다"),
    content: Yup.string()
      .min(4, "길이가 너무 짧습니다")
      .max(200, "200자 이하로 써주세요")
      .required("필수 입력사항 입니다"),
    star: Yup.number(),
    item: Yup.string(),
  });

  useEffect(async () => {
    if (!getToken().token) {
      return;
    }
    let body = {
      order_id: orderId,
    };

    let result = await createAsyncPromise("post", "/items/reviewables")(body);
    setInfos(() => result);
  }, [orderId, state]);

  return (
    <Page noToolbar>
      <Navbar title="리뷰" backLink="back" />
      {infos[0] && infos.length !== 0 ? (
        <Formik
          initialValues={{
            title: "",
            content: "",
            star: 5,
            item: `${infos[0].LineItems[0].Option.Item.name},${infos[0].LineItems[0].Option.itemoption}`,
          }}
          validationSchema={SignInSchema}
          onSubmit={async (values, { setSubmitting }) => {
            setSubmitting(false);
            f7.dialog.preloader("정보를 확인중입니다");

            try {
              await createAsyncPromise("post", "/items/reviewed")(values);
              f7.dialog.close();
              location.replace("/");
            } catch (error) {
              f7.dialog.close();
              toast
                .get()
                .setToastText(error?.response?.data || error?.message)
                .openToast();
            }
          }}
          validateOnMount={true}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
            isValid,
          }) => (
            <form onSubmit={handleSubmit}>
              <List>
                <ListInput
                  className="bg-yellow-300"
                  name="item"
                  label="최근 구매한 물품"
                  type="select"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.item}
                >
                  {infos.map((nextinfo) =>
                    nextinfo.LineItems.map((info) => (
                      <option
                        className="text-black"
                        value={`${info.Option.Item.name},${info.Option.itemoption}`}
                        key={info.id}
                      >
                        {info.Option.Item.name} + {info.Option.itemoption}
                      </option>
                    ))
                  )}
                </ListInput>
                <ListInput
                  name="star"
                  label="별점"
                  type="select"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.star}
                >
                  {stars.map((star, idx) => (
                    <option key={idx}>{star}</option>
                  ))}
                </ListInput>
                <ListInput
                  name="title"
                  type="text"
                  placeholder="제목"
                  clearButton
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.title}
                  errorMessageForce={true}
                  errorMessage={touched.title && errors.title}
                />
                <ListInput
                  name="content"
                  type="textarea"
                  placeholder="내용"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.content}
                  errorMessageForce={true}
                  errorMessage={touched.content && errors.content}
                />
              </List>
              <div className="p-1">
                <button
                  type="submit"
                  className="button button-fill button-large disabled:opacity-50"
                  disabled={isSubmitting || !isValid}
                >
                  리뷰하기
                </button>
              </div>
            </form>
          )}
        </Formik>
      ) : (
        <div className="h-full flex justify-center">
          <img src="https://user-images.githubusercontent.com/73922056/114814603-70ca9000-9def-11eb-9dda-200dd424961c.png"></img>
        </div>
      )}
    </Page>
  );
};

export default Review;
