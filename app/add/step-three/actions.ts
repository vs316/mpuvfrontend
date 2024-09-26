"use server";
import { stepThreeSchema } from "@/schemas";
import { FormErrors } from "@/types";

export const stepThreeFormAction = async (
  state: { errors?: FormErrors; success: boolean },
  formData: FormData
): Promise<{ errors?: FormErrors; success: boolean }> => {
  const data = Object.fromEntries(formData.entries());
  console.log("Form data submitted:", data); // Debug log
  const validated = stepThreeSchema.safeParse(data);
  console.log("Validation result:", validated); // Debug log
  console.log(validated.success);

  if (!validated.success) {
    console.log("Validation failed issues:", validated.error.issues); // Debug log
    const errors = validated.error.issues.reduce((acc: FormErrors, issue) => {
      const path = issue.path[0] as string;
      acc[path] = issue.message;
      return acc;
    }, {});
    return { errors, success: false };
  }

  return { success: true };
};
