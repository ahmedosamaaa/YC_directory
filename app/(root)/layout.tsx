import React from "react";
import Navbar from "@/app/_components/Navbar";

export default function layout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <main className="font-work-sans">
            <Navbar />
            {children}
        </main>
    );
}
