import React, { useContext, FormEvent, ChangeEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { auth } from "../../utils/firebase/config"; // Direktori utils/firebase/config telah diubah menjadi ../../utils/firebase/config
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/router";
import {
  Label,
  Input,
  Button,
  WindmillContext,
  WindmillContextType,
} from "@roketid/windmill-react-ui";
import { useState } from "react";
import { FC } from "react";

const LoginPage: FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { mode } = useContext<WindmillContextType>(WindmillContext);

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Silakan isi email dan password");
      return;
    }

    setIsLoading(true);
    try {
      console.log("Attempting login with:", { email });

      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("Login successful:", userCredential.user);

      router.push("/example");
    } catch (error: any) {
      console.error("Login error:", error);

      if (error.code === "auth/user-not-found") {
        setError("Email tidak terdaftar");
      } else if (error.code === "auth/wrong-password") {
        setError("Password salah");
      } else {
        setError(error.message || "Terjadi kesalahan saat login");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const imgSource =
    mode === "dark"
      ? "/assets/img/sampah-daur-ulang-dark.PNG"
      : "/assets/img/sampah-daur-ulang.PNG";

  return (
    <div className="flex items-center min-h-screen p-6 bg-gray-50 dark:bg-gray-900">
      <div className="flex-1 h-full max-w-4xl mx-auto overflow-hidden bg-white rounded-lg shadow-xl dark:bg-gray-800">
        <div className="flex flex-col overflow-y-auto md:flex-row">
          <div className="relative h-32 md:h-auto md:w-1/2">
            <Image
              aria-hidden="true"
              className="hidden object-cover w-full h-full"
              src={imgSource}
              alt="Office"
              layout="fill"
            />
          </div>
          <main className="flex items-center justify-center p-6 sm:p-12 md:w-1/2">
            <div className="w-full">
              <h1 className="mb-4 text-xl font-semibold text-gray-700 dark:text-gray-200">
                Login
              </h1>
              <Label>
                <span>Email</span>
                <Input
                  className="mt-1"
                  type="email"
                  placeholder="admin@gmail.com"
                  value={email}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setEmail(e.target.value)
                  }
                />
              </Label>

              <Label className="mt-4">
                <span>Password</span>
                <Input
                  className="mt-1"
                  type="password"
                  placeholder="***************"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Label>

              <Button
                className="mt-4"
                block
                onClick={handleLogin}
                disabled={isLoading}
              >
                {isLoading ? "Loading..." : "Log in"}
              </Button>

              <hr className="my-8" />

              <p className="mt-4">
                <Link href="/example/forgot-password">
                  <a className="text-sm font-medium text-purple-600 dark:text-purple-400 hover:underline">
                    Forgot your password?
                  </a>
                </Link>
              </p>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
