import { Sidebar } from "@/components/sidebar";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await getCurrentUser();

    if (!user) {
        redirect("/login");
    }

    return (
        <div className="flex h-screen w-full bg-slate-50">
            <Sidebar user={user} />
            <main className="flex-1 overflow-y-auto w-full md:p-8 p-4 pt-16 md:pt-8">
                <div className="max-w-6xl mx-auto animate-fade-in">
                    {children}
                </div>
            </main>
        </div>
    );
}
