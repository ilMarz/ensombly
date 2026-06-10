"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

type Role = "follower" | "investor" | "collaborator" | "founder" | undefined;

export function FollowButton({
  projectId,
  userId,
  currentRole,
}: {
  projectId: string;
  userId: string;
  currentRole: Role;
}) {
  const [loading, setLoading] = useState(false);
  const supabase = createClient();
  const router = useRouter();
  const isFollowing = !!currentRole;

  const toggle = async () => {
    setLoading(true);
    if (isFollowing) {
      await supabase
        .from("project_members")
        .delete()
        .eq("project_id", projectId)
        .eq("user_id", userId);
    } else {
      await supabase
        .from("project_members")
        .insert({ project_id: projectId, user_id: userId, role: "follower" });
    }
    setLoading(false);
    router.refresh();
  };

  return (
    <Button variant={isFollowing ? "outline" : "default"} size="sm" onClick={toggle} disabled={loading}>
      {isFollowing ? "Following" : "Follow"}
    </Button>
  );
}
