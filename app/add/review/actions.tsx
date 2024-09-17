"use server";
import {
  NewDealType,
  stepTwoSchema,
  stepOneSchema,
  stepThreeSchema,
} from "@/schemas";
import { AddRoutes } from "@/types";

interface SubmitDealActionReturnType {
  redirect?: AddRoutes;
  errorMsg?: string;
  success?: boolean;
}

export const submitDealAction = async (
  deal: NewDealType
): Promise<SubmitDealActionReturnType> => {
  const stepOneValidated = stepOneSchema.safeParse(deal);
  if (!stepOneValidated.success) {
    return {
      redirect: AddRoutes.SHIPFROM_INFO,
      errorMsg: "Please validate Ship from info.",
    };
  }

  const stepTwoValidated = stepTwoSchema.safeParse(deal);
  if (!stepTwoValidated.success) {
    return {
      redirect: AddRoutes.SHIPTO_INFO,
      errorMsg: "Please validate Ship to details.",
    };
  }

  const stepThreeValidated = stepThreeSchema.safeParse(deal);
  if (!stepThreeValidated.success) {
    return {
      redirect: AddRoutes.SHIPFROM_INFO,
      errorMsg: "Please validate contact info.",
    };
  }
  const retVal = { success: true, redirect: AddRoutes.SHIPFROM_INFO };
  console.log(retVal);
  return retVal;
};
