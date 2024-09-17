import z from "zod";

export const stepOneSchema = z.object({
  firstName: z.string().min(1, "Please enter your first name."),
  lastName: z.string().min(1, "Please enter your last name."),
  email: z.string().email("Please enter a valid email address."),
  phoneNumber: z.string().length(10, "Phone number must be 10 digits."),
  addressLine1: z.string().min(1, "Address Line 1 is required."),
  addressLine2: z.string().optional(),
  locality: z.string().min(1, "Locality is required."),
  pincode: z.string().length(6, "Pincode must be 6 digits."),
  city: z.string().min(1, "City is required."),
});

export const stepTwoSchema = z.object({
  company: z.string().min(1, "Company name is required."),
  firstName: z.string().min(1, "Please enter valid first name."),
  lastName: z.string().min(1, "Please enter valid last name."),
  email: z.string().email("Please enter a valid email address."),
  phoneNumber: z.string().length(10, "Phone number must be 10 digits."),
  addressLine1: z.string().min(1, "Address Line 1 is required."),
  addressLine2: z.string().optional(),
  locality: z.string().min(1, "Locality is required."),
  pincode: z.string().length(6, "Pincode must be 6 digits."),
  city: z.string().min(1, "City is required."),
});

export const stepThreeSchema = z.object({
  descriptionOfGoods: z.string().min(1, "Description of goods is required."),
  valueOfGoods: z.coerce.number().optional(),
  weight: z.coerce.number().optional(),
  instructions: z.string().optional(),
});

export const newDealSchema = z.object({
  ...stepOneSchema.shape,
  ...stepTwoSchema.shape,
  ...stepThreeSchema.shape,
});

export const newDealInitialValuesSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().optional(),
  phoneNumber: z.string().optional(),
  addressLine1: z.string().optional(),
  addressLine2: z.string().optional(),
  locality: z.string().optional(),
  pincode: z.string().optional(),
  city: z.string().optional(),
  company: z.string().optional(),
  descriptionOfGoods: z.string().optional(),
  valueOfGoods: z.coerce.number().optional(),
  weight: z.coerce.number().optional(),
  instructions: z.string().optional(),
});

export type NewDealType = z.infer<typeof newDealSchema>;
export type NewDealInitialValuesType = z.infer<
  typeof newDealInitialValuesSchema
>;
