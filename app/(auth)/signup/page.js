'use client';

import { use, useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";

import Link from "next/link";

import {motion} from "framer-motion";
import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/products");
    }
    }, [isAuthenticated, router]);
    return (
        <div>
            <motion.div
      initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md mx-auto mt-20 p-8 bg-white rounded-2xl shadow-lg"
    >
        <h1 className="text-2xl font-bold mb-6 text-center text-neutral-900">Login to Your Account</h1>
        <LoginForm />
        <p className="mt-4 text-center text-sm text-neutral-600">
          Don't have an account?{" "}
          <Link href="/auth/signup" className="text-blue-600 hover:underline">
            Signup here
          </Link>
        </p>
    </motion.div>
        </div>
    )
}