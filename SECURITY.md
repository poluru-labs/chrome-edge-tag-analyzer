# Security Policy

## Supported versions

| Version | Supported |
| --- | --- |
| 1.x | Yes |

## Reporting a vulnerability

Please **do not** open a public GitHub issue for security vulnerabilities.

Email **mail.polurus@gmail.com** with:

- A short description of the issue
- Steps to reproduce or a proof of concept
- Affected version(s)
- Any known impact

You should receive an acknowledgement within a few business days.

## Scope

In scope:

- Unexpected access to page content without a user click
- Leakage of page data off-device
- XSS via popup rendering of tag names or counts

Out of scope:

- Counting tags on a page you already control (that is the documented purpose)
- Restricted Chrome / Edge pages (`chrome://`, `edge://`, Web Store) where `scripting` cannot run

## Notes for reviewers

This is a developer tool. It counts HTML tag names on the **active tab** after the user clicks **Analyze Page**. Counts stay in the popup. It does not read form values or inject a persistent content script.
