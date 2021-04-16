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
import React, { useState } from "react";

const Star = ({ average, reviewsCount }) => {
  return (
    <div>
      <Icon
        f7={
          average >= 1
            ? "star_fill"
            : average >= 0.5
            ? "star_lefthalf_fill"
            : "star"
        }
        size="20px"
        color="yellow"
      ></Icon>
      <Icon
        f7={
          average >= 2
            ? "star_fill"
            : average >= 1.5
            ? "star_lefthalf_fill"
            : "star"
        }
        size="20px"
        color="yellow"
      ></Icon>
      <Icon
        f7={
          average >= 3
            ? "star_fill"
            : average >= 2.5
            ? "star_lefthalf_fill"
            : "star"
        }
        size="20px"
        color="yellow"
      ></Icon>
      <Icon
        f7={
          average >= 4
            ? "star_fill"
            : average >= 3.5
            ? "star_lefthalf_fill"
            : "star"
        }
        size="20px"
        color="yellow"
      ></Icon>
      <Icon
        f7={
          average >= 5
            ? "star_fill"
            : average >= 4.5
            ? "star_lefthalf_fill"
            : "star"
        }
        size="20px"
        color="yellow"
      ></Icon>
      <span className="font-mono ">(리뷰 {reviewsCount?.length})</span>
    </div>
  );
};

export default Star;
