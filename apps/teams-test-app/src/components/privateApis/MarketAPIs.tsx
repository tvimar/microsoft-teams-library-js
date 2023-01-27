import { app, authentication, market } from '@microsoft/teams-js';
import React, { useEffect } from 'react';

const MockCart = (): React.ReactElement => {
  const [cart, setCart] = React.useState<market.LocalCart | null>(null);
  const [token, setToken] = React.useState<string>('');
  const [qInput, setQInput] = React.useState<number>(0);

  useEffect(() => {
    app.initialize();
  }, []);

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const getCart = () => {
    const callback = async (result: string): Promise<void> => {
      const jwt = parseJwt(result);
      setToken(jwt.name);
      console.log(jwt.name);
      console.log(result);
      setCart(await market.getCart());
      // market.getCart().then((result: market.LocalCart) => {
      //   setCart(result);
      // });
    };
    const authRequest: authentication.AuthTokenRequest = {
      successCallback: callback,
      failureCallback: callback,
    };
    authentication.getAuthToken(authRequest);
  };

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const deleteItemFromCart = async (itemId: string) => {
    const cartId = cart?.id ?? 'abc';

    const URLSearchParams: market.DeleteItemFromCartParams = {
      cartId,
      itemId,
    };

    const result = await market.deleteItemFromCart(URLSearchParams);
    return JSON.stringify(result);
  };

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const addItemToCart = async (itemId: string, quantity: number) => {
    const cartId = cart?.id ?? 'abc';

    const URLSearchParams: market.AddItemToCartParams = {
      cartId,
      itemId,
      quantity,
    };

    const result = await market.addItemToCart(URLSearchParams);
    return JSON.stringify(result);
  };

  return (
    <>
      <button onClick={getCart}>getCart</button>
      <h3>Token: {token}</h3>
      <h1>Cart ID: {cart?.id}</h1>
      <h3>market: {cart?.market}</h3>
      <h3>intent: {cart?.intent}</h3>
      <h3>locale: {cart?.locale}</h3>
      <h3>userId: {cart?.userId}</h3>
      <h3>tenantId: {cart?.tid}</h3>
      <h1>CartItems:</h1>
      <table>
        <tr>
          <th>internalItemId</th>
          <th>externalItemId</th>
          <th>quantity</th>
          <th>price</th>
          <th>deleteItemFromCart</th>
          <th>UpdateItemInCart</th>
        </tr>
        {Object.values(cart ? cart.cartItems : {}).map((item: market.LocalCartItemModel, key) => (
          <tr key={key}>
            <th>{item.internalItemId}</th>
            <th>{item.externalItemId}</th>
            <th>{item.quantity}</th>
            <th>{item.price}</th>
            <th>
              <button onClick={() => deleteItemFromCart(item.internalItemId.toString())}>deleteItemFromCart</button>{' '}
            </th>
            <th>
              <input
                type="number"
                id="input"
                name="input"
                onChange={(e) => setQInput(Number(e.currentTarget.value))}
              ></input>
              <button onClick={() => addItemToCart(item.internalItemId.toString(), qInput)}>UpdateItemInCart</button>{' '}
            </th>
            <br></br>
          </tr>
        ))}
      </table>
    </>
  );
};

function parseJwt(token): { [name: string]: string } {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split('')
      .map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join(''),
  );

  return JSON.parse(jsonPayload);
}

const MarketAPIs = (): React.ReactElement => (
  <>
    <h1>market</h1>
    <MockCart />
  </>
);

export default MarketAPIs;
