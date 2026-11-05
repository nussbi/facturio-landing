# Security

This repository contains **no credentials**. The landing page and blog generator are static/offline tooling.

## ⚠️ Credential rotation required

The `hermesbackup` snapshot this repo was recovered from contained live credentials in plaintext `.env` files (Cloudflare, R2, Resend, NVIDIA, xAI, Explee, OpenSEO, Telegram). Those files were **excluded** here, but the values must be treated as **compromised** and rotated. See the rotation table in the `facturio` repository's `SECURITY.md`.

## Reporting a vulnerability

Email **security@facturio.ch**.
