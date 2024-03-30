"use-client"

import { useRouter, useSearchParams } from "next/navigation";
import { trpc } from "../_trpc/client";
import { Loader2 } from "lucide-react";

const Page = () => {
  const router = useRouter()

  const serachParams = useSearchParams()
  const origin = serachParams.get("origin")

  trpc.authCallback.useQuery(undefined, {
    onSuccess: ({ success }) => {
      if (success) {
        //user is synced to db
        router.push(origin ? `/${origin}` : "/dashboard");
      }
    },
    onError: (err) => {
      if (err.data?.code === "UNAUTHORIZED") {
        router.push("/sign-in");
      }
    },
    retry: true,
    retryDelay: 500,
  });

  return (
    <div className="w-full mt-24 flex justify-center">
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="h-8 w-8 text-gray-600 animate-spin" />
        <span className="text-lg font-medium text-gray-900 dark:text-white">
          Setting up your account...
        </span>
        <p className="text-lg font-medium text-gray-900 dark:text-white">
          You will be redirected automatically.
        </p>
      </div>
    </div>
  );
};

export default Page;
