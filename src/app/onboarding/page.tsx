"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/Button";
import type { ClassLevel, FirstLanguage, Medium } from "@/lib/types";

type Step = "account-type" | "profile-form" | "add-another";

interface DraftProfile {
  name: string;
  class_level: ClassLevel | "";
  first_language: FirstLanguage | "";
  medium: Medium | "";
}

const emptyDraft: DraftProfile = { name: "", class_level: "", first_language: "", medium: "" };

export default function OnboardingPage() {
  const supabase = createClient();
  const [step, setStep] = useState<Step>("account-type");
  const [isMultiUser, setIsMultiUser] = useState<boolean | null>(null);
  const [draft, setDraft] = useState<DraftProfile>(emptyDraft);
  const [savedCount, setSavedCount] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const draftComplete =
    (isMultiUser === false || draft.name.trim().length > 0) &&
    draft.class_level &&
    draft.first_language &&
    draft.medium;

  async function saveProfile() {
    setSaving(true);
    setError(null);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("Session expired — please log in again.");
      setSaving(false);
      return;
    }

    const { error } = await supabase.from("profiles").insert({
      account_id: user.id,
      name: isMultiUser ? draft.name.trim() : user.email?.split("@")[0] ?? "Student",
      class_level: draft.class_level,
      first_language: draft.first_language,
      medium: draft.medium,
    });

    setSaving(false);
    if (error) {
      setError(error.message);
      return;
    }

    setSavedCount((c) => c + 1);

    if (isMultiUser) {
      setDraft(emptyDraft);
      setStep("add-another");
    } else {
      window.location.href = "/";
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-16 safe-top safe-bottom">
      <div className="w-full max-w-[440px] bg-paper-white rounded-cards p-24 border border-soft-mist">
        {step === "account-type" && (
          <>
            <h1 className="text-heading-sm mb-8">Who's this account for?</h1>
            <p className="text-body-sm text-stone-gray mb-24">
              One email can hold a profile for every student in the family.
            </p>
            <select
              className="w-full border border-soft-mist rounded-small-buttons px-16 h-[48px] text-body bg-warm-parchment mb-24"
              defaultValue=""
              onChange={(e) => setIsMultiUser(e.target.value === "multiple")}
            >
              <option value="" disabled>
                Choose one
              </option>
              <option value="one">Just one student</option>
              <option value="multiple">More than one student</option>
            </select>
            <Button
              className="w-full"
              disabled={isMultiUser === null}
              onClick={() => setStep("profile-form")}
            >
              Continue
            </Button>
          </>
        )}

        {step === "profile-form" && (
          <>
            <h1 className="text-heading-sm mb-8">
              {isMultiUser ? `Add a student${savedCount > 0 ? ` (#${savedCount + 1})` : ""}` : "Tell us about you"}
            </h1>
            <div className="flex flex-col gap-12 mb-24">
              {isMultiUser && (
                <input
                  placeholder="Student's name"
                  value={draft.name}
                  onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                  className="border border-soft-mist rounded-small-buttons px-16 h-[48px] text-body bg-warm-parchment"
                />
              )}

              <select
                className="border border-soft-mist rounded-small-buttons px-16 h-[48px] text-body bg-warm-parchment"
                value={draft.class_level}
                onChange={(e) => setDraft({ ...draft, class_level: e.target.value as ClassLevel })}
              >
                <option value="" disabled>
                  Class
                </option>
                <option value="5">Class 5</option>
                <option value="6">Class 6</option>
                <option value="7">Class 7</option>
                <option value="8">Class 8</option>
                <option value="9">Class 9</option>
                <option value="1-4" disabled>
                  Classes 1–4 (coming soon)
                </option>
                <option value="sslc" disabled>
                  SSLC (coming soon)
                </option>
              </select>

              <select
                className="border border-soft-mist rounded-small-buttons px-16 h-[48px] text-body bg-warm-parchment"
                value={draft.first_language}
                onChange={(e) => setDraft({ ...draft, first_language: e.target.value as FirstLanguage })}
              >
                <option value="" disabled>
                  First language
                </option>
                <option value="malayalam">Malayalam</option>
                <option value="urdu">Urdu</option>
                <option value="arabic">Arabic</option>
                <option value="sanskrit">Sanskrit</option>
              </select>

              <select
                className="border border-soft-mist rounded-small-buttons px-16 h-[48px] text-body bg-warm-parchment"
                value={draft.medium}
                onChange={(e) => setDraft({ ...draft, medium: e.target.value as Medium })}
              >
                <option value="" disabled>
                  Medium of instruction
                </option>
                <option value="english">English</option>
                <option value="malayalam">Malayalam</option>
              </select>
            </div>

            {error && <p className="text-body-sm text-midnight-wine mb-12">{error}</p>}

            <Button className="w-full" disabled={!draftComplete || saving} onClick={saveProfile}>
              {saving ? "Saving…" : "Continue"}
            </Button>
          </>
        )}

        {step === "add-another" && (
          <>
            <h1 className="text-heading-sm mb-8">Added!</h1>
            <p className="text-body-sm text-stone-gray mb-24">
              Add another student now, or head into the app.
            </p>
            <div className="flex flex-col gap-12">
              <Button className="w-full" onClick={() => setStep("profile-form")}>
                Add another student
              </Button>
              <Button variant="outlined" className="w-full" onClick={() => (window.location.href = "/")}>
                I'm done — take me in
              </Button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
