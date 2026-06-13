"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { saveApplicationTemplate } from "@/app/(main)/profile/actions";

type Template = {
  id: string;
  title: string;
  body: string;
};

export function ApplyButton({
  roleId,
  userId,
  templates = [],
}: {
  roleId: string;
  userId: string;
  templates?: Template[];
}) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [saveAsTemplate, setSaveAsTemplate] = useState(false);
  const [templateTitle, setTemplateTitle] = useState("");
  const supabase = createClient();
  const router = useRouter();

  const loadTemplate = (t: Template) => {
    setMessage(t.body);
  };

  const submit = async () => {
    setLoading(true);
    await supabase.from("applications").insert({
      project_role_id: roleId,
      applicant_id: userId,
      message,
    });
    if (saveAsTemplate && templateTitle.trim() && message.trim()) {
      await saveApplicationTemplate(templateTitle.trim(), message.trim());
    }
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
    <div className="flex flex-col gap-2 w-full sm:min-w-[260px]">
      {templates.length > 0 && (
        <select
          className="text-xs border border-border rounded p-1.5 bg-background text-muted-foreground"
          defaultValue=""
          onChange={(e) => {
            const t = templates.find((t) => t.id === e.target.value);
            if (t) loadTemplate(t);
          }}
        >
          <option value="" disabled>Load a saved template…</option>
          {templates.map((t) => (
            <option key={t.id} value={t.id}>{t.title}</option>
          ))}
        </select>
      )}
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="text-sm border border-border rounded p-2 resize-none h-24 bg-background"
        placeholder="Briefly introduce yourself..."
      />
      <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer select-none">
        <input
          type="checkbox"
          checked={saveAsTemplate}
          onChange={(e) => setSaveAsTemplate(e.target.checked)}
          className="rounded"
        />
        Save as template
      </label>
      {saveAsTemplate && (
        <input
          value={templateTitle}
          onChange={(e) => setTemplateTitle(e.target.value)}
          className="text-xs border border-border rounded p-1.5 bg-background"
          placeholder="Template name…"
        />
      )}
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
