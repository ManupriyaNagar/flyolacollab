"use client";

import Image from "next/image";

export default function AppDownloadBanner() {
  return (
    <div className="w-full bg-white lg:px-0 px-4">
      <div className="max-w-7xl mx-auto flex md:flex-row items-center justify-between lg:gap-6 gap-0">

        {/* LEFT - IMAGE */}
        <div className="flex justify-center">
          <Image
            src="/APP-Download.png"
            alt="App Preview"
            width={200}
            height={200}
            className="w-[80px] md:w-[260px] h-auto object-contain"
          />
        </div>

        {/* CENTER - TEXT */}
        <div className="text-center md:text-left">
          <h2 className="text-md md:text-4xl font-semibold text-gray-900">
            Unlock exclusive flight deals!
          </h2>
          <p className="text-xs md:text-lg text-gray-500">
            Download our app and fly smarter
          </p>
        </div>

        {/* RIGHT - BUTTONS */}
        <div className="flex flex-row md:flex-row gap-4 justify-center">
          <Image
            src="/play.svg"
            alt="Google Play"
            width={160}
            height={50}
            className="w-[30px] md:w-[160px] h-auto"
          />
          <Image
            src="/app-store.svg"
            alt="App Store"
            width={160}
            height={50}
            className="w-[30px] md:w-[160px] h-auto"
          />
        </div>

      </div>
    </div>
  );
}