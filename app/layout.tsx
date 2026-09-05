import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "./components/Sidebar";
import FarmPlugChatbot from "./components/FarmPlugChatbot";
import PWARegister from "./components/PWARegister";

export const metadata: Metadata = {
  title: "FarmPlug AI | Farm Intelligence to the Right Market",
  description: "Predictive agricultural market intelligence for Farmers and FPOs.",
  applicationName: "FarmPlug AI Farmer",
  icons: {
    icon: "/icons/farmplug-icon.svg",
    shortcut: "/icons/farmplug-icon.svg",
    apple: "/icons/farmplug-icon.svg",
  },
  appleWebApp: { capable: true, title: "FarmPlug AI Farmer", statusBarStyle: "default" },
};

const navigationStyles = `
:root{--sidebar-width:268px}
body{padding-left:0}
.desktopSidebar{position:fixed;left:0;top:0;bottom:0;width:var(--sidebar-width);z-index:130;background:rgba(255,255,255,.98);border-right:1px solid #dfe9e2;padding:22px 15px;display:flex;flex-direction:column;box-shadow:8px 0 35px rgba(16,37,26,.08);transform:translateX(-105%);transition:transform .22s ease}
.desktopSidebar.open{transform:translateX(0)}
.desktopMenuButton{position:fixed;display:grid;place-items:center;left:16px;top:16px;width:44px;height:44px;z-index:110;border:1px solid #dce8df;border-radius:13px;background:rgba(255,255,255,.97);color:#166534;box-shadow:0 8px 25px rgba(16,37,26,.12);cursor:pointer}
.sideBrand{display:flex;align-items:center;gap:11px;padding:3px 8px 22px;border-bottom:1px solid #e3ece5;margin-bottom:16px;min-width:0}.sideBrand>div:nth-child(2){display:flex;flex-direction:column;min-width:0}.sideBrand strong{font-family:'Space Grotesk';font-size:18px;color:#123d24}.sideBrand small{font-size:10px;color:#718077;margin-top:2px;white-space:nowrap}.sideLogo{width:40px;height:40px;display:block;border-radius:13px;overflow:hidden;flex:none;box-shadow:0 8px 20px rgba(22,101,52,.18)}.sideLogo img{display:block;width:100%;height:100%;object-fit:cover}
.sideNav{display:flex;flex-direction:column;gap:5px}.sideItem{display:flex;align-items:center;gap:12px;padding:11px 12px;border-radius:12px;color:#637168;text-decoration:none;font-size:13px;font-weight:650;transition:.18s ease}.sideItem:hover{background:#f1f7f2;color:#166534;transform:translateX(2px)}.sideItem.active{background:#eaf8ed;color:#166534;box-shadow:inset 3px 0 #166534}.sideFooter{margin-top:auto;padding:15px 9px 3px;color:#78847d;font-size:10px;line-height:1.6}.sideFooter span{color:#a0aaa4}.sideClose{margin-left:auto;width:38px;height:38px;display:grid;place-items:center;border:1px solid #e3ece5;border-radius:11px;background:#f7fbf7;color:#166534;cursor:pointer}.mobileSidebar,.mobileMenuButton,.sideOverlay{display:none}
.pageShell{min-height:100vh;padding:18px 15px 105px;max-width:1100px;margin:0 auto}.mobilePageHead{height:54px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;background:rgba(247,251,247,.94);backdrop-filter:blur(14px);z-index:20;border-bottom:1px solid #e3ece5;margin:0 -15px;padding:0 15px}.mobilePageHead>div{display:flex;flex-direction:column;text-align:center}.mobilePageHead span{font-size:11px;color:#64756a}.back{display:grid;place-items:center;width:38px;height:38px;border:1px solid #e3ece5;background:#fff;border-radius:12px;color:#166534}.pageHero{padding:38px 0 25px}.pageHero h1{font-family:'Space Grotesk';font-size:44px;line-height:1.02;margin:18px 0 12px}.pageHero p{color:#64756a;line-height:1.6}.pageCard{background:#fff;border:1px solid #e3ece5;border-radius:18px;padding:22px;margin:14px 0}.pageCard h2{font-family:'Space Grotesk';font-size:23px;display:flex;gap:9px;align-items:center;margin:0 0 12px}.full{width:100%;justify-content:center}.searchBox{display:flex;align-items:center;gap:9px;border:1px solid #e3ece5;border-radius:12px;padding:11px;background:#fff}.searchBox input{border:0;outline:0;width:100%;background:transparent}.mutedText{color:#64756a;font-size:13px;line-height:1.5}.pageResults{margin-top:14px}.status{display:inline-flex;align-items:center;gap:6px;background:#eaf8ed;color:#166534;padding:7px 10px;border-radius:999px;font-size:12px;font-weight:700}.miniGrid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:12px}.miniGrid>div,.statCard{background:#fff;border:1px solid #e3ece5;border-radius:15px;padding:17px}.miniGrid small,.statCard small{display:block;color:#64756a;font-size:10px;font-weight:700}.miniGrid strong{display:block;color:#166534;font-family:'Space Grotesk';font-size:22px;margin-top:7px}.dashboardGrid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:10px 0 15px}.statCard svg{color:#166534;margin-bottom:12px}.statCard strong{display:block;font-family:'Space Grotesk';font-size:25px;margin:6px 0}.statCard span{font-size:11px;color:#64756a}.kpiRow,.checkRow{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:14px 0;border-bottom:1px solid #e3ece5}.kpiRow span{font-size:11px;color:#64756a;text-align:right}.checkRow{justify-content:flex-start}.checkRow svg{color:#166534}.bottomNav{display:none}
@media(max-width:800px){body{padding-left:0;padding-bottom:0}.desktopSidebar,.desktopMenuButton{display:none}.mobileMenuButton{position:fixed;display:grid;place-items:center;left:12px;top:12px;width:42px;height:42px;z-index:110;border:1px solid #dce8df;border-radius:13px;background:rgba(255,255,255,.96);color:#166534;box-shadow:0 8px 25px rgba(16,37,26,.12)}.sideOverlay{position:fixed;display:block;inset:0;background:rgba(8,22,13,.38);z-index:125}.mobileSidebar{position:fixed;display:flex;flex-direction:column;left:0;top:0;bottom:0;width:min(84vw,330px);z-index:130;background:#fff;padding:20px 15px;box-shadow:15px 0 45px rgba(0,0,0,.16);transform:translateX(-105%);transition:transform .22s ease}.mobileSidebar.open{transform:translateX(0)}.mobileSidebar .sideBrand{padding-right:0}.mobilePageHead{padding-left:64px}.pageShell{max-width:760px;padding-bottom:30px}.bottomNav{display:none}.sideFooter{padding-bottom:8px}}
@media(max-width:480px){.pageHero h1{font-size:40px}.miniGrid,.dashboardGrid{grid-template-columns:1fr 1fr}}
`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><PWARegister /><Sidebar />{children}<FarmPlugChatbot /><style dangerouslySetInnerHTML={{__html: navigationStyles}} /></body></html>;
}
