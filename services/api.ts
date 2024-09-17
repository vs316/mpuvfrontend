const API_BASE_URL = "http://localhost:3000";
// API utility functions for making HTTP requests

export async function getUser(userId: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`); // Assuming you have an API route at /api/users/[id]
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error; // Re-throw the error to be handled by the caller
  }
}
