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
import React from "react";

const StarForReviews = ({ starNumber }) => {
  return (
    <div className="transform -translate-y-1">
      <Icon
        f7={starNumber >= 1 ? "star_fill" : "star"}
        size="10px"
        color="yellow"
      ></Icon>
      <Icon
        f7={starNumber >= 2 ? "star_fill" : "star"}
        size="10px"
        color="yellow"
      ></Icon>
      <Icon
        f7={starNumber >= 3 ? "star_fill" : "star"}
        size="10px"
        color="yellow"
      ></Icon>
      <Icon
        f7={starNumber >= 4 ? "star_fill" : "star"}
        size="10px"
        color="yellow"
      ></Icon>
      <Icon
        f7={starNumber >= 5 ? "star_fill" : "star"}
        size="10px"
        color="yellow"
      ></Icon>
    </div>
  );
};

export default StarForReviews;
