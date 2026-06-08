# Security Policy

## Supported versions

| Version | Supported |
| ------- | --------- |
| 0.1.x   | Yes       |

## Reporting a vulnerability

Please **do not** open a public GitHub issue for security problems.

Report privately via [GitHub Security Advisories](https://github.com/NicholasMendez11/renamix/security/advisories/new) or email the maintainer through [ngmb.dev](https://www.ngmb.dev/).

For non-security bugs and feature requests, open a [regular issue](https://github.com/NicholasMendez11/renamix/issues/new).

## Threat model

renamix is a local CLI/TUI that renames files in folders you explicitly target. It does not run a network server and does not upload file contents.

### What we protect against

- Path traversal via crafted rollback logs (`../` in filenames)
- Renaming files outside the selected folder
- Following symbolic links during scans
- Invalid filename characters in generated names and prefixes

### What is out of scope

- Protecting you from renaming the wrong folder (user intent)
- Recovering from partial failures caused by external tools modifying files mid-run
- Malware scanning of file contents

## Safe usage

- Review the TUI preview before applying changes
- Keep rollback logs (`.renamix-log.json`) only in trusted folders
- Do not run rollback logs from untrusted sources
