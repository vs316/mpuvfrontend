import { getUser } from "@/services/api"; // Adjust the import path as needed

export async function fetchUserDetails(userId: string) {
  try {
    const user = await getUser(userId);
    return user;
  } catch (error) {
    console.error("Error fetching user details:", error);
    return null;
  }
}
