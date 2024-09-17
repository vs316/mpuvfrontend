"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Package, UserPlus } from "lucide-react";
import { useState } from "react";
import { RegistrationModal } from "@/components/RegistrationModal";
import { Toaster } from "@/components/ui/toaster";
export default function Home() {
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-8">
          <section className="text-center space-y-4">
            <h2 className="text-3xl font-bold">Welcome to CEP Tracker</h2>
            <p className="text-muted-foreground">
              Track your shipments and manage your deliveries with ease.
            </p>
          </section>
          <section className="grid gap-4 md:grid-cols-2">
            <div className="bg-card text-card-foreground p-6 rounded-lg shadow-md space-y-4">
              <h3 className="text-xl font-semibold">New User?</h3>
              <p>Register now to start creating and tracking shipments.</p>
              <Button
                className="w-full"
                onClick={() => setIsRegistrationOpen(true)}
              >
                <UserPlus className="mr-2 h-4 w-4" /> Register
              </Button>
            </div>
            <div className="bg-card text-card-foreground p-6 rounded-lg shadow-md space-y-4">
              <h3 className="text-xl font-semibold">Create Shipment</h3>
              <p>Registered users can create new shipments here.</p>
              <Link href="add/step-one" passHref>
                <Button className="w-full">
                  <Package className="mr-2 h-4 w-4" /> Create Shipment
                </Button>
              </Link>
            </div>
          </section>
        </div>
      </main>
      <RegistrationModal
        isOpen={isRegistrationOpen}
        onClose={() => setIsRegistrationOpen(false)}
      />
      <Toaster />
    </div>
  );
}
