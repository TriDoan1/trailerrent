"use client";

import { useState } from "react";
import { ChevronDown, Clock3, Mail, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";

const values = [
  {
    title: "Practical recommendations",
    body: "We match renters with the smallest trailer that safely fits the job, not the biggest ticket.",
  },
  {
    title: "Fast pickup handoff",
    body: "Every trailer is staged with the right hitch size, safety check, and return instructions before you arrive.",
  },
  {
    title: "Job-ready equipment",
    body: "We focus on trailers people actually use for moves, landscaping, construction, and camping weekends.",
  },
];

const faqs = [
  {
    question: "Do I need a special license?",
    answer:
      "No special license is required for the trailers on this site, but you do need a valid driver license and a tow vehicle rated for the trailer you pick.",
  },
  {
    question: "What hitch do I need?",
    answer:
      "Each trailer card and detail page lists the hitch type and exact ball size. Bring a compatible receiver, working lights, and the correct connector.",
  },
  {
    question: "What if I return late?",
    answer:
      "We offer a short grace period for traffic, but extended late returns are billed by the hour or day depending on the trailer. Call ahead if timing changes.",
  },
  {
    question: "Is insurance included?",
    answer:
      "Base pricing does not include optional protection. You can add basic or premium coverage during booking if you want extra roadside and damage protection.",
  },
  {
    question: "How do I pick up and return the trailer?",
    answer:
      "Your confirmation includes the pickup address, gate code, hours, and a return checklist. The My Rentals dashboard mirrors those same details after booking.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept major credit cards, Apple Pay, Google Pay, and approved commercial accounts for repeat business customers.",
  },
];

type FormState = {
  name: string;
  email: string;
  message: string;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

export default function AboutPage() {
  const [openFaq, setOpenFaq] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [formState, setFormState] = useState<FormState>({
    name: "",
    email: "",
    message: "",
  });

  function updateField(field: keyof FormState, value: string) {
    setFormState((current) => ({ ...current, [field]: value }));
    setErrors((current) => {
      if (!current[field]) {
        return current;
      }
      const next = { ...current };
      delete next[field];
      return next;
    });
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors: FormErrors = {};

    if (!formState.name.trim()) {
      nextErrors.name = "Name is required.";
    }
    if (!formState.email.trim()) {
      nextErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formState.email.trim())) {
      nextErrors.email = "Enter a valid email address.";
    }
    if (!formState.message.trim()) {
      nextErrors.message = "Message is required.";
    } else if (formState.message.trim().length < 20) {
      nextErrors.message = "Add a little more detail so we can help.";
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setSubmitted(false);
      return;
    }

    setSubmitted(true);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-orange-500">
            About TrailerRent
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-navy-900 sm:text-5xl">
            Built for Portland renters who need a trailer that works the first time.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-gray-600">
            TrailerRent started in 2019 after too many frustrating hardware-store
            rentals and last-minute towing surprises. We built a tighter local
            operation: clear specs, realistic pricing, fast pickup, and trailers that
            are staged for actual moving, jobsite, and weekend use.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {values.map((value) => (
              <div key={value.title} className="rounded-3xl bg-gray-50 p-5">
                <h2 className="text-lg font-bold text-navy-900">{value.title}</h2>
                <p className="mt-2 text-sm leading-6 text-gray-600">{value.body}</p>
              </div>
            ))}
          </div>
        </div>

        <Card className="rounded-[2rem] overflow-hidden p-0">
          <div className="aspect-[4/3] bg-linear-to-br from-navy-900 via-navy-700 to-orange-500 p-8 text-white">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-orange-100">
              Location
            </p>
            <h2 className="mt-3 text-3xl font-bold">SE Portland pickup yard</h2>
            <p className="mt-4 max-w-sm text-sm leading-7 text-orange-100">
              Static map placeholder for 8240 SE Powell Blvd. The yard is positioned
              for quick access to I-205, downtown moves, and eastside job sites.
            </p>
            <div className="mt-8 rounded-[1.5rem] border border-white/20 bg-white/10 p-5 backdrop-blur-sm">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-orange-100">
                    Hours
                  </p>
                  <p className="mt-2 text-sm">Mon-Fri 7am-6pm</p>
                  <p className="text-sm">Sat 8am-4pm</p>
                  <p className="text-sm">Sun 9am-2pm</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-orange-100">
                    Best for
                  </p>
                  <p className="mt-2 text-sm">Moves</p>
                  <p className="text-sm">Construction runs</p>
                  <p className="text-sm">Weekend camping pickups</p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </section>

      <section className="mt-10 grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
        <Card className="rounded-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-500">
            Contact details
          </p>
          <div className="mt-5 space-y-5 text-sm text-gray-600">
            <div className="flex items-start gap-3">
              <Phone className="mt-0.5 h-5 w-5 text-orange-500" />
              <div>
                <p className="font-semibold text-navy-900">(503) 555-0172</p>
                <p>Call for same-day availability or tow-fit questions.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Mail className="mt-0.5 h-5 w-5 text-orange-500" />
              <div>
                <p className="font-semibold text-navy-900">hello@trailerrent.com</p>
                <p>We usually reply within one business day.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-5 w-5 text-orange-500" />
              <div>
                <p className="font-semibold text-navy-900">
                  8240 SE Powell Blvd, Portland, OR 97206
                </p>
                <p>Pickup yard with on-site brake-light and coupler checks.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock3 className="mt-0.5 h-5 w-5 text-orange-500" />
              <div>
                <p className="font-semibold text-navy-900">Business hours</p>
                <p>Mon-Fri 7am-6pm, Sat 8am-4pm, Sun 9am-2pm</p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="rounded-3xl">
          <div id="contact">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-500">
              Contact form
            </p>
            <h2 className="mt-2 text-2xl font-bold text-navy-900">
              Ask about availability, business accounts, or the right trailer for the job
            </h2>

            <form className="mt-6 space-y-4" onSubmit={handleSubmit} noValidate>
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Name"
                  value={formState.name}
                  onChange={(event) => updateField("name", event.target.value)}
                  error={errors.name}
                  placeholder="Taylor Morgan"
                />
                <Input
                  label="Email"
                  type="email"
                  value={formState.email}
                  onChange={(event) => updateField("email", event.target.value)}
                  error={errors.email}
                  placeholder="taylor@example.com"
                />
              </div>

              <div>
                <label
                  htmlFor="contact-message"
                  className="mb-1 block text-sm font-medium text-gray-900"
                >
                  Message
                </label>
                <textarea
                  id="contact-message"
                  value={formState.message}
                  onChange={(event) => updateField("message", event.target.value)}
                  rows={6}
                  className={`w-full rounded-lg border px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                    errors.message ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="I need a trailer for a Friday furniture move and want to confirm whether my SUV can tow it."
                />
                {errors.message ? (
                  <p className="mt-1 text-sm text-red-500">{errors.message}</p>
                ) : null}
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <Button type="submit">Send message</Button>
                {submitted ? (
                  <p className="text-sm font-medium text-green-500">
                    Message validated. This mock form does not submit to a backend.
                  </p>
                ) : (
                  <p className="text-sm text-gray-400">
                    Client-side validation only for this prototype.
                  </p>
                )}
              </div>
            </form>
          </div>
        </Card>
      </section>

      <section id="faq" className="mt-10">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-500">
          FAQ
        </p>
        <h2 className="mt-2 text-2xl font-bold text-navy-900">
          Common questions before pickup day
        </h2>

        <div className="mt-6 grid gap-3">
          {faqs.map((faq, index) => {
            const open = openFaq === index;
            return (
              <button
                key={faq.question}
                type="button"
                onClick={() => setOpenFaq(open ? -1 : index)}
                aria-expanded={open}
                className="rounded-3xl border border-gray-100 bg-white p-5 text-left shadow-sm transition-colors hover:border-orange-500"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-lg font-semibold text-navy-900">{faq.question}</p>
                  <ChevronDown
                    className={`h-5 w-5 text-orange-500 transition-transform ${
                      open ? "rotate-180" : ""
                    }`}
                  />
                </div>
                {open ? (
                  <p className="mt-3 max-w-3xl text-sm leading-7 text-gray-600">
                    {faq.answer}
                  </p>
                ) : null}
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
