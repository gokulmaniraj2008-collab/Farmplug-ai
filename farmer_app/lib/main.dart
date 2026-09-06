import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';

const farmPlugUrl = 'https://farmplugaisxd.vercel.app';
const forest = Color(0xFF0F2A1E);
const green = Color(0xFF1B4332);
const gold = Color(0xFFC9A227);
const cream = Color(0xFFF7F8F2);
const muted = Color(0xFF5F6B63);

void main() => runApp(const FarmPlugApp());

class FarmPlugApp extends StatelessWidget {
  const FarmPlugApp({super.key});
  @override
  Widget build(BuildContext context) => MaterialApp(
        debugShowCheckedModeBanner: false,
        title: 'FarmPlug AI',
        theme: ThemeData(
          useMaterial3: true,
          scaffoldBackgroundColor: cream,
          colorScheme: ColorScheme.fromSeed(seedColor: green, brightness: Brightness.light),
          fontFamily: 'sans',
          inputDecorationTheme: const InputDecorationTheme(
            filled: true, fillColor: Colors.white, border: OutlineInputBorder(
              borderRadius: BorderRadius.all(Radius.circular(14)), borderSide: BorderSide.none,
            ),
          ),
        ),
        home: const SplashPage(),
      );
}

Future<void> openWebsite(BuildContext context, [String path = '']) async {
  final ok = await launchUrl(Uri.parse('$farmPlugUrl$path'), mode: LaunchMode.externalApplication);
  if (!ok && context.mounted) {
    ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Unable to open FarmPlug')));
  }
}

class SplashPage extends StatefulWidget {
  const SplashPage({super.key});
  @override State<SplashPage> createState() => _SplashState();
}
class _SplashState extends State<SplashPage> {
  @override void initState() { super.initState(); Future.delayed(const Duration(milliseconds: 1400), () { if (!mounted) return; Navigator.pushReplacement(context, MaterialPageRoute(builder: (_) => const WelcomePage())); }); }
  @override Widget build(BuildContext context) => const Scaffold(backgroundColor: forest, body: Center(child: Column(mainAxisSize: MainAxisSize.min, children: [Icon(Icons.eco_rounded, color: gold, size: 76), SizedBox(height: 18), Text('FARMPLUG AI', style: TextStyle(color: Colors.white, fontSize: 28, fontWeight: FontWeight.w900, letterSpacing: 1)), SizedBox(height: 8), Text('From Farm Intelligence to the Right Market.', textAlign: TextAlign.center, style: TextStyle(color: Colors.white70, fontSize: 13)), SizedBox(height: 24), SizedBox(width: 28, height: 28, child: CircularProgressIndicator(strokeWidth: 2, color: gold))]));
}

class WelcomePage extends StatelessWidget {
  const WelcomePage({super.key});
  @override Widget build(BuildContext context) => Scaffold(
        backgroundColor: forest,
        body: SafeArea(child: Padding(padding: const EdgeInsets.all(22), child: Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
          const Spacer(),
          const Icon(Icons.agriculture_rounded, color: gold, size: 68),
          const SizedBox(height: 20),
          const Text('From Farm Intelligence\nto the Right Market.', textAlign: TextAlign.center, style: TextStyle(color: Colors.white, fontSize: 31, height: 1.08, fontWeight: FontWeight.w900)),
          const SizedBox(height: 14),
          const Text('One connected FarmPlug AI ecosystem for farmers, FPOs and buyers.', textAlign: TextAlign.center, style: TextStyle(color: Colors.white70, height: 1.5)),
          const SizedBox(height: 30),
          _GlassCard(child: Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: const [
            _FlowRow(icon: Icons.eco_rounded, text: 'Farm data'), _FlowRow(icon: Icons.auto_graph_rounded, text: 'Market intelligence'), _FlowRow(icon: Icons.handshake_rounded, text: 'Buyer matching'), _FlowRow(icon: Icons.local_shipping_rounded, text: 'Order & logistics'),
          ])),
          const SizedBox(height: 22),
          FilledButton(onPressed: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const AppFlowPage())), child: const Padding(padding: EdgeInsets.symmetric(vertical: 5), child: Text('Start FarmPlug', style: TextStyle(fontWeight: FontWeight.w800)))),
          const SizedBox(height: 10),
          OutlinedButton(onPressed: () => openWebsite(context, '/signin'), style: OutlinedButton.styleFrom(foregroundColor: Colors.white, side: const BorderSide(color: Colors.white30)), child: const Text('Sign in / Create account')),
          const SizedBox(height: 10),
          TextButton(onPressed: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const DemoPage())), child: const Text('Try a Demo', style: TextStyle(color: gold, fontWeight: FontWeight.w800))),
          const Spacer(),
          const Text('DEMO DATA IS ALWAYS LABELLED', textAlign: TextAlign.center, style: TextStyle(color: Colors.white38, fontSize: 10, fontWeight: FontWeight.w800, letterSpacing: 1)),
        ]))),
      );
}

class _FlowRow extends StatelessWidget { final IconData icon; final String text; const _FlowRow({required this.icon, required this.text}); @override Widget build(BuildContext c) => Padding(padding: const EdgeInsets.symmetric(vertical: 7), child: Row(children: [Icon(icon, color: gold, size: 21), const SizedBox(width: 12), Expanded(child: Text(text, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w700))), const Icon(Icons.arrow_forward_rounded, color: Colors.white38, size: 18)])); }
class _GlassCard extends StatelessWidget { final Widget child; const _GlassCard({required this.child}); @override Widget build(BuildContext c) => Container(padding: const EdgeInsets.all(17), decoration: BoxDecoration(color: Colors.white.withOpacity(.10), borderRadius: BorderRadius.circular(20), border: Border.all(color: Colors.white.withOpacity(.18))), child: child); }

const pages = <String>[
  'Onboarding','Farm Setup','Sign In','Sign Up','Google Login','Role Selection','Profile Completion','Farmer Home','My Farm','Crops','Crop Details','Crop Health','Farm Intelligence','AI Decision Center','FarmPlug Intelligence','Market','Buyer Marketplace','Buyer Details','Add Produce','My Listings','Listing Details','Buyer Matches','Offers','Offer Details','Accept Offer','Orders','Order Details','Order Tracking','Aggregation','Aggregation Details','Collection Center','Logistics','Delivery Details','Notifications','Profile','Settings','Language','Security','Help','Logout Confirmation','Demo Role Selection','Demo Workspace','Error','Offline','Empty State Screens'
];

class AppFlowPage extends StatefulWidget { const AppFlowPage({super.key}); @override State<AppFlowPage> createState() => _FlowState(); }
class _FlowState extends State<AppFlowPage> {
  int index = 0;
  @override Widget build(BuildContext context) {
    final title = pages[index];
    final isAi = title.contains('Intelligence') || title.contains('Decision');
    final isDemo = title.contains('Demo');
    return Scaffold(
      appBar: AppBar(backgroundColor: forest, foregroundColor: Colors.white, title: Text(title, style: const TextStyle(fontWeight: FontWeight.w800)), leading: index > 0 ? IconButton(icon: const Icon(Icons.arrow_back), onPressed: () => setState(() => index--)) : null),
      body: SafeArea(child: Column(children: [
        LinearProgressIndicator(value: (index + 1) / pages.length, minHeight: 3, backgroundColor: Colors.white, color: gold),
        Expanded(child: ListView(padding: const EdgeInsets.all(18), children: [
          if (isDemo) const _Badge(text: 'DEMO MODE'),
          _HeroCard(title: title, ai: isAi),
          if (isAi) const _TrustCard(),
          ..._cards(title),
          if (title == 'Sign In' || title == 'Sign Up' || title == 'Google Login') _WebsiteAction(onTap: () => openWebsite(context, '/signin')),
        ])),
        Padding(padding: const EdgeInsets.fromLTRB(18, 8, 18, 14), child: Row(children: [if (index > 0) Expanded(child: OutlinedButton(onPressed: () => setState(() => index--), child: const Text('Back'))), if (index > 0) const SizedBox(width: 10), Expanded(child: FilledButton(onPressed: () { if (index == pages.length - 1) { Navigator.pop(context); } else { setState(() => index++); } }, child: Text(index == pages.length - 1 ? 'Finish' : 'Next')))])),
      ])),
      bottomNavigationBar: _BottomNav(current: index),
    );
  }

  List<Widget> _cards(String title) {
    final data = title == 'Buyer Matches' ? ['Match score 92%', 'Grade A • 1,200 kg', 'Delivery: estimated', 'Why this match: quantity + quality + location'] : title == 'Orders' || title == 'Order Tracking' ? ['Quote Pending → Accepted → Confirmed', 'Collecting → Pickup → Transit', 'Delivered → Completed', 'PAYMENT SIMULATION • ESTIMATED LOGISTICS'] : title == 'Aggregation' ? ['1,200 kg + 1,800 kg + 2,000 kg = 5,000 kg', 'Participating farmers', 'Lot traceability', 'Collection center'] : ['Farm profile', 'Crop information', 'Market & buyer information', 'Status and next action'];
    return data.map((x) => Card(elevation: 0, shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18), side: const BorderSide(color: Color(0xFFD9E2DA))), child: ListTile(leading: Icon(_iconFor(x), color: x.contains('92') ? gold : green), title: Text(x, style: const TextStyle(fontWeight: FontWeight.w700)), trailing: const Icon(Icons.chevron_right_rounded))).toList();
  }
  IconData _iconFor(String x) { if (x.contains('Market') || x.contains('buyer')) return Icons.storefront_rounded; if (x.contains('kg')) return Icons.scale_rounded; if (x.contains('logistics') || x.contains('Transit')) return Icons.local_shipping_rounded; if (x.contains('Farm')) return Icons.agriculture_rounded; return Icons.check_circle_outline_rounded; }
}

class _HeroCard extends StatelessWidget { final String title; final bool ai; const _HeroCard({required this.title, required this.ai}); @override Widget build(BuildContext c) => Container(margin: const EdgeInsets.only(bottom: 14), padding: const EdgeInsets.all(19), decoration: BoxDecoration(color: ai ? forest : Colors.white, borderRadius: BorderRadius.circular(20), boxShadow: const [BoxShadow(blurRadius: 20, color: Color(0x120F2A1E))]), child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [Icon(ai ? Icons.auto_awesome_rounded : Icons.eco_rounded, color: ai ? gold : green, size: 32), const SizedBox(height: 13), Text(title, style: TextStyle(color: ai ? Colors.white : forest, fontSize: 22, fontWeight: FontWeight.w900)), const SizedBox(height: 6), Text('Focused, touch-friendly FarmPlug workflow with clear status and next action.', style: TextStyle(color: ai ? Colors.white70 : muted, height: 1.45))])); }
class _TrustCard extends StatelessWidget { const _TrustCard(); @override Widget build(BuildContext c) => Container(margin: const EdgeInsets.only(bottom: 14), padding: const EdgeInsets.all(16), decoration: BoxDecoration(color: const Color(0xFFEAF2E9), borderRadius: BorderRadius.circular(18), border: Border.all(color: const Color(0xFFD1E1D4))), child: const Column(crossAxisAlignment: CrossAxisAlignment.start, children: [Text('RECOMMENDATION', style: TextStyle(color: green, fontWeight: FontWeight.w900, fontSize: 11)), SizedBox(height: 6), Text('Consider the recommended selling window.', style: TextStyle(fontWeight: FontWeight.w800)), SizedBox(height: 9), Text('WHY • market signals and farm context', style: TextStyle(color: muted, fontSize: 12)), Text('CONFIDENCE • DATA STATUS • REVIEW DETAILS', style: TextStyle(color: muted, fontSize: 12))])); }
class _Badge extends StatelessWidget { final String text; const _Badge({required this.text}); @override Widget build(BuildContext c) => Container(margin: const EdgeInsets.only(bottom: 12), padding: const EdgeInsets.symmetric(horizontal: 11, vertical: 7), decoration: BoxDecoration(color: const Color(0xFFFFF5D6), borderRadius: BorderRadius.circular(99)), child: Text(text, style: const TextStyle(color: Color(0xFF8A6A00), fontWeight: FontWeight.w900, fontSize: 11))); }
class _WebsiteAction extends StatelessWidget { final VoidCallback onTap; const _WebsiteAction({required this.onTap}); @override Widget build(BuildContext c) => Padding(padding: const EdgeInsets.only(top: 8), child: OutlinedButton.icon(onPressed: onTap, icon: const Icon(Icons.open_in_new_rounded), label: const Text('Continue on FarmPlug website'))); }
class _BottomNav extends StatelessWidget { final int current; const _BottomNav({required this.current}); @override Widget build(BuildContext c) => NavigationBar(selectedIndex: current % 5, destinations: const [NavigationDestination(icon: Icon(Icons.home_rounded), label: 'Home'), NavigationDestination(icon: Icon(Icons.storefront_rounded), label: 'Market'), NavigationDestination(icon: Icon(Icons.auto_awesome_rounded), label: 'AI'), NavigationDestination(icon: Icon(Icons.receipt_long_rounded), label: 'Orders'), NavigationDestination(icon: Icon(Icons.person_rounded), label: 'Profile')]); }

class DemoPage extends StatelessWidget { const DemoPage({super.key}); @override Widget build(BuildContext c) => Scaffold(backgroundColor: forest, appBar: AppBar(backgroundColor: forest, foregroundColor: Colors.white, title: const Text('Demo Workspace')), body: Padding(padding: const EdgeInsets.all(20), child: Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [const _Badge(text: 'DEMO MODE'), const SizedBox(height: 18), const Text('Explore a safe simulated FarmPlug workspace.', style: TextStyle(color: Colors.white, fontSize: 25, fontWeight: FontWeight.w900)), const SizedBox(height: 14), const Text('DEMO DATA • SIMULATED FORECAST • ESTIMATED LOGISTICS • PAYMENT SIMULATION', style: TextStyle(color: Colors.white70, height: 1.5)), const Spacer(), FilledButton(onPressed: () => Navigator.push(c, MaterialPageRoute(builder: (_) => const AppFlowPage())), child: const Text('Open Demo Workspace')), OutlinedButton(onPressed: () => openWebsite(c, '/demo'), style: OutlinedButton.styleFrom(foregroundColor: Colors.white, side: const BorderSide(color: Colors.white30)), child: const Text('Open web demo'))])); }
