import {
  Block,
  ListItem,
  List,
  Icon,
  Link,
  Row,
  Col,
  Stepper,
} from "framework7-react";

import React, { useState } from "react";
import { createAsyncPromise } from "../common/api/api.config";

const CartList = ({
  items,
  handleDelete,
  handleChecked,
  handleQuantityChange,
  checks,
}) => {
  console.log("카트리스틈ㄴ이ㅏㄹ마ㅣㄴㄹ", items && items);
  return (
    <>
      {items &&
        items.map((item) => {
          return (
            <List mediaList className="h-30 mt-3" key={item.id}>
              <ListItem
                className="border-yellow-300 border-t-4 border-b-0"
                title={item.Option.Item.name}
                after={
                  <Link
                    onClick={() => {
                      handleDelete(item.id, item.Option.id);
                    }}
                  >
                    {" "}
                    <Icon f7="xmark" size="20px" color="red"></Icon>
                  </Link>
                }
                subtitle={item.Option.itemoption}
                text={item.total + "/" + item.total * item.Option.sale}
              >
                {item.quantity + " 개"}

                <input
                  className="invisible"
                  onChange={(e) => {
                    handleChecked(e.target.checked, item.id, item.Option.id);
                  }}
                  type="checkbox"
                  checked={checks.includes(item.id) ? true : false}
                ></input>

                <Stepper
                  raised
                  small
                  className="float-right"
                  min={1}
                  value={item.quantity}
                  buttonsOnly={true}
                  onStepperChange={(value) =>
                    handleQuantityChange(item.id, value, item.Option.itemoption)
                  }
                />

                <img
                  slot="media"
                  src={`http://localhost:3000/items/images/${item.Option.Item.name}`}
                  width="120px"
                />
              </ListItem>
            </List>
          );
        })}
    </>
  );
};

export default CartList;
