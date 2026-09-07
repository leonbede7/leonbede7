# Intake Eval

**A reproducible code sample for the boundary between AI output and human action.**

[Source and run instructions](https://github.com/leonbede7/intake-eval) · [Back to portfolio](../README.md)

## Problem

A support-triage model can produce JSON that looks convincing but has missing fields, invented evidence, or an inappropriate priority. A team needs checks that are explicit, repeatable, and honest about their limits.

## Current implementation

The TypeScript prototype accepts source text and candidate JSON, checks the schema, matches evidence quotes exactly, and returns rejection issues or a human-review queue. A synthetic fixture runner compares outcomes with expected decisions and fails when behavior changes unexpectedly.

The command-line demo runs on Node.js 24 without runtime packages, model credentials, or network calls. Strict type checks, behavior tests, CLI tests, and a GitHub Actions workflow support reproducibility.

## An intentional limitation

One fixture contains a false summary with a real quote. The harness allows it through to human review because exact quote matching cannot establish semantic correctness. Keeping that case visible is more useful than implying that schema validation solves hallucination.

## Authorship and status

This is a new portfolio prototype built with Codex assistance. The initial code, tests, and documentation were generated with AI assistance. It has no production users, live model adapter, measured model accuracy, or claimed business impact.

The next useful step is an independently labeled dataset and a live provider experiment. That will make it possible to report actual failure rates instead of treating synthetic regression results as model performance.
