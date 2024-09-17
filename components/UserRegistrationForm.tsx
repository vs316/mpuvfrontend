"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "./ui/progress";
import { PasswordStrengthVisualizer } from "./ui/passwordstrengthvisualizer";
interface Address {
  address_line_1: string;
  address_line_2?: string;
  locality?: string;
  city: string;
  state: string;
  pincode: string;
}

interface UserRegistration {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  password: string;
  addresses: Address[];
  emailVerified: boolean;
  phoneVerified: boolean;
}

function SignupForm() {
  const { toast } = useToast();

  const [formData, setFormData] = useState<UserRegistration>({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    password: "",
    addresses: [{ address_line_1: "", city: "", state: "", pincode: "" }],
    emailVerified: false,
    phoneVerified: false,
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);
  const calculatePasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength += 25; // Length
    if (/[A-Z]/.test(password)) strength += 25; // Uppercase
    if (/[0-9]/.test(password)) strength += 25; // Number
    if (/[^A-Za-z0-9]/.test(password)) strength += 25; // Special character
    return strength;
  };
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setFormData({ ...formData, password: newPassword });
    setPasswordStrength(calculatePasswordStrength(newPassword));
  };
  // const [emailOTP, setEmailOTP] = useState("");
  // const [phoneOTP, setPhoneOTP] = useState("");
  // const handleAddressChange = async (
  //   index: number,
  //   field: keyof Address,
  //   value: string
  // ) => {
  //   const newAddresses = [...formData.addresses];
  //   newAddresses[index] = { ...newAddresses[index], [field]: value };

  //   if (field === "pincode" && value.length === 6) {
  //     try {
  //       const response = await fetch(`/api/pincode-lookup?pincode=${value}`);
  //       const data = await response.json();
  //       if (data.city && data.state) {
  //         newAddresses[index].city = data.city;
  //         newAddresses[index].state = data.state;
  //       }
  //     } catch (error) {
  //       console.error("Error fetching pincode data:", error);
  //     }
  //   }

  //   setFormData({ ...formData, addresses: newAddresses });
  // };
  const handleAddressChange = async (
    index: number,
    field: keyof Address,
    value: string
  ) => {
    const newAddresses = [...formData.addresses];
    newAddresses[index] = { ...newAddresses[index], [field]: value };

    if (field === "pincode" && value.length === 6) {
      try {
        const response = await fetch(`/api/pincode-lookup?pincode=${value}`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const responseText = await response.text();
        console.log("Raw API response:", responseText);

        let data;
        try {
          data = JSON.parse(responseText);
        } catch (parseError) {
          console.error("JSON parse error:", parseError);
          throw new Error("Invalid JSON response from API");
        }

        if (data.city && data.state) {
          newAddresses[index].city = data.city;
          newAddresses[index].state = data.state;
        } else {
          console.warn("City or state data missing in API response");
        }
      } catch (error) {
        console.error("Error fetching pincode data:", error);
        // Optionally, you can set an error state here to display to the user
        // setError(`Error fetching pincode data: ${error.message}`);
      }
    }

    setFormData({ ...formData, addresses: newAddresses });
  };
  const addAddress = () => {
    setFormData({
      ...formData,
      addresses: [
        ...formData.addresses,
        { address_line_1: "", city: "", state: "", pincode: "" },
      ],
    });
  };

  const removeAddress = (index: number) => {
    setFormData({
      ...formData,
      addresses: formData.addresses.filter((_, i) => i !== index),
    });
  };

  // const sendEmailOTP = async () => {
  //   try {
  //     const response = await fetch("/api/send-email-otp", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ email: formData.email }),
  //     });
  //     if (response.ok) {
  //       alert("Email OTP sent successfully");
  //     } else {
  //       alert("Failed to send Email OTP");
  //     }
  //   } catch (error) {
  //     console.error("Error sending Email OTP:", error);
  //     alert("An error occurred while sending Email OTP");
  //   }
  // };
  // const sendPhoneOTP = async () => {
  //   try {
  //     const response = await fetch("/api/send-phone-otp", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ phone_number: formData.phone_number }),
  //     });
  //     if (response.ok) {
  //       alert("Phone OTP sent successfully");
  //     } else {
  //       alert("Failed to send Phone OTP");
  //     }
  //   } catch (error) {
  //     console.error("Error sending Phone OTP:", error);
  //     alert("An error occurred while sending Phone OTP");
  //   }
  // };
  // const verifyEmailOTP = async () => {
  //   try {
  //     const response = await fetch("/api/verify-email-otp", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ email: formData.email, otp: emailOTP }),
  //     });
  //     if (response.ok) {
  //       setFormData({ ...formData, emailVerified: true });
  //       alert("Email verified successfully");
  //     } else {
  //       alert("Invalid Email OTP");
  //     }
  //   } catch (error) {
  //     console.error("Error verifying Email OTP:", error);
  //     alert("An error occurred while verifying Email OTP");
  //   }
  // };
  // const verifyPhoneOTP = async () => {
  //   try {
  //     const response = await fetch("/api/verify-phone-otp", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //         phone_number: formData.phone_number,
  //         otp: phoneOTP,
  //       }),
  //     });
  //     if (response.ok) {
  //       setFormData({ ...formData, phoneVerified: true });
  //       alert("Phone number verified successfully");
  //     } else {
  //       alert("Invalid Phone OTP");
  //     }
  //   } catch (error) {
  //     console.error("Error verifying Phone OTP:", error);
  //     alert("An error occurred while verifying Phone OTP");
  //   }
  // };
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (formData.password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }
    // if (!formData.emailVerified || !formData.phoneVerified) {
    //   alert("Please verify both email and phone number before submitting");
    //   return;
    // }

    try {
      const response = await fetch(`http://localhost:3000/user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          phone_number: formData.phone_number,
          password: formData.password,
          addresses: formData.addresses,
        }),
      });

      //   const data = await response.json();

      //   if (data.success) {
      //     alert("Signup successful!");
      //     // Redirect to login page or dashboard
      //   } else {
      //     alert(data.message);
      //   }
      // } catch (error) {
      //   console.error("Error during signup:", error);
      //   alert("An error occurred during signup. Please try again.");
      // }
      if (response.ok) {
        const data = await response.json();
        console.log("Response data:", data);
        toast({
          title: "Success",
          description: "Signup successful!",
          variant: "default",
        });
        window.location.href = "http://localhost:3001"; // Redirect to the specified URL
      } else {
        const errorData = await response.json();
        toast({
          title: "Error",
          description: errorData.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error during signup:", error);
      toast({
        title: "Error",
        description: "An error occurred during signup. Please try again.",
        variant: "destructive",
      });
    }
  };
  const calculateCompletionPercentage = () => {
    const totalFields = 6 + formData.addresses.length * 5; // 6 fields + 5 fields per address
    let filledFields = 0;

    if (formData.first_name) filledFields++;
    if (formData.last_name) filledFields++;
    if (formData.email) filledFields++;
    if (formData.phone_number) filledFields++;
    if (formData.password) filledFields++;
    if (confirmPassword) filledFields++;

    formData.addresses.forEach((address) => {
      if (address.address_line_1) filledFields++;
      if (address.city) filledFields++;
      if (address.state) filledFields++;
      if (address.pincode) filledFields++;
    });

    return (filledFields / totalFields) * 100;
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-lg border bg-card text-card-foreground shadow-sm"
    >
      {/* Render ProgressBar */}
      <div className="flex flex-col p-6 space-y-1">
        <h3 className="font-semibold tracking-tight text-2xl">
          Create an account
        </h3>
        <p className="text-sm text-muted-foreground">
          Enter your details below to create your account
        </p>
      </div>
      <div className="p-6 pt-0 grid gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label
              htmlFor="firstName"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              First Name
            </Label>
            <Input
              type="text"
              id="firstName"
              value={formData.first_name}
              onChange={(e) =>
                setFormData({ ...formData, first_name: e.target.value })
              }
              required
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          <div>
            <Label
              htmlFor="lastName"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Last Name
            </Label>
            <Input
              type="text"
              id="lastName"
              value={formData.last_name}
              onChange={(e) =>
                setFormData({ ...formData, last_name: e.target.value })
              }
              required
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
        </div>

        <div>
          <Label
            htmlFor="email"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Email
          </Label>
          <Input
            type="email"
            id="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            required
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
          <br />
          {/* <Button
            type="button"
            onClick={sendEmailOTP}
            disabled={formData.emailVerified}
          >
            Send Email OTP
          </Button> */}
          {/* </div>
        <div>
        <Label htmlFor="emailOTP">Email OTP</Label>
          <Input
            type="text"
            id="emailOTP"
            value={emailOTP}
            onChange={(e) => setEmailOTP(e.target.value)}
            disabled={formData.emailVerified}
          />
          <br /> */}
          {/* <Button
            type="button"
            onClick={verifyEmailOTP}
            disabled={formData.emailVerified}
          >
          Verify Email
          </Button> */}
        </div>
        <div>
          <Label
            htmlFor="phoneNumber"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Phone Number
          </Label>
          <Input
            type="tel"
            id="phoneNumber"
            value={formData.phone_number}
            onChange={(e) =>
              setFormData({ ...formData, phone_number: e.target.value })
            }
            required
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
          <br />
          {/* <Button
            type="button"
            onClick={sendPhoneOTP}
            disabled={formData.phoneVerified}
          >
            Send Phone OTP
          </Button> */}
          {/* </div>
        <div>
        <Label htmlFor="phoneOTP">Phone OTP</Label>
        <Input
        type="text"
            id="phoneOTP"
            value={phoneOTP}
            onChange={(e) => setPhoneOTP(e.target.value)}
            disabled={formData.phoneVerified}
          />
          <br /> */}
          {/* <Button
            type="button"
            onClick={verifyPhoneOTP}
            disabled={formData.phoneVerified}
          >
            Verify Phone
          </Button> */}
          <Progress value={calculateCompletionPercentage()} />{" "}
        </div>
        {formData.addresses.map((address, index) => (
          <div
            key={index}
            className="space-y-2 bg-muted/50 text-muted-foreground p-4 rounded-md relative"
          >
            <h3 className="text-lg font-semibold">Address {index + 1}</h3>
            <Button
              type="button"
              onClick={() => removeAddress(index)}
              className="absolute top-2 right-2 bg-destructive text-destructive-foreground"
              size="sm"
            >
              Remove
            </Button>
            <div>
              <Label
                htmlFor={`address_line_1-${index}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Street Address
              </Label>
              <Input
                type="text"
                id={`address_line_1-${index}`}
                value={address.address_line_1}
                onChange={(e) =>
                  handleAddressChange(index, "address_line_1", e.target.value)
                }
                required
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            <div>
              <Label
                htmlFor={`address_line_2-${index}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Address Line 2
              </Label>
              <Input
                type="text"
                id={`address_line_2-${index}`}
                value={address.address_line_2 || ""}
                onChange={(e) =>
                  handleAddressChange(index, "address_line_2", e.target.value)
                }
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            <div>
              <Label
                htmlFor={`locality-${index}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Locality
              </Label>
              <Input
                type="text"
                id={`locality-${index}`}
                value={address.locality || ""}
                onChange={(e) =>
                  handleAddressChange(index, "locality", e.target.value)
                }
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label
                  htmlFor={`pincode-${index}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Pincode
                </Label>
                <Input
                  type="text"
                  id={`pincode-${index}`}
                  value={address.pincode}
                  onChange={(e) =>
                    handleAddressChange(index, "pincode", e.target.value)
                  }
                  required
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
              <div>
                <Label
                  htmlFor={`city-${index}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  City
                </Label>
                <Input
                  type="text"
                  id={`city-${index}`}
                  value={address.city}
                  onChange={(e) =>
                    handleAddressChange(index, "city", e.target.value)
                  }
                  required
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
            </div>
            <div>
              <Label
                htmlFor={`state-${index}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                State
              </Label>
              <Input
                type="text"
                id={`state-${index}`}
                value={address.state}
                onChange={(e) =>
                  handleAddressChange(index, "state", e.target.value)
                }
                required
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
          </div>
        ))}

        <Button
          type="button"
          onClick={addAddress}
          className="mt-2 w-full"
          variant="default"
        >
          Add Another Address
        </Button>

        <div>
          <Label
            htmlFor="password"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Password
          </Label>
          <Input
            type="password"
            id="password"
            value={formData.password}
            onChange={handlePasswordChange}
            required
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
          <PasswordStrengthVisualizer
            value={passwordStrength}
            className="mt-2"
          />
        </div>

        <div>
          <Label
            htmlFor="confirmPassword"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Confirm Password
          </Label>
          <Input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        <div className="flex items-center pt-6">
          <Button type="submit" className="w-full">
            Sign Up
          </Button>
        </div>
      </div>
    </form>
  );
}

export default SignupForm;
