/* eslint-disable @typescript-eslint/no-unused-vars */
import * as React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Eye, EyeOff, Loader2, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Logo from "./Logo";
import { useAuth } from "@/context/AuthContext";
import { useToast } from '@/hooks/use-toast';

export default function SigninForm() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast({
        title: "Missing Info",
        description: "Please enter both email and password.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await login({ email: formData.email, password: formData.password });
      toast({ title: "Welcome back!", description: "Redirecting to your dashboard..." });
      navigate("/dashboard");
    } catch (err) {
      const isAuthError = axios.isAxiosError(err) && (err.response?.status === 401 || err.response?.status === 404);
      toast({
        title: "Login Failed",
        description: isAuthError ? "Invalid email or password." : "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-dvh bg-[#070707] px-4 selection:bg-orange-500/30 overflow-hidden">
      
      {/* Dynamic Background Spotlight */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-4xl opacity-[0.15] pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--tw-gradient-from)_0%,transparent_65%)] from-orange-600 to-transparent blur-3xl" />
      </div>

      <div className="relative flex w-full max-w-105 flex-col justify-center py-12 z-10">
        
        {/* Branding Header */}
        <div className="mx-auto w-full text-center space-y-6 animate-in fade-in slide-in-from-top-4 duration-700">
          <Logo className="justify-center" />

          <div className="space-y-1.5">
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Welcome back
            </h1>
          </div>
        </div>

        {/* Login Card */}
        <Card className="mt-10 border-zinc-800/50 bg-zinc-900/40 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all hover:border-zinc-700/50 group">
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Email Field */}
              <div className="space-y-2.5">
                <Label htmlFor="email" className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500 ml-1">
                  Email Address
                </Label>
                <div className="group/input relative">
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    autoComplete="email"
                    placeholder="name@example.com"
                    className="bg-zinc-950/50 border-zinc-800 h-12 focus-visible:ring-orange-500/10 focus-visible:border-orange-500/40 transition-all placeholder:text-zinc-700"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between ml-1">
                  <Label htmlFor="password" className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500">
                    Password
                  </Label>
                </div>
                <div className="relative group/input">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    className="bg-zinc-950/50 border-zinc-800 h-12 pr-12 focus-visible:ring-orange-500/10 focus-visible:border-orange-500/40 transition-all placeholder:text-zinc-700"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-300 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </Button>
                </div>
              </div>

              {/* Action Button */}
              <Button
                type="submit"
                className="group/btn w-full h-12 mt-2 bg-orange-600 hover:bg-orange-500 text-white font-bold transition-all shadow-lg shadow-orange-950/20 active:scale-[0.98]"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="mr-2 size-4 animate-spin" />
                ) : (
                   <ShieldCheck className="mr-2 size-4 opacity-0 -ml-4 group-hover/btn:opacity-100 group-hover/btn:ml-0 transition-all duration-300" />
                )}
                {isLoading ? "Authenticating..." : "Enter Workspace"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Footer Link */}
        <div className="mt-10 text-center animate-in fade-in duration-1000 delay-300">
           <p className="text-sm text-zinc-500">
            Don't have an account yet?{" "}
            <Link to="/register" className="relative font-bold text-zinc-300 hover:text-orange-500 transition-colors group/link">
              Create an account
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-orange-500 transition-all group-hover/link:w-full" />
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}