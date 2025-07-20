"use client";

import React from "react";

function LoadingSkeleton() {
    return (
        <div className="p-6 bg-[#f8f9fa] text-[#53618a] min-h-screen animate-pulse">
            <div className="flex justify-between items-center mb-6">
                <div className="h-8 w-40 bg-gray-300 rounded"></div>
                <div className="h-10 w-10 bg-gray-300 rounded-full"></div>
            </div>

            <div className="h-6 w-3/4 bg-gray-300 rounded mb-4"></div>
            <div className="h-4 w-1/2 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 w-1/3 bg-gray-200 rounded mb-6"></div>

            <div className="h-10 w-48 bg-gray-300 rounded mb-6"></div>

            <div className="space-y-4">
                {[1, 2, 3].map((_, i) => (
                    <div
                        key={i}
                        className="flex items-center gap-4 p-4 bg-gray-200 rounded-lg"
                    >
                        <div className="h-10 w-10 bg-gray-300 rounded-full" />
                        <div className="flex-1 space-y-2">
                            <div className="h-4 w-1/2 bg-gray-300 rounded" />
                            <div className="h-3 w-3/4 bg-gray-300 rounded" />
                            <div className="h-3 w-1/4 bg-gray-300 rounded" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default LoadingSkeleton;
