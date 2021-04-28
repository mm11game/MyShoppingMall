import React, { useState } from "react";
import {
  f7,
  Navbar,
  Page,
  List,
  ListInput,
  ListItem,
  Row,
  Col,
} from "framework7-react";
import { signup } from "@/common/api";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { toast, sleep } from "../../../js/utils.js";

const SignUpSchema = Yup.object().shape({
  name: Yup.string().required("필수 입력사항 입니다"),
  email: Yup.string().email().required("필수 입력사항 입니다"),
  password: Yup.string()
    .min(4, "길이가 너무 짧습니다")
    .max(50, "길이가 너무 깁니다")
    .required("필수 입력사항 입니다"),
  password_confirmation: Yup.string()
    .oneOf([Yup.ref("password"), null], "비밀번호가 일치하지 않습니다.")
    .required("필수 입력사항 입니다"),
  address1: Yup.string().required("필수 입력사항 입니다"),
  address2: Yup.string().required("필수 입력사항 입니다"),

  phone: Yup.string().required("필수 입력사항 입니다"),
});

const SignUpPage = () => {
  return (
    <Page>
      <Navbar title="회원가입" backLink={true} sliding={false}></Navbar>
      <p className="font-semibole text-4xl text-center mt-5">insomenia</p>
      <Formik
        initialValues={{
          name: "",
          email: "",
          password: "",
          password_confirmation: "",
          address1: "",
          address2: "",
          phone: "",
        }}
        validationSchema={SignUpSchema}
        onSubmit={async (values, { setSubmitting }) => {
          await sleep(400);
          setSubmitting(false);
          f7.dialog.preloader("잠시만 기다려주세요...");
          try {
            (await signup({ user: values })).data;
            f7.toast.show({
              position: "top",
              text: "로그인 되었습니다.",
              closeTimeout: 2000,
            });
            location.replace("/");
          } catch (error) {
            f7.dialog.close();
            f7.toast.show({
              position: "top",
              text: "이미 가입된 이메일이 있습니다.",
              closeTimeout: 2000,
            });
          }
        }}
        validateOnMount={true}
      >
        {({
          handleChange,
          handleBlur,
          values,
          errors,
          touched,
          isSubmitting,
          isValid,
        }) => (
          <Form>
            <List noHairlinesMd>
              <div className="p-3 font-semibold bg-white">기본 정보</div>
              <ListInput
                label={i18next.t("login.name")}
                type="text"
                name="name"
                placeholder="이름을 입력해주세요"
                clearButton
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.name}
                errorMessageForce={true}
                errorMessage={touched.name && errors.name}
              />
              <ListInput
                label={i18next.t("login.email")}
                type="email"
                name="email"
                placeholder="이메일을 입력해주세요"
                clearButton
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.email}
                errorMessageForce={true}
                errorMessage={touched.email && errors.email}
              />
              <ListInput
                label={i18next.t("login.password")}
                type="password"
                name="password"
                placeholder="비밀번호를 입력해주세요"
                clearButton
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.password}
                errorMessageForce={true}
                errorMessage={touched.password && errors.password}
              />
              <ListInput
                label={i18next.t("login.password_confirmation")}
                type="password"
                name="password_confirmation"
                placeholder="비밀번호를 확인해주세요"
                clearButton
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.password_confirmation}
                errorMessageForce={true}
                errorMessage={
                  touched.password_confirmation && errors.password_confirmation
                }
              />{" "}
              <ListInput
                label={i18next.t("login.address1")}
                type="text"
                name="address1"
                placeholder="주소를 입력해주세요"
                clearButton
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.address1}
                errorMessageForce={true}
                errorMessage={touched.address && errors.address}
              />
              <ListInput
                label={i18next.t("login.address2")}
                type="text"
                name="address2"
                placeholder="주소를 입력해주세요"
                clearButton
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.address2}
                errorMessageForce={true}
                errorMessage={touched.address && errors.address}
              />
              <ListInput
                label={i18next.t("login.phone")}
                type="text"
                name="phone"
                placeholder="전화번호를 입력해주세요"
                clearButton
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.phone}
                errorMessageForce={true}
                errorMessage={touched.phone && errors.phone}
              />
            </List>
            <div className="p-4">
              <button
                type="submit"
                className="button button-fill button-large disabled:opacity-50"
                disabled={isSubmitting || !isValid}
              >
                회원가입
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </Page>
  );
};

export default SignUpPage;
