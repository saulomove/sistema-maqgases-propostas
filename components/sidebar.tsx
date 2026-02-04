'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
    FileText,
    Settings,
    Users,
    Database,
    LogOut,
    Flame,
    Menu,
    X,
    PlusCircle
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { UserPayload } from '@/lib/auth';

interface SidebarProps {
    user: UserPayload | null;
}

export function Sidebar({ user }: SidebarProps) {
    const pathname = usePathname();
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);

    const isSuperAdmin = user?.role === 'superadmin';

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        router.push('/login');
        router.refresh();
    };

    const navItems = [
        {
            title: 'Propostas',
            href: '/dashboard/propostas',
            icon: FileText,
            active: pathname.startsWith('/dashboard/propostas'),
            show: true,
        },
        {
            title: 'Nova Proposta',
            href: '/dashboard/propostas/nova',
            icon: PlusCircle,
            active: pathname === '/dashboard/propostas/nova',
            show: true, // Todos podem criar
        },
        {
            title: 'Catálogos',
            href: '/dashboard/admin/catalogos',
            icon: Database,
            active: pathname.startsWith('/dashboard/admin/catalogos'),
            show: isSuperAdmin,
        },
        {
            title: 'Usuários',
            href: '/dashboard/admin/usuarios',
            icon: Users,
            active: pathname.startsWith('/dashboard/admin/usuarios'),
            show: isSuperAdmin,
        },
        {
            title: 'Configurações',
            href: '/dashboard/admin/configuracoes',
            icon: Settings,
            active: pathname.startsWith('/dashboard/admin/configuracoes'),
            show: isSuperAdmin,
        },
    ];

    return (
        <>
            <button
                className="md:hidden fixed top-4 left-4 z-50 p-2 bg-primary text-white rounded-full shadow-lg"
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {isOpen && (
                <div
                    className="md:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
                    onClick={() => setIsOpen(false)}
                />
            )}

            <aside className={cn(
                "fixed md:static inset-y-0 left-0 z-40 w-64 bg-card border-r transition-transform duration-300 ease-in-out md:translate-x-0 flex flex-col h-full",
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="p-6 border-b flex flex-col items-center">
                    <div className="p-6 border-b flex flex-col items-center">
                        <div className="mb-4">
                            <Image
                                src="/logo.png"
                                alt="MaqGases"
                                width={180}
                                height={60}
                                className="w-auto h-16"
                                priority
                            />
                        </div>
                    </div>
                </div>

                <div className="p-4 border-b bg-muted/20">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                            {user?.nome?.charAt(0) || 'U'}
                        </div>
                        <div className="flex flex-col overflow-hidden">
                            <span className="text-sm font-medium truncate">{user?.nome}</span>
                            <span className="text-xs text-muted-foreground truncate">
                                {isSuperAdmin ? 'SuperAdmin' : `Unidade ${user?.unidadeId}`}
                            </span>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 overflow-y-auto p-4 space-y-2">
                    {navItems.filter(item => item.show).map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                                item.active
                                    ? "bg-primary text-primary-foreground shadow-sm"
                                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                            )}
                            onClick={() => setIsOpen(false)}
                        >
                            <item.icon size={18} />
                            {item.title}
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t">
                    <Button
                        variant="ghost"
                        className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10 gap-3"
                        onClick={handleLogout}
                    >
                        <LogOut size={18} />
                        Sair do Sistema
                    </Button>
                </div>
            </aside>
        </>
    );
}
