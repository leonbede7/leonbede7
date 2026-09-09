# Automobili Galerija

**Turning dealership operations into a public catalog and an AI-assisted back office.**

[Visit the public product](https://automobili-galerija.hr/) · [Back to portfolio](../README.md)

[Read the visual case study](https://leonbede7.github.io/leonbede7/work/galerija/) for public product screenshots, a conceptual data flow and the decisions behind the interface.

## Why this project

My dad has always worked with cars and owns a dealership. I grew up around that world and inherited the same interest. As a programming student, I was also fascinated by AI and what it could make possible.

Galerija brought those interests together. Building it taught me about product design, functionality, CRM and security through the needs of a real business. The part I am proudest of is having a practical reason to build: making the dealership's everyday work easier to manage and improve.

## The problem

A small used-car dealership handles inventory, inquiries, trade-ins, pricing context, and marketplace publication. Vehicle information arrives in reports, advertisements, and notes. The same facts need to be structured, checked, and reused across different workflows.

I shaped the product around a central vehicle record, a public buying experience, and a protected administration area. The goal was to make the operating workflow coherent while keeping customer and internal data behind an access boundary.

## My contribution

I supplied the dealership context, defined the workflows and acceptance criteria, directed AI-assisted implementation, reviewed the resulting behavior, and iterated on usability and delivery decisions. AI generated much of the implementation. My contribution is product ownership and the work of turning generated pieces into a usable system; this is not a claim that I manually wrote every line.

## What the product includes

| Workflow | Implemented capability | Evidence available publicly |
| --- | --- | --- |
| Vehicle discovery | Public catalog, filters, vehicle details, comparison and saved vehicles | [Live site](https://automobili-galerija.hr/) |
| Customer inquiries and trade-ins | Public forms connected to protected operating workflows | Public entry points; private records are excluded |
| Inventory preparation | AI-assisted extraction into structured vehicle data, followed by review | Described here; application code and admin data remain private |
| Customer communication | Draft replies informed by inquiry and vehicle context | Workflow description; drafts require human review |
| Pricing and publication | Market-comparison valuation and marketplace-feed generation | Implemented capabilities; external onboarding is a separate dependency |
| Quality | Automated checks, tests, accessibility checks, and access controls | Repository evidence was reviewed privately; this page does not claim a fresh passing CI run |

## Three decisions that shaped the system

### 1. Separate public browsing from protected operations

Customers need a fast catalog. Staff need authenticated workflows that change business records. Separating these experiences clarified the interface, data access, and responsibilities of each part of the application.

### 2. Treat generated data as a candidate

AI helps structure vehicle information and draft replies. Validation and human review sit between generated output and an operating decision. A plausible response is useful input, not enough evidence to publish or send it automatically.

### 3. Reuse the central record

Inventory, listing content, and marketplace feeds work from structured vehicle data. This is intended to reduce inconsistent re-entry. I do not yet have a measured time-saving result to report.

## Stack

Next.js, React, TypeScript, Tailwind CSS, Supabase/Postgres, authentication and storage, DeepSeek-assisted extraction and drafts, market-comparison integration, transactional email, Vercel, monitoring, and automated checks.

The implementation evolved after the original academic project. This summary uses the current career dossier and repository documentation reviewed in September 2026, not historical provider names from the thesis.

## Results and limits

The public product and documented operational capabilities exist. Improvements in listing speed, lead handling, sales, traffic, and time-to-sale are intended effects, not measured results. Feed generation also does not prove that every external marketplace is connected or actively distributing inventory.

The application is proprietary. This case study shares product-level decisions without publishing source code, customer records, internal screenshots, credentials, or private business data.

## Related public experiment

[Intake Eval](https://github.com/leonbede7/intake-eval) explores one general lesson from this work: how to validate and evaluate structured AI output before human review. It is a separate implementation using synthetic support cases, with no copied dealership code or records.
