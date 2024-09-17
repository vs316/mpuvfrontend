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
  coupon?: string;
  discount?: string;
}

export interface StepThreeErrors {
  contactName?: string;
  contactEmail?: string;
  invoiceNumber?: string;
  referenceNumber1?: string;
  referenceNumber2?: string;
  descriptionOfGoods?: string;
  valueOfGoods?: string;
  weight?: string;
  description?: string;
  instructions?: string;
}

export type FormErrors = StepOneErrors & StepTwoErrors & StepThreeErrors;

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
