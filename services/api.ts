// API utility functions for making HTTP requests
interface Address {
  addressLine1?: string;
  addressLine2?: string; // Optional field
  locality?: string; // Optional field
  city?: string;
  state?: string;
  pincode?: string;
}

export async function getUser(userId: number) {
  try {
    const response = await fetch(`http://localhost:3000/user/${userId}`); // Assuming you have an API route at /api/users/[id]
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error; // Re-throw the error to be handled by the caller
  }
}
export async function getUserAddresses(userId: number) {
  try {
    // Fetching addresses for the specified userId
    const response = await fetch(
      `http://localhost:3000/address?userId=${userId}`
    ); // Adjusted to use query parameters

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();

    // Check if the response contains addresses
    if (data.result && data.result.length > 0) {
      return data.result; // Return only the addresses
    } else {
      return []; // Return an empty array if no addresses found
    }
  } catch (error) {
    console.error("Error fetching user addresses:", error);
    throw error;
  }
}

export async function postNewAddress(userId: number, newAddress: Address) {
  try {
    const response = await fetch(`http://localhost:3000/address`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...newAddress,
        userId, // Include userId in the request body
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to save the new address");
    }
    return await response.json(); // Return the newly created address
  } catch (error) {
    console.error("Error posting new address:", error);
    throw error;
  }
}
