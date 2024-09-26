// Function to generate or fetch the existing user ID from localStorage

export const getOrCreateUserId = () => {
  let userId = localStorage.getItem("user_id");
  if (!userId) {
    userId = crypto.randomUUID(); // Generate a unique identifier
    localStorage.setItem("user_id", userId);
  }
  return userId;
};
