import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';

void main() => runApp(const FarmPlugApp());

class FarmPlugApp extends StatelessWidget {
  const FarmPlugApp({super.key});
  @override
  Widget build(BuildContext context) => MaterialApp(
    debugShowCheckedModeBanner: false,
    title: 'FarmPlug AI',
    theme: ThemeData(useMaterial3: true, colorSchemeSeed: const Color(0xFF2E7D32)),
    home: const SplashPage(),
  );
}

const farmPlugSignIn = 'https://farmplugaisxd.vercel.app/signin';

Future<void> openFarmPlug(BuildContext context) async {
  final ok = await launchUrl(Uri.parse(farmPlugSignIn), mode: LaunchMode.externalApplication);
  if (!ok && context.mounted) ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Unable to open FarmPlug')));
}

class SplashPage extends StatefulWidget { const SplashPage({super.key}); @override State<SplashPage> createState() => _SplashPageState(); }
class _SplashPageState extends State<SplashPage> {
  @override void initState() { super.initState(); Future.delayed(const Duration(seconds: 2), () { if (mounted) Navigator.pushReplacement(context, MaterialPageRoute(builder: (_) => const WelcomePage())); }); }
  @override Widget build(BuildContext context) => const Scaffold(body: Center(child: Column(mainAxisSize: MainAxisSize.min, children: [Icon(Icons.agriculture_rounded, size: 76), SizedBox(height: 18), Text('FarmPlug AI', style: TextStyle(fontSize: 32, fontWeight: FontWeight.bold)), SizedBox(height: 20), CircularProgressIndicator()]));
}

class WelcomePage extends StatelessWidget {
  const WelcomePage({super.key});
  @override Widget build(BuildContext context) => Scaffold(body: SafeArea(child: Padding(padding: const EdgeInsets.all(24), child: Center(child: SingleChildScrollView(child: Column(children: [const Icon(Icons.agriculture_rounded, size: 80), const SizedBox(height: 20), const Text('Welcome to FarmPlug AI', textAlign: TextAlign.center, style: TextStyle(fontSize: 30, fontWeight: FontWeight.bold)), const SizedBox(height: 12), const Text('From farm intelligence to better markets.', textAlign: TextAlign.center), const SizedBox(height: 32), _button(context, 'Sign In'), _button(context, 'Create Account', outlined: true), _button(context, 'Continue with Google', outlined: true), TextButton(onPressed: () => openFarmPlug(context), child: const Text('Try a Demo'))]))))));
  Widget _button(BuildContext c, String text, {bool outlined = false}) => outlined ? OutlinedButton(onPressed: () => openFarmPlug(c), child: SizedBox(width: double.infinity, child: Padding(padding: const EdgeInsets.all(14), child: Text(text, textAlign: TextAlign.center)))) : FilledButton(onPressed: () => openFarmPlug(c), child: SizedBox(width: double.infinity, child: Padding(padding: const EdgeInsets.all(14), child: Text(text, textAlign: TextAlign.center))));
}
