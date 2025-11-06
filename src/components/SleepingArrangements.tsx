"use client";

import { Bed } from "lucide-react";
import type { ListingData } from "@/types";

export default function SleepingArrangements({ arrangements }: { arrangements: ListingData['accommodation']['sleepingArrangements'] }) {
  if (!arrangements) return null;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Sleeping Arrangements</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {arrangements.map((arrangement) => (
          <div key={arrangement.room} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <Bed className="w-6 h-6 mr-2" />
              <h3 className="font-bold">{arrangement.room}</h3>
            </div>
            <p>{arrangement.beds}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
