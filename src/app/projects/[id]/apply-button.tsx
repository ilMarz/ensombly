"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function ApplyButton({ roleId, userId }: { roleId: string; userId: string }) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  const submit = async () => {
    setLoading(true);
    await supabase.from("applications").insert({
      project_role_id: roleId,
      applicant_id: userId,
      message,
    });
    setDone(true);
    setLoading(false);
    router.refresh();
  };

  if (done) return <span className="text-xs text-green-600 font-medium">Applied!</span>;

  if (!open) {
    return (
      <Button size="sm" variant="outline" onClick={() => setOpen(true)}>
        Apply
      </Button>
    );
  }

  return (
    <div className="flex flex-col gap-2 min-w-[220px]">
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="text-sm border rounded p-2 resize-none h-20 bg-background"
        placeholder="Briefly introduce yourself..."
      />
      <div className="flex gap-2">
        <Button size="sm" onClick={submit} disabled={loading}>
          {loading ? "Sending..." : "Send"}
        </Button>
        <Button size="sm" variant="ghost" onClick={() => setOpen(false)}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
