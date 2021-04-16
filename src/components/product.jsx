import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
  Block,
  Link,
  ListItem,
  List,
} from "framework7-react";
import React from "react";

const Product = ({ product }) => {
  const Sale = product.Options[0].sale;
  const Price = product.Options[0].price;
  const Name = product.name;
  return (
    <>
      {product && (
        <Link href={`/shopping/${product.id}`}>
          <Card>
            <CardHeader className="bg-red font-bold h-2">
              <p>{Name}</p>
            </CardHeader>
            <CardContent className="p-0">
              <img
                src={`http://localhost:3000/items/images/${Name}`}
                width="100%"
              />
            </CardContent>
            {Sale !== 1 ? (
              <>
                <CardFooter className="font-bold line-through">{`${Price}원 `}</CardFooter>
                <CardFooter className="font-bold">
                  {`${Price}` * `${Sale}`}원
                </CardFooter>
              </>
            ) : (
              <CardFooter className="font-bold">
                {`${Price}` * `${Sale}`}원
              </CardFooter>
            )}
          </Card>
        </Link>
      )}
    </>
  );
};

export default Product;
