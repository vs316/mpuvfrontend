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
  shiptocompany: z.string().min(1, "Company name is required."),
  shiptofirstName: z.string().min(1, "Please enter valid first name."),
  shiptolastName: z.string().min(1, "Please enter valid last name."),
  shiptoemail: z.string().email("Please enter a valid email address."),
  shiptophoneNumber: z.string().length(10, "Phone number must be 10 digits."),
  shiptoaddressLine1: z.string().min(1, "Address Line 1 is required."),
  shiptoaddressLine2: z.string().optional(),
  shiptolocality: z.string().min(1, "Locality is required."),
  shiptopincode: z.string().length(6, "Pincode must be 6 digits."),
  shiptocity: z.string().min(1, "City is required."),
});

export const stepThreeSchema = z.object({
  descriptionOfGoods: z.string().min(1, "Description of goods is required."),
  valueofgoods: z.coerce.number().optional(),
  weight: z.coerce.number().optional(),
  description: z.string().optional(),
  instructions: z.string().optional(),
});
// Define the package schema
const PackageSchema = z.object({
  weight: z.number().or(z.string()),
  valueofgoods: z.number().or(z.string()),
  description: z.string(),
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
  shiptocompany: z.string().optional(),
  shiptofirstName: z.string().optional(),
  shiptolastName: z.string().optional(),
  shiptoemail: z.string().optional(),
  shiptophoneNumber: z.string().optional(),
  shiptoaddressLine1: z.string().optional(),
  shiptoaddressLine2: z.string().optional(),
  shiptolocality: z.string().optional(),
  shiptopincode: z.string().optional(),
  shiptocity: z.string().optional(),
  descriptionOfGoods: z.string().optional(),
  packages: z.array(PackageSchema),
});

export type NewDealInitialValuesType = z.infer<
  typeof newDealInitialValuesSchema
>;
export const NewDealSchema = newDealInitialValuesSchema.extend({
  // Add any additional fields specific to NewDealType
});
export type NewDealType = z.infer<typeof NewDealSchema>;
