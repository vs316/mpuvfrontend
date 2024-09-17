"use client";

import { useRouter } from "next/navigation";
import { Home } from "lucide-react"; // Ensure you have lucide-react installed
import { ThemeToggle } from "./ThemeToggle";

export default function Navbar() {
  const router = useRouter();

  const navigateHome = () => {
    router.push("http://localhost:3001");
  };

  return (
    <nav className="flex items-center justify-between p-4 bg-primary text-white">
      <div className="flex items-center cursor-pointer" onClick={navigateHome}>
        <Home className="h-6 w-6" />
        <span className="ml-2">Home</span>
      </div>
      <header className="flex-1 text-center">
        {" "}
        {/* Centering the header */}
        <h1 className="text-2xl font-bold">CEP Tracker</h1>
      </header>
      <ThemeToggle />
    </nav>
  );
}
