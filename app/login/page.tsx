'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Flame } from 'lucide-react';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, senha }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Erro ao realizar login');
            }

            // Redireciona para dashboard
            console.log('Login successful, redirecting...');
            window.location.href = '/dashboard/propostas'; // Force hard navigation to ensure cookie is picked up
        } catch (err: any) {
            console.error('Login error:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 p-4">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-10 pointer-events-none" />

            <Card className="w-full max-w-md shadow-2xl border-none glass z-10">
                <CardHeader className="space-y-1 flex flex-col items-center text-center pb-6">
                    <div className="mb-4">
                        <Image
                            src="/logo.png"
                            alt="MaqGases"
                            width={280}
                            height={80}
                            className="w-auto h-24"
                            priority
                        />
                    </div>
                    <CardDescription>
                        Sistema de Geração de Propostas
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">E-mail</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="seu@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="bg-white/50"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Senha</Label>
                            <Input
                                id="password"
                                type="password"
                                value={senha}
                                onChange={(e) => setSenha(e.target.value)}
                                required
                                className="bg-white/50"
                            />
                            <div className="flex justify-end">
                            </div>
                        </div>

                        {error && (
                            <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm font-medium">
                                {error}
                            </div>
                        )}

                        <Button type="submit" className="w-full font-semibold shadow-primary transition-all hover:scale-[1.02]" disabled={loading}>
                            {loading ? 'Entrando...' : 'Acessar Sistema'}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-center text-center text-xs text-muted-foreground">
                    © {new Date().getFullYear()} MaqGases - Gases Atmosféricos. <br />Todos os direitos reservados.
                </CardFooter>
            </Card>
        </div>
    );
}
