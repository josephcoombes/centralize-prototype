"use client";

import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import {
  Puzzle,
  Mail,
  Calendar,
  Upload,
  Check,
  ArrowRight,
  ArrowLeft,
  User,
  Users,
  Sparkles,
  Globe,
  Building2,
} from "lucide-react";

const STEPS = [
  { id: "welcome", label: "Welcome" },
  { id: "account", label: "Account" },
  { id: "sync", label: "Sync Network" },
  { id: "connect", label: "Connect" },
  { id: "personas", label: "Personas" },
  { id: "suggestions", label: "Suggestions" },
];

type FormData = {
  firstName: string;
  lastName: string;
  profilePic: string | null;
  accountName: string;
  domainName: string;
  extensionInstalled: boolean;
  emailConnected: boolean;
  calendarConnected: boolean;
  personas: string[];
};

const PERSONA_OPTIONS = [
  { id: "founder", label: "Founder", icon: "🚀" },
  { id: "investor", label: "Investor", icon: "💼" },
  { id: "recruiter", label: "Recruiter", icon: "🎯" },
  { id: "sales", label: "Sales", icon: "📈" },
  { id: "advisor", label: "Advisor", icon: "🧠" },
  { id: "operator", label: "Operator", icon: "⚙️" },
];

export function OnboardingForm() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>({
    firstName: "",
    lastName: "",
    profilePic: null,
    accountName: "",
    domainName: "",
    extensionInstalled: false,
    emailConnected: false,
    calendarConnected: false,
    personas: [],
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const progress = ((step + 1) / STEPS.length) * 100;

  function update<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleProfilePic(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    update("profilePic", url);
  }

  function togglePersona(id: string) {
    setForm((prev) => ({
      ...prev,
      personas: prev.personas.includes(id)
        ? prev.personas.filter((p) => p !== id)
        : [...prev.personas, id],
    }));
  }

  const initials =
    [form.firstName[0], form.lastName[0]].filter(Boolean).join("").toUpperCase() || "?";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Step indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground font-medium">
              Step {step + 1} of {STEPS.length}
            </span>
            <span className="text-sm font-semibold text-foreground">
              {STEPS[step].label}
            </span>
          </div>
          <Progress value={progress} className="h-1.5" />
          <div className="flex justify-between mt-2">
            {STEPS.map((s, i) => (
              <div
                key={s.id}
                className={cn(
                  "h-1.5 w-1.5 rounded-full transition-colors",
                  i <= step ? "bg-primary" : "bg-border"
                )}
              />
            ))}
          </div>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-border p-8">
          {step === 0 && (
            <StepWelcome
              form={form}
              initials={initials}
              fileInputRef={fileInputRef}
              onUpdate={update}
              onProfilePic={handleProfilePic}
            />
          )}
          {step === 1 && <StepAccount form={form} onUpdate={update} />}
          {step === 2 && <StepSync form={form} onUpdate={update} />}
          {step === 3 && <StepConnect form={form} onUpdate={update} />}
          {step === 4 && <StepPersonas form={form} onToggle={togglePersona} />}
          {step === 5 && <StepSuggestions form={form} />}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
            <Button
              variant="ghost"
              onClick={() => setStep((s) => s - 1)}
              disabled={step === 0}
              className="gap-1"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>

            {step < STEPS.length - 1 ? (
              <Button onClick={() => setStep((s) => s + 1)} className="gap-1">
                Continue
                <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button className="gap-1 bg-emerald-600 hover:bg-emerald-700">
                <Check className="h-4 w-4" />
                Finish Setup
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Step 1: Welcome ── */
function StepWelcome({
  form,
  initials,
  fileInputRef,
  onUpdate,
  onProfilePic,
}: {
  form: FormData;
  initials: string;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onUpdate: <K extends keyof FormData>(k: K, v: FormData[K]) => void;
  onProfilePic: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Welcome aboard</h1>
        <p className="text-muted-foreground mt-1">Let&apos;s start with the basics.</p>
      </div>

      {/* Profile pic */}
      <div className="flex flex-col items-center gap-3">
        <Avatar className="h-20 w-20 cursor-pointer ring-2 ring-border ring-offset-2" onClick={() => fileInputRef.current?.click()}>
          {form.profilePic ? (
            <AvatarImage src={form.profilePic} alt="Profile" />
          ) : null}
          <AvatarFallback className="text-xl bg-slate-100">
            {initials !== "?" ? initials : <User className="h-8 w-8 text-muted-foreground" />}
          </AvatarFallback>
        </Avatar>
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="h-3.5 w-3.5" />
          Upload photo
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onProfilePic}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="firstName">First name</Label>
          <Input
            id="firstName"
            placeholder="Jane"
            value={form.firstName}
            onChange={(e) => onUpdate("firstName", e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="lastName">Last name</Label>
          <Input
            id="lastName"
            placeholder="Smith"
            value={form.lastName}
            onChange={(e) => onUpdate("lastName", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}

/* ── Step 2: Account ── */
function StepAccount({
  form,
  onUpdate,
}: {
  form: FormData;
  onUpdate: <K extends keyof FormData>(k: K, v: FormData[K]) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Your account</h2>
        <p className="text-muted-foreground mt-1">Set up your workspace details.</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="accountName">Account name</Label>
          <div className="relative">
            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="accountName"
              className="pl-9"
              placeholder="Acme Corp"
              value={form.accountName}
              onChange={(e) => onUpdate("accountName", e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="domainName">Domain name</Label>
          <div className="relative">
            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="domainName"
              className="pl-9"
              placeholder="acme.com"
              value={form.domainName}
              onChange={(e) => onUpdate("domainName", e.target.value)}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Used to automatically match contacts from your organization.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ── Step 3: Sync your network ── */
function StepSync({
  form,
  onUpdate,
}: {
  form: FormData;
  onUpdate: <K extends keyof FormData>(k: K, v: FormData[K]) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Sync your network</h2>
        <p className="text-muted-foreground mt-1">
          Install the Chrome extension to automatically import your LinkedIn connections and web activity.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-slate-50 p-6 flex flex-col items-center gap-4 text-center">
        <div className="h-14 w-14 rounded-full bg-white shadow-sm border border-border flex items-center justify-center">
          <Puzzle className="h-7 w-7 text-blue-500" />
        </div>
        <div>
          <p className="font-semibold">Centralize for Chrome</p>
          <p className="text-sm text-muted-foreground mt-0.5">
            Syncs your LinkedIn, email signatures, and browsing context.
          </p>
        </div>

        {form.extensionInstalled ? (
          <div className="flex items-center gap-2 text-emerald-600 font-medium text-sm">
            <Check className="h-4 w-4" />
            Extension installed
          </div>
        ) : (
          <Button
            className="gap-2 bg-blue-600 hover:bg-blue-700"
            onClick={() => onUpdate("extensionInstalled", true)}
          >
            <Puzzle className="h-4 w-4" />
            Install Chrome Extension
          </Button>
        )}
      </div>

      <p className="text-xs text-center text-muted-foreground">
        You can skip this step and install later from Settings.
      </p>
    </div>
  );
}

/* ── Step 4: Connect emails & calendar ── */
function StepConnect({
  form,
  onUpdate,
}: {
  form: FormData;
  onUpdate: <K extends keyof FormData>(k: K, v: FormData[K]) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Connect your accounts</h2>
        <p className="text-muted-foreground mt-1">
          Pull in your emails and calendar events to enrich your network.
        </p>
      </div>

      <div className="space-y-3">
        <ConnectCard
          icon={<Mail className="h-5 w-5 text-rose-500" />}
          title="Email"
          description="Gmail, Outlook, or any IMAP account"
          connected={form.emailConnected}
          onConnect={() => onUpdate("emailConnected", !form.emailConnected)}
        />
        <ConnectCard
          icon={<Calendar className="h-5 w-5 text-blue-500" />}
          title="Calendar"
          description="Google Calendar or Outlook Calendar"
          connected={form.calendarConnected}
          onConnect={() => onUpdate("calendarConnected", !form.calendarConnected)}
        />
      </div>
    </div>
  );
}

function ConnectCard({
  icon,
  title,
  description,
  connected,
  onConnect,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  connected: boolean;
  onConnect: () => void;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-border bg-slate-50 p-4">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-lg bg-white border border-border shadow-sm flex items-center justify-center">
          {icon}
        </div>
        <div>
          <p className="font-medium text-sm">{title}</p>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
      {connected ? (
        <div className="flex items-center gap-1.5 text-emerald-600 text-sm font-medium">
          <Check className="h-4 w-4" />
          Connected
        </div>
      ) : (
        <Button size="sm" variant="outline" onClick={onConnect}>
          Connect
        </Button>
      )}
    </div>
  );
}

/* ── Step 5: Personas ── */
function StepPersonas({
  form,
  onToggle,
}: {
  form: FormData;
  onToggle: (id: string) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Choose your personas</h2>
        <p className="text-muted-foreground mt-1">
          Select all that apply. This helps us surface the right context for each interaction.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {PERSONA_OPTIONS.map((p) => {
          const selected = form.personas.includes(p.id);
          return (
            <button
              key={p.id}
              onClick={() => onToggle(p.id)}
              className={cn(
                "flex items-center gap-3 rounded-xl border p-4 text-left transition-all",
                selected
                  ? "border-primary bg-primary/5 ring-1 ring-primary"
                  : "border-border bg-slate-50 hover:bg-white hover:border-slate-300"
              )}
            >
              <span className="text-2xl">{p.icon}</span>
              <div>
                <p className="font-medium text-sm">{p.label}</p>
                {selected && (
                  <p className="text-xs text-primary">Selected</p>
                )}
              </div>
              {selected && (
                <Check className="h-4 w-4 text-primary ml-auto shrink-0" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ── Step 6: Suggestions ── */
function StepSuggestions({ form }: { form: FormData }) {
  const firstName = form.firstName || "there";
  const suggestions = [
    {
      icon: "👋",
      title: "Reconnect with an old contact",
      description: "You haven't spoken with Marcus Chen in 6 months.",
    },
    {
      icon: "🤝",
      title: "Warm intro opportunity",
      description: "Sarah at Sequoia knows 3 people you're trying to reach.",
    },
    {
      icon: "📅",
      title: "Follow up after your meeting",
      description: "You met Alex from Stripe last Tuesday — no follow-up yet.",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Sparkles className="h-6 w-6 text-amber-500" />
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            You&apos;re all set, {firstName}!
          </h2>
          <p className="text-muted-foreground mt-0.5">
            Here&apos;s a preview of what Centralize will surface for you.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {suggestions.map((s, i) => (
          <div
            key={i}
            className="flex items-start gap-3 rounded-xl border border-border bg-slate-50 p-4"
          >
            <span className="text-2xl mt-0.5">{s.icon}</span>
            <div>
              <p className="font-semibold text-sm">{s.title}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{s.description}</p>
            </div>
          </div>
        ))}
      </div>

      {form.personas.length > 0 && (
        <div className="rounded-xl border border-border bg-amber-50 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Users className="h-4 w-4 text-amber-600" />
            <p className="text-sm font-semibold text-amber-800">Your personas</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {form.personas.map((id) => {
              const p = PERSONA_OPTIONS.find((o) => o.id === id);
              return p ? (
                <span
                  key={id}
                  className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800"
                >
                  {p.icon} {p.label}
                </span>
              ) : null;
            })}
          </div>
        </div>
      )}
    </div>
  );
}
