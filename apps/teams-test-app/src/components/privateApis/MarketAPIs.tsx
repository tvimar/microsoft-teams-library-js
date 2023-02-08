import { app, authentication, market } from '@microsoft/teams-js';
import React, { useEffect } from 'react';

const MockCart = (): React.ReactElement => {
  const [cart, setCart] = React.useState<market.LocalCart | null>(null);
  const [token, setToken] = React.useState<string>('');
  const [qInput, setQInput] = React.useState<number>(0);

  useEffect(() => {
    app.initialize(['https://admin-local.teams.microsoft.net']);
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

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const changeCartStatus = async (status: string) => {
    const cartId = cart?.id ?? 'abc';

    const URLSearchParams: market.ChangeCartStatusParams = {
      cartId,
      status,
    };

    const result = await market.changeCartStatus(URLSearchParams);
    return JSON.stringify(result);
  };

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const syncOrder = async () => {
    const tenantId = cart?.tid ?? 'b1987e6f-608a-4ab6-be7d-398176182665';
    const itemArr: market.OrderItemModel[] = [];
    let totalPrice = 0.0;

    // Object.values(cart ? cart.cartItems : {}).map((item: market.LocalCartItemModel, key) => (
    //   var test = item.name;
    //   var newItem: market.OrderItemModel = {
    //     name = item.name,

    //   }
    // ));

    if (Array.isArray(cart?.cartItems)) {
      cart?.cartItems.forEach((cartItem) => {
        const orderItem: market.OrderItemModel = {
          name: cartItem.name,
          id: cartItem.externalItemId,
          parentID: 0,
          quantity: cartItem.quantity,
          mpn: cartItem.mpn,
          price: cartItem.price,
          subTotal: cartItem.price * cartItem.quantity,
          imgurl: cartItem.imageURL,
          deliveryInfo: {
            status: 'OrderPlaced',
            lastModifiedDate: new Date().toISOString(),
          },
          manufacturer: 'test',
          itemModifiedDate: new Date().toISOString(),
          details: [],
        };
        totalPrice = totalPrice + cartItem.price * cartItem.quantity;
        itemArr.push(orderItem);
      });
    }

    const orderModel: market.OrderModel = {
      id: cart?.id ?? 'testCartid',
      customerID: 123456789,
      userID: cart?.userId ?? 'testUserId',
      tenantID: tenantId,
      intent: cart?.intent ?? 'adminUser',
      market: cart?.market ?? 'US',
      orderNumber: 987654321,
      createdDateTime: new Date().toISOString(),
      modifiedDateTime: new Date().toISOString(),
      orderModified: false,
      locale: cart?.locale ?? 'en-US',
      currency: 'USD',
      couponCode: '',
      lineItems: itemArr,
      error: '',
      subTotal: totalPrice,
      taxTotal: 0,
      shippingTotal: 0,
      discountAmount: 0,
      total: totalPrice,
      paymentMethod: 'CREDITCARD',
      estimatedMonthly: '',
      term: '',
    };

    // const order = JSON.stringify({
    //   order: orderModel,
    // });

    /////////

    const order = JSON.stringify({
      order: {
        id: cart?.id ?? 'testCartid',
        customerID: 123456789,
        userID: cart?.userId ?? 'testUserId',
        tenantID: tenantId,
        intent: cart?.intent ?? 'adminUser',
        market: cart?.market ?? 'US',
        orderNumber: 987654321,
        createdDateTime: new Date().toISOString(),
        modifiedDateTime: new Date().toISOString(),
        orderModified: false,
        locale: cart?.locale ?? 'en-US',
        currency: 'USD',
        couponCode: '',
        lineItems: [
          {
            name: 'CCX 500 Business Media Phone, Teams Edition, No Handset',
            id: 8876,
            parentID: 0,
            quantity: 1,
            mpn: '2200-49710-019',
            price: 354.86,
            subTotal: 354.86,
            imgurl: 'https://devices.en-us.unifiedcommunications.com/images/Product/icon/8876.jpg',
            deliveryInfo: {
              status: 'OrderPlaced',
              lastModifiedDate: '2023-04-10T20:25:00Z',
            },
            manufacturer: 'Polycom',
            itemModifiedDate: null,
            details: [],
          },
        ],
        error: null,
        subTotal: totalPrice,
        taxTotal: 0.0,
        shippingTotal: 0.0,
        discountAmount: 0,
        total: totalPrice,
        paymentMethod: 'CREDITCARD',
        estimatedMonthly: null,
        term: null,
        relatedOrder: null,
      },
    });

    //// stringify

    // const order = JSON.stringify({
    //   order: {
    //     id: 'deadbeef-0000-1111-2222-333344445555',
    //     customerID: 416251386,
    //     userID: 'd9872269-78ec-44a5-a0dd-e85170635c57',
    //     tenantID: tenantId,
    //     intent: 'adminUser',
    //     market: 'US',
    //     orderNumber: 987654321,
    //     createdDateTime: '2023-04-10T19:18:20.723Z',
    //     modifiedDateTime: '2023-04-10T20:25:00Z',
    //     orderModified: true,
    //     locale: 'en-US',
    //     currency: 'USD',
    //     couponCode: '',
    //     lineItems: [
    //       {
    //         name: 'CCX 500 Business Media Phone, Teams Edition, No Handset',
    //         id: 8876,
    //         parentID: 0,
    //         quantity: 1,
    //         mpn: '2200-49710-019',
    //         price: 354.86,
    //         subTotal: 354.86,
    //         imgurl: 'https://devices.en-us.unifiedcommunications.com/images/Product/icon/8876.jpg',
    //         deliveryInfo: {
    //           status: 'OrderPlaced',
    //           lastModifiedDate: '2023-04-10T20:25:00Z',
    //         },
    //         manufacturer: 'Polycom',
    //         itemModifiedDate: null,
    //         details: [],
    //       },
    //     ],
    //     error: null,
    //     subTotal: 354.86,
    //     taxTotal: 0.0,
    //     shippingTotal: 0.0,
    //     discountAmount: 0,
    //     total: 354.86,
    //     paymentMethod: 'CREDITCARD',
    //     estimatedMonthly: null,
    //     term: null,
    //     relatedOrder: null,
    //   },
    // });

    const result = await market.syncOrder(order);
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
      <button onClick={() => changeCartStatus('Processed')}>
        change cart status to processed (call getCart first)
      </button>{' '}
      <button onClick={() => syncOrder()}>create a sample order for tenant (call getCart first)</button>{' '}
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
