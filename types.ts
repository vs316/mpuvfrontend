export interface StepOneErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  addressLine1?: string;
  addressLine2?: string;
  locality?: string;
  pincode?: string;
  city?: string;
}

export interface StepTwoErrors {
  company: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  addressLine1?: string;
  addressLine2?: string;
  locality?: string;
  pincode?: string;
  city?: string;
}

export interface StepThreeErrors {
  descriptionOfGoods?: string;
  valueOfGoods?: number;
  weight?: number;
  description?: string;
  instructions?: string;
}

export interface FormErrors {
  [key: string]: string | number | undefined; // Add this line
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  addressLine1?: string;
  addressLine2?: string;
  locality?: string;
  pincode?: string;
  city?: string;
  company?: string;
  descriptionOfGoods?: string;
  valueOfGoods?: number;
  weight?: number;
  instructions?: string;
}

export enum AddRoutes {
  SHIPFROM_INFO = "/add/step-one",
  SHIPTO_INFO = "/add/step-two",
  SHIPMENTPACKAGE_INFO = "/add/step-three",
  REVIEW_INFO = "/add/review",
}

export interface NewDealInitialValuesType {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  addressLine1?: string;
  addressLine2?: string;
  locality?: string;
  pincode?: string;
  city?: string;
  company?: string;
  descriptionOfGoods?: string;
  valueOfGoods?: number;
  weight?: number;
  instructions?: string;
}
