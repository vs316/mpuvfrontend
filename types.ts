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
  shiptocompany: string;
  shiptofirstName?: string;
  shiptolastName?: string;
  shiptoemail?: string;
  shiptophoneNumber?: string;
  shiptoaddressLine1?: string;
  shiptoaddressLine2?: string;
  shiptolocality?: string;
  shiptopincode?: string;
  shiptocity?: string;
}

export interface StepThreeErrors {
  packages?: Array<{
    weight?: number;
    valueofgoods?: number;
    description?: string;
    instructions?: string;
  }>;
}

export interface FormErrors {
  [key: string]:
    | string
    | number
    | undefined
    | Array<{
        weight?: number;
        valueofgoods?: number;
        description?: string;
        instructions?: string;
      }>; // Add this line
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  addressLine1?: string;
  addressLine2?: string;
  locality?: string;
  pincode?: string;
  city?: string;
  shiptocompany?: string;
  shiptofirstName?: string;
  shiptolastName?: string;
  shiptoemail?: string;
  shiptophoneNumber?: string;
  shiptoaddressLine1?: string;
  shiptoaddressLine2?: string;
  shiptolocality?: string;
  shiptopincode?: string;
  shiptocity?: string;
  packages?: Array<{
    weight?: number;
    valueofgoods?: number;
    description?: string;
    instructions?: string;
  }>;
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
  shiptocompany?: string;
  shiptofirstName?: string;
  shiptolastName?: string;
  shiptoemail?: string;
  shiptophoneNumber?: string;
  shiptoaddressLine1?: string;
  shiptoaddressLine2?: string;
  shiptolocality?: string;
  shiptopincode?: string;
  shiptocity?: string;
  descriptionOfGoods?: string;
  // Instead of defining weight, description, and instructions separately,
  // create an array to store multiple packages
  packages?: Array<{
    weight?: number;
    valueofgoods?: number;
    description?: string;
    instructions?: string;
  }>;
}

export enum AddRoutes {
  SHIPFROM_INFO = "/add/step-one",
  SHIPTO_INFO = "/add/step-two",
  SHIPMENTPACKAGE_INFO = "/add/step-three",
  REVIEW_INFO = "/add/review",
}
