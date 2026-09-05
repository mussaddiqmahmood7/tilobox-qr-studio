import { toast } from "sonner";

export const http: typeof fetch = async (input, init) => {
  const res = await fetch(input, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
    ...init,
  });
  if (!res.ok) {
    const body = await res.json();
    let msg = body["error"];
    if (res.status == 401 && !msg) {
      msg = "Unauthorized";
    }

    msg = msg ?? "Network Error";
    toast.error(msg);
    throw Error(msg);
  }
  return res;
};

export async function getGitHubStars() {
  try {
    const res = await fetch(
      "https://api.github.com/repos/mussaddiqmahmood7/tilobox-qr-studio",
      {
        next: { revalidate: 60 },
      },
    );
    if (!res.ok) return 0;
    const data = await res.json();
    return (data["stargazers_count"] as number) || 0;
  } catch {
    return 0;
  }
}
