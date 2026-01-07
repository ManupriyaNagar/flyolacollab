"use client";

import dynamic from "next/dynamic";

const Desktop = dynamic(() => import("./ScheduledPage.desktop"), { ssr: false });
const Mobile = dynamic(() => import("./ScheduledPage.mobile"), { ssr: false });

export default function Page() {
  return (
    <>
      <div className="hidden md:block">
        <Desktop />
      </div>
      <div className="block md:hidden">
        <Mobile />
      </div>
    </>
  );
}


