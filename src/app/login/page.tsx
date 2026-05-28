import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string }>;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
            Sign in to Opal U
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Enter your email and we&apos;ll send you a magic link.
          </p>
        </div>
        <LoginForm searchParams={searchParams} />
      </div>
    </div>
  );
}
