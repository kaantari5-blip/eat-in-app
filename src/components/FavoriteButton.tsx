import { createClient } from "../lib/supabase/server";
import { toggleFavorite } from "../lib/actions/favorite";
import SubmitButton from "@/components/SubmitButton";

export default async function FavoriteButton({
  packageId,
  currentPath,
}: {
  packageId: string;
  currentPath: string;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // LOGIN YOKSA
  if (!user) {
    return (
      <button
        type="button"
        className="flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-xl text-[#C96C3A] shadow-md transition hover:scale-105 hover:bg-white"
        title="Favorilere eklemek için giriş yap"
      >
        ♡
      </button>
    );
  }

  const { data: favorite } = await (supabase as any)
    .from("favorites")
    .select("id")
    .eq("user_id", user.id)
    .eq("package_id", packageId)
    .maybeSingle();

  const isFavorite = !!favorite;

  return (
    <form
      action={toggleFavorite.bind(
        null,
        packageId,
        currentPath,
        isFavorite
      )}
    >
      <SubmitButton
        pendingText="..."
        className={`flex h-11 w-11 items-center justify-center rounded-full text-xl shadow-md transition hover:scale-105 ${
          isFavorite
            ? "bg-[#FFF3E6] text-[#C96C3A] border border-[#E7D4C4]"
            : "bg-white/90 text-[#C96C3A] border border-[#E7D4C4] hover:bg-white"
        }`}
      >
        {isFavorite ? "♥" : "♡"}
      </SubmitButton>
    </form>
  );
}