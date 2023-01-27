import { sendAndHandleSdkError } from '../internal/communication';
import { ensureInitialized } from '../internal/internalAPIs';

export namespace market {
  export enum CartVendor {
    UC = 'UC',
  }

  export interface LocalCart {
    id: string;
    market: string;
    intent: string;
    locale: string;
    userId: string;
    tid: string;
    createdDateTime: Date;
    localCartStatus: string;
    remoteCartId: string;
    remoteCartStatus: string;
    orderId: string;
    cartItems: LocalCartItem;
    vendorId: string;
  }

  export interface LocalCartItemModel {
    internalItemId: number;
    externalItemId: number;
    quantity: number;
    createDateTime: Date;
    modifiedDateTime: Date;
    imageURL?: string;
    price?: number;
    name?: string;
  }

  export interface LocalCartItemPairModel {
    cartItems: LocalCartItem;
  }

  export interface LocalCartItem {
    [internalItemId: number]: LocalCartItemModel;
  }

  export interface DeleteItemFromCartParams {
    cartId: string;
    itemId: string;
  }

  export interface AddItemToCartParams {
    cartId: string;
    itemId: string;
    quantity: number;
  }

  export interface ChangeCartStatusParams {
    cartId: string;
    status: string;
  }

  export function getCart(): Promise<LocalCart> {
    return new Promise<LocalCart>((resolve) => {
      ensureInitialized();
      resolve(sendAndHandleSdkError('market.getCart'));
    });
  }

  export function deleteItemFromCart(params: DeleteItemFromCartParams): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      ensureInitialized();
      resolve(sendAndHandleSdkError('market.deleteItemFromCart', params));
    });
  }

  export function addItemToCart(params: AddItemToCartParams): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      ensureInitialized();
      resolve(sendAndHandleSdkError('market.addItemToCart', params));
    });
  }

  export function changeCartStatus(params: ChangeCartStatusParams): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      ensureInitialized();
      resolve(sendAndHandleSdkError('market.changeCartStatus', params));
    });
  }
}
