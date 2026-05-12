"use client";

import React, { useState, useRef, useMemo, useEffect } from "react";
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Handle,
  Position,
  useReactFlow,
  type Node,
  type Edge,
  type NodeTypes,
  type NodeProps,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import Image from "next/image";
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
  company: string;
  jobTitle: string;
  website: string;
  favicon: string | null;
  accountName: string;
  accountFavicon: string | null;
  domainName: string;
  extensionInstalled: boolean;
  emailConnected: boolean;
  calendarConnected: boolean;
  personas: Persona[];
  addedContacts: string[];
};

function makePersona(): Persona {
  return { id: crypto.randomUUID(), functionName: "", responsibilities: "", jobTitles: "", keywords: "" };
}

/* ── React Flow custom nodes ── */

const handleStyle = { background: "transparent", border: "none", width: 0, height: 0 };
const centerHandleStyle = { background: "transparent", border: "none", width: 0, height: 0, top: "50%", left: "50%" };

type DemoContact = {
  id: string;
  name: string;
  title: string;
  company: string;
  personaFunction: string;
  initials: string;
  color: string;
  warmPath: string;
};

const DEMO_CONTACTS: DemoContact[] = [
  { id: "c1", name: "Sarah Chen",     title: "Head of Design",    company: "", personaFunction: "Design",      initials: "SC", color: "#6366f1", warmPath: "2nd degree via Jordan Kim" },
  { id: "c3", name: "Alex Rodriguez", title: "CTO",               company: "", personaFunction: "Engineering", initials: "AR", color: "#0ea5e9", warmPath: "Met at Node Summit last year" },
  { id: "c5", name: "Emma Thompson",  title: "CMO",               company: "", personaFunction: "Marketing",   initials: "ET", color: "#f59e0b", warmPath: "Intro available via Lisa Chen" },
  { id: "c7", name: "David Martinez", title: "CISO",              company: "", personaFunction: "Security",    initials: "DM", color: "#ef4444", warmPath: "3 mutual connections" },
];

const PROCESSING_STATUSES = [
  "Scanning proprietary dataset",
  "Resolving entity relationships",
  "Making connections",
  "Building social graph",
  "Identifying key stakeholders",
  "Analyzing communication patterns",
  "Mapping org structure",
  "Finding warm introductions",
  "Enriching contact profiles",
  "Detecting buying signals",
  "Scoring engagement history",
  "Linking CRM records",
  "Surfacing relationship paths",
  "Clustering similar personas",
  "Calibrating relevance scores",
  "Weighting network proximity",
  "Indexing interaction signals",
  "Finalizing network map",
];

function UserCardNode({ data }: NodeProps) {
  const d = data as { name: string; jobTitle: string; company: string; website: string; favicon: string | null; initials: string; profilePic: string | null };
  return (
    <div className="rounded-2xl border border-border bg-white shadow-sm p-6 w-64">
      <Handle type="source" position={Position.Bottom} style={handleStyle} />
      <div className="flex items-center gap-4 mb-4">
        <div className="relative shrink-0">
          <div className="h-14 w-14 rounded-full bg-slate-100 border border-border flex items-center justify-center text-lg font-semibold overflow-hidden">
            {d.profilePic ? <img src={d.profilePic} alt="" className="h-full w-full object-cover" />
              : d.initials !== "?" ? d.initials : <User className="h-6 w-6 text-muted-foreground" />}
          </div>
          {d.favicon && (
            <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-md bg-white border border-border shadow-sm flex items-center justify-center overflow-hidden">
              <img src={d.favicon} alt="" className="h-4 w-4 object-contain" />
            </div>
          )}
        </div>
        <div>
          <p className={cn("font-semibold text-base leading-tight", !d.name && "text-muted-foreground/40")}>{d.name || "Your name"}</p>
          <p className={cn("text-sm", d.jobTitle ? "text-muted-foreground" : "text-muted-foreground/30")}>{d.jobTitle || "Job title"}</p>
        </div>
      </div>
      <div className="space-y-1.5 text-sm border-t border-border pt-4">
        <div className="flex items-center gap-2">
          <Building2 className="h-3.5 w-3.5 shrink-0 text-muted-foreground/40" />
          <span className={d.company ? "text-muted-foreground" : "text-muted-foreground/30"}>{d.company || "Company"}</span>
        </div>
        <div className="flex items-center gap-2">
          <Globe className="h-3.5 w-3.5 shrink-0 text-muted-foreground/40" />
          <span className={d.website ? "text-muted-foreground" : "text-muted-foreground/30"}>{d.website || "website.com"}</span>
        </div>
      </div>
    </div>
  );
}

function HubNode(_: NodeProps) {
  return (
    <div className="h-9 w-9 rounded-full bg-[#034b3b] flex items-center justify-center shadow-sm">
      <Handle type="source" position={Position.Top} style={centerHandleStyle} />
      <Handle type="target" position={Position.Top} style={centerHandleStyle} />
      <Handle type="source" position={Position.Bottom} style={centerHandleStyle} />
      <Handle type="source" position={Position.Left} style={centerHandleStyle} />
      <Handle type="source" position={Position.Right} style={centerHandleStyle} />
      <Image src="/centralize-cricle.svg" alt="" width={20} height={20} />
    </div>
  );
}

function CompanyCardNode({ data }: NodeProps) {
  const d = data as { name: string; domain: string; favicon: string | null };
  return (
    <div className="rounded-2xl border border-border bg-white shadow-sm p-6 w-64">
      <Handle type="target" position={Position.Top} style={handleStyle} />
      <Handle type="source" position={Position.Bottom} style={handleStyle} />
      <div className="flex items-center gap-4">
        <div className="h-14 w-14 rounded-full bg-slate-100 border border-border flex items-center justify-center shrink-0 overflow-hidden">
          {d.favicon ? <img src={d.favicon} alt="" className="h-8 w-8 object-contain" />
            : <Building2 className="h-6 w-6 text-muted-foreground/40" />}
        </div>
        <div>
          <p className={cn("font-semibold text-base leading-tight", !d.name && "text-muted-foreground/40")}>{d.name || "Company name"}</p>
          <p className={cn("text-sm", d.domain ? "text-muted-foreground" : "text-muted-foreground/30")}>{d.domain || "domain.com"}</p>
        </div>
      </div>
    </div>
  );
}

function PersonaNode({ data }: NodeProps) {
  const d = data as { functionName: string; jobTitles: string; contacts: { name: string; title: string; initials: string; color: string }[] };
  const titles = d.jobTitles ? d.jobTitles.split(",").map((t) => t.trim()) : [];
  const contacts = d.contacts ?? [];
  return (
    <div className="rounded-xl border border-border bg-white shadow-sm p-3 w-44">
      <Handle type="target" position={Position.Top} style={handleStyle} />
      <p className="text-xs font-semibold text-center mb-2">{d.functionName}</p>
      {titles.length > 0 && (
        <div className="space-y-1.5">
          {titles.map((title, i) => (
            <div key={i} className="flex items-center gap-2 bg-slate-50 rounded-lg px-2 py-1.5">
              <div className="h-5 w-5 rounded-full bg-slate-200 flex items-center justify-center shrink-0">
                <User className="h-3 w-3 text-slate-400" />
              </div>
              <span className="text-[10px] text-muted-foreground leading-tight truncate">{title}</span>
            </div>
          ))}
        </div>
      )}
      {contacts.length > 0 && (
        <div className="mt-2 pt-2 border-t border-border space-y-1.5">
          {contacts.map((c, i) => (
            <div key={i} className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 rounded-lg px-2 py-1.5">
              <div
                className="h-5 w-5 rounded-full flex items-center justify-center shrink-0 text-white text-[9px] font-semibold"
                style={{ background: c.color }}
              >
                {c.initials}
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-medium leading-tight truncate">{c.name}</p>
                <p className="text-[9px] text-muted-foreground truncate">{c.title}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ProcessingNode(_: NodeProps) {
  const [statusIdx, setStatusIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const current = PROCESSING_STATUSES[statusIdx];

  useEffect(() => { setCharIdx(0); }, [statusIdx]);

  useEffect(() => {
    if (charIdx < current.length) {
      const t = setTimeout(() => setCharIdx((c) => c + 1), 45);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => setStatusIdx((i) => (i + 1) % PROCESSING_STATUSES.length), 1800);
      return () => clearTimeout(t);
    }
  }, [charIdx, current]);

  return (
    <div className="rounded-full bg-[#034b3b] shadow-sm p-2 w-64 flex items-center gap-2">
      <Handle type="target" position={Position.Top} style={handleStyle} />
      <Handle type="source" position={Position.Bottom} style={handleStyle} />
      <div className="h-7 w-7 rounded-full bg-white/10 flex items-center justify-center shrink-0">
        <Image src="/centralize-cricle.svg" alt="" width={16} height={16} />
      </div>
      <p className="text-xs text-white/80 flex-1 min-w-0">
        {current.slice(0, charIdx)}{charIdx < current.length ? "…" : ""}
      </p>
    </div>
  );
}

function ContactNode({ data }: NodeProps) {
  const d = data as { name: string; title: string; company: string; initials: string; color: string };
  return (
    <div className="rounded-xl border border-border bg-white shadow-sm p-2.5 w-44">
      <Handle type="target" position={Position.Top} style={handleStyle} />
      <div className="flex items-center gap-2">
        <div
          className="h-7 w-7 rounded-full flex items-center justify-center shrink-0 text-white text-[10px] font-semibold"
          style={{ background: d.color }}
        >
          {d.initials}
        </div>
        <div className="min-w-0">
          <p className="text-xs font-medium truncate leading-tight">{d.name}</p>
          <p className="text-[10px] text-muted-foreground truncate">{d.title} · {d.company}</p>
        </div>
      </div>
    </div>
  );
}

function IconNode({ data }: NodeProps) {
  const d = data as { label: string; bg: string; icon: React.ReactNode; active: boolean; completed: boolean };
  const circleCenter = { background: "transparent", border: "none", width: 0, height: 0, top: 18, left: 18 };
  return (
    <div className="flex flex-col items-center gap-1.5">
      <Handle type="target" position={Position.Top} style={circleCenter} />
      <Handle type="target" position={Position.Bottom} style={circleCenter} />
      <Handle type="target" position={Position.Left} style={circleCenter} />
      <Handle type="target" position={Position.Right} style={circleCenter} />
      <div className="relative">
        <div
          className="h-9 w-9 rounded-full flex items-center justify-center shadow-sm"
          style={{ background: d.active ? d.bg : "#e5e7eb" }}
        >
          {d.icon}
        </div>
        {d.completed && (
          <div className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-emerald-500 flex items-center justify-center ring-1 ring-white">
            <Check className="h-2.5 w-2.5 text-white" />
          </div>
        )}
      </div>
      <span className={cn("text-[10px] font-medium", d.active ? "text-muted-foreground" : "text-muted-foreground/30")}>{d.label}</span>
    </div>
  );
}

function FlowController({ step }: { step: number }) {
  const { fitBounds } = useReactFlow();
  useEffect(() => {
    const boundsMap: Record<number, { x: number; y: number; width: number; height: number }> = {
      0: { x: 0,    y: 0,   width: 256, height: 150 },
      1: { x: 0,    y: 460, width: 256, height: 130 },
      2: { x: 40,   y: 215, width: 180, height: 240 },
      3: { x: 40,   y: 215, width: 180, height: 240 },
      4: { x: -248, y: 620, width: 752, height: 420 },
      5: { x: -248, y: 440, width: 752, height: 420 },
    };
    const bounds = boundsMap[step];
    if (!bounds) return;
    // Delay until after the 500ms column-width CSS transition settles
    const t = setTimeout(() => fitBounds(bounds, { duration: 400, padding: 0.3 }), 520);
    return () => clearTimeout(t);
  }, [step, fitBounds]);
  return null;
}

const nodeTypes: NodeTypes = {
  userCard: UserCardNode,
  hub: HubNode,
  companyCard: CompanyCardNode,
  persona: PersonaNode,
  processing: ProcessingNode,
  icon: IconNode,
  contact: ContactNode,
};

const edgeStyle = { strokeDasharray: "3,4", stroke: "#d1d5db", strokeWidth: 1 };
const solidEdgeStyle = { stroke: "#e5e7eb", strokeWidth: 1 };

const syncIconData = [
  { id: "sync-ext",      label: "Extension", bg: "#034b3b", icon: <Puzzle className="h-4 w-4 text-white" /> },
  { id: "sync-linkedin", label: "LinkedIn",  bg: "#0A66C2", icon: <svg viewBox="0 0 24 24" className="h-4 w-4 fill-white"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg> },
  { id: "sync-gmail",    label: "Gmail",     bg: "#EA4335", icon: <img src="/gmail.svg" className="h-4 w-4 object-contain" alt="" /> },
  { id: "sync-calendar", label: "Calendar",  bg: "#4285F4", icon: <Calendar className="h-4 w-4 text-white" /> },
];

const syncEdges: Edge[] = [
  { id: "hub-ext", source: "hub", target: "sync-ext", type: "straight", style: edgeStyle },
  { id: "hub-linkedin", source: "hub", target: "sync-linkedin", type: "straight", style: edgeStyle },
  { id: "hub-gmail", source: "hub", target: "sync-gmail", type: "straight", style: edgeStyle },
  { id: "hub-calendar", source: "hub", target: "sync-calendar", type: "straight", style: edgeStyle },
];

function FlowCanvas({ form, initials, step }: { form: FormData; initials: string; step: number }) {
  const name = [form.firstName, form.lastName].filter(Boolean).join(" ");

  const nodes = useMemo<Node[]>(() => {
    const hubPos = { x: 110, y: 290 };

    const result: Node[] = [];

    if (step < 5) {
      result.push({
        id: "user",
        type: "userCard",
        position: { x: 0, y: 0 },
        data: { name, jobTitle: form.jobTitle, company: form.company, website: form.website, favicon: form.favicon, initials, profilePic: form.profilePic },
      });
    }

    if (step >= 1) {
      if (step < 5) result.push({ id: "hub", type: "hub", position: hubPos, data: {} });
      result.push({ id: "target", type: "companyCard", position: { x: 0, y: 460 }, data: { name: form.accountName, domain: form.domainName, favicon: form.accountFavicon } });
    }

    if (step < 5) {
      const d = 50;
      const satellites = [
        { id: "sync-ext",      dx: -d, dy: -d, revealAt: 2, active: form.extensionInstalled, completed: form.extensionInstalled },
        { id: "sync-linkedin", dx:  d, dy: -d, revealAt: 2, active: form.extensionInstalled, completed: form.extensionInstalled },
        { id: "sync-gmail",    dx: -d, dy:  d, revealAt: 3, active: form.emailConnected,     completed: form.emailConnected },
        { id: "sync-calendar", dx:  d, dy:  d, revealAt: 3, active: form.calendarConnected,  completed: form.calendarConnected },
      ];
      satellites.forEach(({ id, dx, dy, revealAt, active, completed }, i) => {
        if (step >= revealAt) {
          result.push({
            id,
            type: "icon",
            position: { x: hubPos.x + dx, y: hubPos.y + dy },
            data: { ...syncIconData[i], active, completed },
          });
        }
      });
    }

    if (step >= 4) {
      result.push({ id: "processing", type: "processing", position: { x: 0, y: 630 }, data: {} });
      const personas = form.personas.filter((p) => p.functionName);
      if (personas.length > 0) {
        const nodeW = 176;
        const gap = 16;
        const totalW = personas.length * nodeW + (personas.length - 1) * gap;
        const startX = (256 - totalW) / 2;
        personas.forEach((p, i) => {
          const px = startX + i * (nodeW + gap);
          const contacts = DEMO_CONTACTS.filter(
            (c) => c.personaFunction === p.functionName && form.addedContacts.includes(c.id)
          ).map((c) => ({ name: c.name, title: c.title, initials: c.initials, color: c.color }));
          result.push({
            id: `persona-${p.id}`,
            type: "persona",
            position: { x: px, y: 800 },
            data: { functionName: p.functionName, jobTitles: step >= 5 ? "" : p.jobTitles, contacts },
          });
        });
      }
    }

    return result;
  }, [form, initials, name, step]);

  const edges = useMemo<Edge[]>(() => {
    const result: Edge[] = [];
    if (step >= 1 && step < 5) {
      result.push(
        { id: "user-hub", source: "user", target: "hub", style: edgeStyle },
        { id: "hub-target", source: "hub", target: "target", style: edgeStyle },
      );
    }
    if (step >= 2 && step < 5) result.push(syncEdges[0], syncEdges[1]);
    if (step >= 3 && step < 5) result.push(syncEdges[2], syncEdges[3]);
    if (step >= 4) {
      result.push({ id: "target-processing", source: "target", target: "processing", style: edgeStyle });
      form.personas.filter((p) => p.functionName).forEach((p) => {
        result.push({ id: `processing-${p.id}`, source: "processing", target: `persona-${p.id}`, style: solidEdgeStyle });
      });
    }
    return result;
  }, [form.personas, form.emailConnected, form.calendarConnected, form.extensionInstalled, form.addedContacts, step]);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      proOptions={{ hideAttribution: true }}
      nodesDraggable={false}
      nodesConnectable={false}
      panOnDrag={false}
      zoomOnScroll={false}
      zoomOnPinch={false}
      zoomOnDoubleClick={false}
      deleteKeyCode={null}
    >
      <Background color="#e5e7eb" gap={20} size={1.5} variant={BackgroundVariant.Dots} style={{ backgroundColor: "#fafafa" }} />
      <FlowController step={step} />
    </ReactFlow>
  );
}

export function OnboardingForm() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>({
    firstName: "",
    lastName: "",
    profilePic: null,
    company: "",
    jobTitle: "",
    website: "",
    favicon: null,
    accountName: "",
    accountFavicon: null,
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
    addedContacts: [],
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const progress = ((step + 1) / STEPS.length) * 100;

  function update<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleWebsiteBlur(website: string) {
    const domain = website.replace(/^https?:\/\//, "").replace(/\/.*$/, "").trim();
    if (domain) {
      update("favicon", `https://www.google.com/s2/favicons?domain=${domain}&sz=64`);
    }
  }

  function handleDomainBlur(domain: string) {
    const cleaned = domain.replace(/^https?:\/\//, "").replace(/\/.*$/, "").trim();
    if (cleaned) {
      update("accountFavicon", `https://www.google.com/s2/favicons?domain=${cleaned}&sz=64`);
    }
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

  function addContact(id: string) {
    setForm((prev) => ({
      ...prev,
      addedContacts: prev.addedContacts.includes(id) ? prev.addedContacts : [...prev.addedContacts, id],
    }));
  }

  const initials =
    [form.firstName[0], form.lastName[0]].filter(Boolean).join("").toUpperCase() || "?";

  return (
    <div className="h-screen bg-white p-6 flex overflow-hidden">
      <div className="w-full flex rounded-2xl overflow-hidden">

        {/* Left: form — scrollable */}
        <div className={cn(step >= 4 ? "w-[50%]" : "w-[30%]", "py-8 pr-8 transition-all duration-500 overflow-y-auto shrink-0")}>
          <div className="mb-12">
            <Image src="/logo.svg" alt="Centralize" width={129} height={28} priority />
          </div>
          {step === 0 && (
            <StepWelcome
              form={form}
              initials={initials}
              fileInputRef={fileInputRef}
              onUpdate={update}
              onProfilePic={handleProfilePic}
              onBlurWebsite={handleWebsiteBlur}
            />
          )}
          {step === 1 && <StepAccount form={form} onUpdate={update} onBlurDomain={handleDomainBlur} />}
          {step === 2 && <StepSync form={form} onUpdate={update} />}
          {step === 3 && <StepConnect form={form} onUpdate={update} />}
          {step === 4 && <StepPersonas form={form} onAdd={addPersona} onRemove={removePersona} onUpdate={updatePersona} />}
          {step === 5 && <StepSuggestions form={form} onAddContact={addContact} />}

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

        {/* Right: canvas — explicit width mirrors left so ResizeObserver tracks correctly */}
        <div className={cn(step >= 4 ? "w-[50%]" : "w-[70%]", "h-full transition-all duration-500 min-w-0")}>
          <FlowCanvas form={form} initials={initials} step={step} />
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
  onBlurWebsite,
}: {
  form: FormData;
  initials: string;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onUpdate: <K extends keyof FormData>(k: K, v: FormData[K]) => void;
  onProfilePic: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlurWebsite: (website: string) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[1.25rem] font-medium">Welcome aboard</h1>
        <p className="text-[1rem] font-light text-muted-foreground">Let&apos;s start with the basics.</p>
      </div>

      <div className="space-y-4">
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

        <div className="space-y-1.5">
          <Label htmlFor="company">Company</Label>
          <Input
            id="company"
            placeholder="Acme Inc."
            value={form.company}
            onChange={(e) => onUpdate("company", e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="jobTitle">Job title</Label>
          <Input
            id="jobTitle"
            placeholder="Account Executive"
            value={form.jobTitle}
            onChange={(e) => onUpdate("jobTitle", e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="website">Website</Label>
          <Input
            id="website"
            placeholder="acme.com"
            value={form.website}
            onChange={(e) => onUpdate("website", e.target.value)}
            onBlur={(e) => onBlurWebsite(e.target.value)}
          />
        </div>

        {/* Profile pic */}
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16 cursor-pointer ring-2 ring-border ring-offset-2 shrink-0" onClick={() => fileInputRef.current?.click()}>
            {form.profilePic ? (
              <AvatarImage src={form.profilePic} alt="Profile" />
            ) : null}
            <AvatarFallback className="text-xl bg-slate-100">
              {initials !== "?" ? initials : <User className="h-7 w-7 text-muted-foreground" />}
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
      </div>
    </div>
  );
}

/* ── Step 2: Account ── */
function StepAccount({
  form,
  onUpdate,
  onBlurDomain,
}: {
  form: FormData;
  onUpdate: <K extends keyof FormData>(k: K, v: FormData[K]) => void;
  onBlurDomain: (domain: string) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-[1.25rem] font-medium">Alright{form.firstName ? `, ${form.firstName}` : ""}, let&apos;s add your first account</h2>
        <p className="text-[1rem] font-light text-muted-foreground">What company are you trying to sell into</p>
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
              onBlur={(e) => onBlurDomain(e.target.value)}
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
        <h2 className="text-[1.25rem] font-medium">Sync your network</h2>
        <p className="text-[1rem] font-light text-muted-foreground">
          Install the Chrome extension to automatically import your LinkedIn connections and web activity.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-slate-50 p-6 flex flex-col items-center gap-4 text-center">
        <div className="h-14 w-14 rounded-full bg-white shadow-sm border border-border flex items-center justify-center">
          <Puzzle className="h-7 w-7 text-muted-foreground" />
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
            className="gap-2"
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
        <h2 className="text-[1.25rem] font-medium">Connect your accounts</h2>
        <p className="text-[1rem] font-light text-muted-foreground">
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
        <h2 className="text-[1.25rem] font-medium">Personas</h2>
        <p className="text-[1rem] font-light text-muted-foreground">
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
function StepSuggestions({ form, onAddContact }: { form: FormData; onAddContact: (id: string) => void }) {
  const firstName = form.firstName || "there";
  const accountName = form.accountName || "the account";

  const activePersonaFunctions = new Set(form.personas.filter((p) => p.functionName).map((p) => p.functionName));
  const visibleContacts = DEMO_CONTACTS.filter((c) => activePersonaFunctions.has(c.personaFunction));

  const personaColors: Record<string, string> = {
    Design: "#6366f1",
    Engineering: "#0ea5e9",
    Marketing: "#f59e0b",
    Security: "#ef4444",
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-[1.25rem] font-medium">Here&apos;s who we found, {firstName}</h2>
        <p className="text-[1rem] font-light text-muted-foreground">
          Key people at {accountName}. Add them to your map.
        </p>
      </div>

      <div className="space-y-2">
        {visibleContacts.map((contact) => {
          const added = form.addedContacts.includes(contact.id);
          const personaColor = personaColors[contact.personaFunction] ?? "#6366f1";
          return (
            <div
              key={contact.id}
              className="flex items-center gap-3 rounded-xl border border-border bg-white p-3"
            >
              <div
                className="h-9 w-9 rounded-full flex items-center justify-center shrink-0 text-white text-xs font-semibold"
                style={{ background: contact.color }}
              >
                {contact.initials}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium truncate">{contact.name}</p>
                  <span
                    className="shrink-0 inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-medium text-white"
                    style={{ background: personaColor }}
                  >
                    {contact.personaFunction}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground truncate">{contact.title} · {accountName}</p>
                <p className="text-[10px] text-muted-foreground/60 mt-0.5 truncate">{contact.warmPath}</p>
              </div>
              {added ? (
                <div className="flex items-center gap-1 text-emerald-600 text-xs font-medium shrink-0">
                  <Check className="h-3.5 w-3.5" />
                  Added
                </div>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  className="shrink-0 h-7 text-xs gap-1 px-2"
                  onClick={() => onAddContact(contact.id)}
                >
                  <Plus className="h-3 w-3" />
                  Add to map
                </Button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

