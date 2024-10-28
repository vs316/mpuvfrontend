"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Home } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import "./Navbar.css";
//import Image from "next/image";

export default function Navbar() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const navigateHome = () => {
    router.push("http://localhost:3001");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`nav ${isScrolled ? "affix" : ""}`}>
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="logo">
          <a href="#" onClick={navigateHome} className="flex items-center">
            {/* <Image
              src="https://ceptrackerbucket.s3.ap-south-1.amazonaws.com/CEP+Tracker+logo.png"
              alt="Logo Icon-CEP Tracker"
              width={50}
              height={50}
            /> */}
            <Home className="h-6 w-6 mr-2" />
            <span className="">CEP Tracker</span>
          </a>
        </div>
        <div
          id="mainListDiv"
          className={`main_list ${isMenuOpen ? "show_list" : ""}`}
        >
          <ul className="navlinks">
            <li>
              <a href="/view-orders">View Orders</a>
            </li>
            <li>
              <a href="/contact">Contact</a>
            </li>
            <li>
              <ThemeToggle />
            </li>
          </ul>
        </div>
        <span
          className={`navTrigger ${isMenuOpen ? "active" : ""}`}
          onClick={toggleMenu}
        >
          <i></i>
          <i></i>
          <i></i>
          <i></i>
        </span>
      </div>
    </nav>
  );
}
