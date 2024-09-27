"use client";
import Icon from "@/components/Icon";
//import { useRouter } from "next/navigation";
import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import path from "path";
import { useEffect, useState } from "react";
import { AddRoutes } from "@/types";

const steps = [
  {
    title: "Ship From",
    route: "step-one",
    link: AddRoutes.SHIPFROM_INFO,
  },
  {
    title: "Ship To",
    route: "step-two",
    link: AddRoutes.SHIPTO_INFO,
  },
  {
    title: "Package Details",
    route: "step-three",
    link: AddRoutes.SHIPMENTPACKAGE_INFO,
  },
  { title: "Review", route: "review", link: AddRoutes.REVIEW_INFO },
];

export default function StepNavigation() {
  const pathname = usePathname();
  const currentPath = path.basename(pathname);
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    setCurrentStep(steps.findIndex((step) => step.route === currentPath));
  }, [currentPath]);

  return (
    <div className="mb-8 mt-2 lg:mb-0 min-w-48">
      {/* back button */}
      <Link
        href={steps[currentStep - 1]?.link || steps[0].link}
        className="mb-2 flex items-center gap-1 text-base disabled:text-white/50 lg:mb-8 lg:gap-3"
      >
        <Icon
          id="circle-left"
          size={24}
          className="text-white overflow-visible"
        />{" "}
        Back
      </Link>

      {/* list of form steps */}
      <div className="relative flex flex-row justify-between lg:flex-col lg:justify-start lg:gap-4">
        {steps.map((step, i) => (
          <Link
            href={step.link}
            key={step.link}
            className="group z-20 flex items-center gap-2 text-lg"
            prefetch={true}
          >
            <span
              className={clsx(
                "flex h-8 w-8 items-center justify-center rounded-full border text-xs transition-colors duration-200 lg:h-10 lg:w-10 lg:text-sm",
                {
                  "border-none bg-teal-500 text-black group-hover:border-none group-hover:text-black":
                    currentPath === step.route,
                  "border-white/75 bg-gray-900 group-hover:border-white group-hover:text-white text-white/75":
                    currentPath !== step.route,
                }
              )}
            >
              {i + 1}
            </span>
            <span
              className={clsx(
                "hidden text-white/75 transition-colors duration-200 group-hover:text-white lg:block",
                {
                  "font-light": currentPath !== step.route,
                  "font-semibold text-white": currentPath === step.route,
                }
              )}
            >
              {step.title}
            </span>
          </Link>
        ))}
        {/* mobile background dashes */}
        <div className="absolute top-3 flex h-1 w-full border-b border-dashed lg:hidden" />
      </div>
    </div>
  );
}
