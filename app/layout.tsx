import type { Metadata } from "next";
import "./globals.css";
import BottomNav from "./components/BottomNav";
import FarmPlugChatbot from "./components/FarmPlugChatbot";

export const metadata: Metadata = {
  title: "FarmPlug AI | Farm Intelligence to the Right Market",
  description: "Predictive agricultural market intelligence for Farmers and FPOs.",
};

const mobileStyles = `
.pageShell{min-height:100vh;padding:18px 15px 105px;max-width:760px;margin:0 auto}.mobilePageHead{height:54px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;background:rgba(247,251,247,.94);backdrop-filter:blur(14px);z-index:20;border-bottom:1px solid #e3ece5;margin:0 -15px;padding:0 15px}.mobilePageHead>div{display:flex;flex-direction:column;text-align:center}.mobilePageHead span{font-size:11px;color:#64756a}.back{display:grid;place-items:center;width:38px;height:38px;border:1px solid #e3ece5;background:#fff;border-radius:12px;color:#166534}.pageHero{padding:38px 0 25px}.pageHero h1{font-family:'Space Grotesk';font-size:44px;line-height:1.02;margin:18px 0 12px}.pageHero p{color:#64756a;line-height:1.6}.pageCard{background:#fff;border:1px solid #e3ece5;border-radius:18px;padding:22px;margin:14px 0}.pageCard h2{font-family:'Space Grotesk';font-size:23px;display:flex;gap:9px;align-items:center;margin:0 0 12px}.full{width:100%;justify-content:center}.searchBox{display:flex;align-items:center;gap:9px;border:1px solid #e3ece5;border-radius:12px;padding:11px;background:#fff}.searchBox input{border:0;outline:0;width:100%;background:transparent}.mutedText{color:#64756a;font-size:13px;line-height:1.5}.pageResults{margin-top:14px}.status{display:inline-flex;align-items:center;gap:6px;background:#eaf8ed;color:#166534;padding:7px 10px;border-radius:999px;font-size:12px;font-weight:700}.miniGrid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:12px}.miniGrid>div,.statCard{background:#fff;border:1px solid #e3ece5;border-radius:15px;padding:17px}.miniGrid small,.statCard small{display:block;color:#64756a;font-size:10px;font-weight:700}.miniGrid strong{display:block;color:#166534;font-family:'Space Grotesk';font-size:22px;margin-top:7px}.dashboardGrid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:10px 0 15px}.statCard svg{color:#166534;margin-bottom:12px}.statCard strong{display:block;font-family:'Space Grotesk';font-size:25px;margin:6px 0}.statCard span{font-size:11px;color:#64756a}.kpiRow,.checkRow{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:14px 0;border-bottom:1px solid #e3ece5}.kpiRow span{font-size:11px;color:#64756a;text-align:right}.checkRow{justify-content:flex-start}.checkRow svg{color:#166534}.bottomNav{display:none}
@media(max-width:800px){.bottomNav{position:fixed;display:flex;left:10px;right:10px;bottom:10px;height:66px;z-index:100;background:rgba(255,255,255,.96);backdrop-filter:blur(18px);border:1px solid #dce8df;border-radius:20px;box-shadow:0 12px 40px rgba(16,37,26,.16);justify-content:space-around;padding:6px}.bottomItem{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;color:#738077;text-decoration:none;font-size:10px;font-weight:600;border-radius:15px}.bottomItem.active{color:#166534;background:#eaf8ed}.bottomItem:active{transform:scale(.96)}body{padding-bottom:86px}}
@media(max-width:480px){.pageHero h1{font-size:40px}.miniGrid,.dashboardGrid{grid-template-columns:1fr 1fr}}
`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}<FarmPlugChatbot /><BottomNav /><style dangerouslySetInnerHTML={{__html: mobileStyles}} /></body></html>;
}
