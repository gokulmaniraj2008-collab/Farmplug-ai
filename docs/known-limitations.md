# Known Limitations

- The current SIH build is a prototype, not a production marketplace.
- AI assistant output depends on Gemini availability and server configuration.
- Demand and FreshLife intelligence require real-world datasets and evaluation before commercial use.
- Buyer matching is prototype logic and does not guarantee a transaction.
- Logistics uses external geocoding/routing services and can fail or rate-limit.
- Full authenticated Farmer → Buyer → Quote → Order → Logistics flow still needs real-user end-to-end execution evidence.
- Mobile/PWA behavior still needs real Android device verification at common phone widths.
- The connected Supabase project contains other application tables/functions; FarmPlug database security should be isolated before production.
