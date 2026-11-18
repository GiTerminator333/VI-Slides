"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Eye, EyeOff, User, GraduationCap, Loader2, Sparkles } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import Logo from "./Logo";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import React from "react";

export default function SignupForm() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "Student",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleRoleChange = (value: string) => {
    setFormData((prev) => ({ ...prev, role: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullname || !formData.email || !formData.password) {
      toast({
        title: "Validation Error",
        description: "All fields are required.",
        variant: "destructive",
      });
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Validation Error",
        description: "Passwords do not match.",
        variant: "destructive",
      });
      return;
    }
    if (formData.password.length < 6) {
      toast({
        title: "Validation Error",
        description: "Password must be at least 6 characters.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await register({
        fullname: formData.fullname,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      });
      toast({
        title: "Account Created!",
        description: "Welcome to VI-Slides. Setting up your workspace...",
      });
      navigate("/dashboard");
    } catch (err) {
      const isAxiosError = axios.isAxiosError(err);
      toast({
        title: "Registration Failed",
        description: isAxiosError ? "Unable to register with provided details." : "Unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-dvh bg-[#070707] px-4 selection:bg-orange-500/30 overflow-hidden">
      
      {/* Dynamic Background Spotlight */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-4xl opacity-[0.1] pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--tw-gradient-from)_0%,transparent_70%)] from-orange-600 to-transparent blur-3xl" />
      </div>

      <div className="relative flex w-full max-w-120 flex-col justify-center py-10 z-10">
        
        {/* Branding Header */}
        <div className="mx-auto w-full text-center space-y-6 animate-in fade-in slide-in-from-top-4 duration-700">
          <Logo className="justify-center" />

          <div className="space-y-1.5">
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Join VI-Slides
            </h1>
          </div>
        </div>

        {/* Signup Card */}
        <Card className="mt-8 border-zinc-800/50 bg-zinc-900/40 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all group overflow-hidden">
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              
              {/* Role Selection - Full Width */}
              <div className="col-span-1 sm:col-span-2 space-y-2.5">
                <Label htmlFor="role" className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500 ml-1">
                  I am a...
                </Label>
                <Select value={formData.role} onValueChange={handleRoleChange}>
                  <SelectTrigger id="role" className="bg-zinc-950/50 border-zinc-800 h-11 text-zinc-300 focus:ring-orange-500/20 focus:border-orange-500/40 transition-all">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-300">
                    <SelectItem value="Instructor" className="focus:bg-orange-500/10 focus:text-orange-400 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <User className="size-4" /> Instructor
                      </div>
                    </SelectItem>
                    <SelectItem value="Student" className="focus:bg-orange-500/10 focus:text-orange-400 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <GraduationCap className="size-4" /> Student
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Full Name - Full Width */}
              <div className="col-span-1 sm:col-span-2 space-y-2.5">
                <Label htmlFor="fullname" className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500 ml-1">
                  Full Name
                </Label>
                <Input
                  id="fullname"
                  name="fullname"
                  placeholder="John Doe"
                  className="bg-zinc-950/50 border-zinc-800 h-11 focus-visible:ring-orange-500/10 focus-visible:border-orange-500/40 transition-all placeholder:text-zinc-700"
                  value={formData.fullname}
                  onChange={handleChange}
                />
              </div>

              {/* Email - Full Width */}
              <div className="col-span-1 sm:col-span-2 space-y-2.5">
                <Label htmlFor="email" className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500 ml-1">
                  Email Address
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="johndoe@example.com"
                  className="bg-zinc-950/50 border-zinc-800 h-11 focus-visible:ring-orange-500/10 focus-visible:border-orange-500/40 transition-all placeholder:text-zinc-700"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              {/* Password */}
              <div className="space-y-2.5">
                <Label htmlFor="password" className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500 ml-1">
                  Password
                </Label>
                <div className="relative group/input">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    className="bg-zinc-950/50 border-zinc-800 h-11 pr-10 focus-visible:ring-orange-500/10 focus-visible:border-orange-500/40 transition-all"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full text-zinc-600 hover:text-zinc-300 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </Button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-2.5">
                <Label htmlFor="confirmPassword" className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500 ml-1">
                  Confirm
                </Label>
                <div className="relative group/input">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    className="bg-zinc-950/50 border-zinc-800 h-11 pr-10 focus-visible:ring-orange-500/10 focus-visible:border-orange-500/40 transition-all"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full text-zinc-600 hover:text-zinc-300 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </Button>
                </div>
              </div>

              {/* Submit Button - Full Width */}
              <Button
                type="submit"
                className="group/btn col-span-1 sm:col-span-2 w-full h-12 mt-4 bg-orange-600 hover:bg-orange-500 text-white font-bold transition-all shadow-lg shadow-orange-950/20 active:scale-[0.98]"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="mr-2 size-4 animate-spin" />
                ) : (
                   <Sparkles className="mr-2 size-4 opacity-0 -ml-4 group-hover/btn:opacity-100 group-hover/btn:ml-0 transition-all duration-300" />
                )}
                {isLoading ? "Forging Account..." : "Create Account"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Footer Link */}
        <div className="mt-10 text-center animate-in fade-in duration-1000 delay-300">
           <p className="text-sm text-zinc-500">
            Already have an account?{" "}
            <Link to="/login" className="relative font-bold text-zinc-300 hover:text-orange-500 transition-colors group/link">
              Sign in
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-orange-500 transition-all group-hover/link:w-full" />
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}