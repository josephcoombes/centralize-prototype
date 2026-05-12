"use client";

import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
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
  Sparkles,
  Globe,
  Building2,
  Plus,
  Trash2,
} from "lucide-react";

const STEPS = [
  { id: "welcome", label: "Welcome" },
  { id: "account", label: "Account" },
  { id: "sync", label: "Sync Network" },
  { id: "connect", label: "Connect" },
  { id: "personas", label: "Personas" },
  { id: "suggestions", label: "Suggestions" },
];

type Persona = {
  id: string;
  functionName: string;
  responsibilities: string;
  jobTitles: string;
  keywords: string;
};

type FormData = {
  firstName: string;
  lastName: string;
  profilePic: string | null;
  accountName: string;
  domainName: string;
  extensionInstalled: boolean;
  emailConnected: boolean;
  calendarConnected: boolean;
  personas: Persona[];
};

function makePersona(): Persona {
  return { id: crypto.randomUUID(), functionName: "", responsibilities: "", jobTitles: "", keywords: "" };
}

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
    personas: [
      { id: crypto.randomUUID(), functionName: "Design", responsibilities: "Define product vision, lead UX research, own design systems, ensure brand consistency across surfaces", jobTitles: "Head of Design, Product Designer, UX Lead, Creative Director", keywords: "Figma, design systems, usability, prototyping, accessibility" },
      { id: crypto.randomUUID(), functionName: "Engineering", responsibilities: "Ship reliable software, manage technical debt, lead architecture decisions, grow engineering teams", jobTitles: "CTO, VP Engineering, Engineering Manager, Staff Engineer", keywords: "distributed systems, infra, TypeScript, platform, scalability" },
      { id: crypto.randomUUID(), functionName: "Marketing", responsibilities: "Drive demand generation, own brand narrative, manage content and campaigns, grow pipeline", jobTitles: "CMO, VP Marketing, Growth Lead, Content Strategist", keywords: "GTM, demand gen, SEO, brand, campaigns, product marketing" },
      { id: crypto.randomUUID(), functionName: "Security", responsibilities: "Own security posture, manage compliance programs, lead incident response, advise on risk", jobTitles: "CISO, Security Engineer, AppSec Lead, Compliance Manager", keywords: "SOC2, zero trust, pen testing, vulnerability management, IAM" },
    ],
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

  function addPersona() {
    setForm((prev) => ({ ...prev, personas: [...prev.personas, makePersona()] }));
  }

  function removePersona(id: string) {
    setForm((prev) => ({ ...prev, personas: prev.personas.filter((p) => p.id !== id) }));
  }

  function updatePersona(id: string, field: keyof Omit<Persona, "id">, value: string) {
    setForm((prev) => ({
      ...prev,
      personas: prev.personas.map((p) => (p.id === id ? { ...p, [field]: value } : p)),
    }));
  }

  const initials =
    [form.firstName[0], form.lastName[0]].filter(Boolean).join("").toUpperCase() || "?";

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
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
        <div>
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
          {step === 4 && <StepPersonas form={form} onAdd={addPersona} onRemove={removePersona} onUpdate={updatePersona} />}
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
  onAdd,
  onRemove,
  onUpdate,
}: {
  form: FormData;
  onAdd: () => void;
  onRemove: (id: string) => void;
  onUpdate: (id: string, field: keyof Omit<Persona, "id">, value: string) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Personas</h2>
        <p className="text-muted-foreground mt-1">
          Define the roles you operate in. Each persona helps Centralize surface the right context.
        </p>
      </div>

      <Accordion type="multiple" defaultValue={[form.personas[0]?.id]} className="border border-border rounded-lg divide-y divide-border">
        {form.personas.map((p, i) => (
          <AccordionItem key={p.id} value={p.id} className="border-0">
            <AccordionTrigger className="px-4 hover:no-underline">
              <span className="text-sm font-medium text-left">
                {p.functionName || `Persona ${i + 1}`}
              </span>
            </AccordionTrigger>
            <AccordionContent className="px-4">
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor={`fn-${p.id}`}>Function name</Label>
                  <Input
                    id={`fn-${p.id}`}
                    placeholder="e.g. Sales, Recruiting, Investing"
                    value={p.functionName}
                    onChange={(e) => onUpdate(p.id, "functionName", e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor={`resp-${p.id}`}>Key responsibilities</Label>
                  <textarea
                    id={`resp-${p.id}`}
                    rows={2}
                    placeholder="e.g. Close new business, manage pipeline, hit quota"
                    value={p.responsibilities}
                    onChange={(e) => onUpdate(p.id, "responsibilities", e.target.value)}
                    className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor={`titles-${p.id}`}>Example job titles</Label>
                  <Input
                    id={`titles-${p.id}`}
                    placeholder="e.g. AE, SDR, VP of Sales"
                    value={p.jobTitles}
                    onChange={(e) => onUpdate(p.id, "jobTitles", e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor={`kw-${p.id}`}>Related keywords</Label>
                  <Input
                    id={`kw-${p.id}`}
                    placeholder="e.g. SaaS, outbound, enterprise"
                    value={p.keywords}
                    onChange={(e) => onUpdate(p.id, "keywords", e.target.value)}
                  />
                </div>
                {form.personas.length > 1 && (
                  <button
                    onClick={() => onRemove(p.id)}
                    className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-destructive transition-colors mt-2"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Remove persona
                  </button>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <Button variant="outline" size="sm" onClick={onAdd} className="gap-1.5 w-full">
        <Plus className="h-4 w-4" />
        Add another persona
      </Button>
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

      {form.personas.some((p) => p.functionName) && (
        <div className="rounded-xl border border-border bg-amber-50 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-4 w-4 text-amber-600" />
            <p className="text-sm font-semibold text-amber-800">Your personas</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {form.personas.filter((p) => p.functionName).map((p) => (
              <span
                key={p.id}
                className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800"
              >
                {p.functionName}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
