"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function SearchButton({
  selectedService,
  isDisabled,
  pathname,
  queryParams,
  delay = 0.9
}) {
  const buttonColor = selectedService === "helicopters"
    ? (isDisabled ? "bg-orange-400 cursor-not-allowed" : "bg-orange-600 hover:bg-orange-700 text-white")
    : (isDisabled ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 text-white");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="flex justify-center -mt-5"
    >
      <Button
        asChild
        className={`w-full max-w-md h-14 px-12 text-lg font-bold rounded-full flex items-center justify-center gap-3 transition-all duration-300 shadow-lg transform hover:scale-105 ${buttonColor}`}
        disabled={isDisabled}
      >
        <Link
          href={{
            pathname,
            query: queryParams,
          }}
          className="flex items-center gap-3"
        >
          <span>SEARCH</span>
        </Link>
      </Button>
    </motion.div>
  );
}
