import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[--background] p-6 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none"></div>
      <div className="relative z-10">
        <SignIn appearance={{ elements: { formButtonPrimary: 'bg-emerald-500 hover:bg-emerald-400 text-black font-bold' } }} />
      </div>
    </div>
  );
}
