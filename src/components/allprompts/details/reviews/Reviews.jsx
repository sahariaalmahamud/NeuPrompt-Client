"use client";

import { Tabs, Tab } from "@heroui/react";
import MyReviews from "./MyReviews";
import ReceivedReviews from "./ReceivedReviews";

export default function Reviews() {
  return (
    <div className="flex w-full flex-col">
      <Tabs 
        aria-label="Reviews Management" 
        color="primary" 
        variant="underlined"
        classNames={{
          tabList: "gap-6 w-full relative rounded-none p-0 border-b border-white/10",
          cursor: "w-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]",
          tab: "max-w-fit px-0 h-12",
          tabContent: "group-data-[selected=true]:text-white text-zinc-400 font-medium"
        }}
      >
        <Tab key="my" title="My Reviews">
          <div className="pt-4">
            <MyReviews />
          </div>
        </Tab>
        <Tab key="received" title="Reviews Received">
          <div className="pt-4">
            <ReceivedReviews />
          </div>
        </Tab>
      </Tabs>
    </div>
  );
}