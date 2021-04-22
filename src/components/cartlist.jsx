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

import React from "react";

const CartList = ({ items, handleDelete, handleQuantityChange }) => {
  return (
    <>
      {items &&
        items.map((item) => {
          return (
            <List mediaList className="h-30 mt-3" key={item.id}>
              <ListItem
                className="border-yellow-300 border-t-4 p-1"
                title={<div className="text-lg">{item.Option.Item.name}</div>}
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
                subtitle={
                  <div className="text-gray-500 p-0">
                    {item.Option.itemoption}
                  </div>
                }
                text={
                  <div className="text-black text-lg">
                    {(item.total * item.Option.sale).toLocaleString()}￦
                  </div>
                }
              >
                {item.quantity + " 개"}

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
                  src={`http://localhost:3000/items/images/${item.Option.Item.category}/${item.Option.Item.name}`}
                  width="110px"
                />
              </ListItem>
            </List>
          );
        })}
    </>
  );
};

export default CartList;
