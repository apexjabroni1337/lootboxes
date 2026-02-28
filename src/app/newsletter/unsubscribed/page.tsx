import Link from "next/link";
import { CheckCircle } from "lucide-react";

export const metadata = {
  title: "Unsubscribed",
};

export default function UnsubscribedPage() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center py-16">
      <div className="text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-success-100">
          <CheckCircle className="h-7 w-7 text-success-600" />
        </div>
        <h1 className="mt-6 text-2xl font-bold text-gray-900">
          You&apos;ve been unsubscribed
        </h1>
        <p className="mt-3 text-gray-500">
          We&apos;re sorry to see you go. You won&apos;t receive any more emails from us.
        </p>
        <p className="mt-1 text-sm text-gray-400">
          Changed your mind? You can always{" "}
          <Link href="/newsletter" className="text-brand-600 hover:underline">
            re-subscribe
          </Link>.
        </p>
        <Link href="/" className="btn-primary mt-6 inline-block">
          Go to Homepage
        </Link>
      </div>
    </div>
  );
}
