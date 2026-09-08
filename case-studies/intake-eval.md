# Intake Eval

**A reproducible code sample for the boundary between AI output and human action.**

[Try the playground](https://leonbede7.github.io/intake-eval/) · [Source and run instructions](https://github.com/leonbede7/intake-eval) · [Back to portfolio](../README.md)

## Problem

A support-triage model can produce JSON that looks convincing but has missing fields, invented evidence, or an inappropriate priority. A team needs checks that are explicit, repeatable, and honest about their limits.

## Current implementation

The TypeScript prototype accepts source text and candidate JSON, checks the schema, matches evidence quotes exactly, and returns rejection issues or a human-review queue. A synthetic fixture runner compares outcomes with expected decisions and fails when behavior changes unexpectedly.

The default command-line demos run on Node.js 24 without runtime packages, model credentials, or network calls. Opt-in DeepSeek and local Ollama adapters support real model runs. Reports separate output validation, category and priority mismatches, escalation misses, and false positives. Strict type checks, behavior tests, CLI tests, and a GitHub Actions workflow support reproducibility.

## First live experiment

A [published 16-case DeepSeek run](https://github.com/leonbede7/intake-eval/tree/main/docs/results/deepseek-2026-09-07) matched 15/16 category labels and 16/16 priority labels, with no invalid outputs. The combined workflow nevertheless missed a Croatian refund escalation and unnecessarily escalated a negated English refund request. Both failures came from the downstream keyword rule. An active-security category also disagreed with a provisional label and needs taxonomy clarification.

The dataset is AI-authored, synthetic and not independently human-validated. These counts describe one development run, not general model accuracy. The report preserves the prompt/dataset hashes, captured synthetic outputs, measured latency, and provider-reported token usage.

## Routing change and browser demo

A [follow-up comparison](https://github.com/leonbede7/intake-eval/blob/main/docs/routing-experiment.md) used 20 new synthetic cases frozen before implementing V2. V1 made five routing errors: one missed escalation and four unnecessary escalations. V2 matched all 20 provisional routing labels by separating urgency from the model's specialist-review reason and checking a supporting quote. This targeted development result is not independent evidence of general accuracy.

The public playground lets a reviewer switch policies, inspect captured DeepSeek outputs, edit the request or JSON, and see validation issues. It runs without credentials or paid calls. An optional loopback server supports live DeepSeek generation with request limits. Browser tests cover edits, policy changes, errors, mobile layout and HTML injection.

## An intentional limitation

One fixture contains a false summary with a real quote. The harness allows it through to human review because exact quote matching cannot establish semantic correctness. Keeping that case visible is more useful than implying that schema validation solves hallucination.

## Authorship and status

This is a portfolio prototype built with Codex assistance. The code, tests, dataset, and documentation were developed with AI assistance. It has no production users or claimed business impact. The live DeepSeek experiment was executed; the Ollama adapter has been tested against simulated API responses but not a running local model.

The next useful step is independent label review and a held-out evaluation of both policies, including the meaning of summaries and review reasons. The original baseline remains available.
