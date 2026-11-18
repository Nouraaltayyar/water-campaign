# Aghla Min Al-Dhahab — Water Conservation Awareness Website

A responsive, Arabic (RTL) awareness website for a university water-conservation campaign, with user accounts and an admin dashboard for managing content.

**Live demo:** https://nouraaltayyar.github.io/water-campaign/

> Built for a friend's university campaign project. The visual identity (logo, color palette, typography) comes from the campaign team's brand guide; the design implementation and all code are mine.

## Features

-o/water-campaign/

> sign up with name, phone number, email, and password; log in / log out.
-e, Arabic (RTL) awarenesadmin accounts are created manually, and admin permissions are enforced by database security rules, not only in the UI.
-ty water-conservation add and delete posts (guidelines, tips, news, facts) with optional images, and edit the homepage title and intro text.
-ity water-conservation posts with category filters.
-Conservation Awareness Wmobile-first RTL layout, with automatic dark mode.
- Website

A responsive, colors, Cairo font, and logo implemented from the campaign's identity guide.

## Tech Stack

- HTML5, CSS3 (custom properties, grid, flexbox), vanilla JavaScript (no build step)
- Firebase Authentication (email/password)
- Firebase Realtime Database
- GitHub Pages (static hosting)

## Architecture
end's university campaign project. The visual identity (logo, color palette, typography) comes from the campaign team's brand guide; the design implementation and all code are mine.

## Features

- **Authentication:** sign up with name, phone number, email, and password; log in / log out.
- **Role-based access:** admin accounts are created manually, and admin permissions are enforced by database security rules
- The Firebase SDK is loaded on demand, so the UI still renders if the connection fails.
- Images are resized and compressed in the browser (canvas) before being stored, to stay within free-tier limits.
