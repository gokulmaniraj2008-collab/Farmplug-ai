import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

const webBase = String.fromEnvironment('FARMPLUG_WEB_URL', defaultValue: 'https://farmplugaisxd.vercel.app');

void main() => runApp(const FarmPlugApp());

class FarmPlugApp extends StatelessWidget {
  const FarmPlugApp({super.key});
  @override
  Widget build(BuildContext context) => MaterialApp(
    debugShowCheckedModeBanner: false,
    title: 'FarmPlug AI',
    theme: ThemeData(useMaterial3: true, colorSchemeSeed: Colors.green),
    home: const FarmerHome(),
  );
}

class FarmerHome extends StatefulWidget {
  const FarmerHome({super.key});
  @override State<FarmerHome> createState() => _FarmerHomeState();
}

class _FarmerHomeState extends State<FarmerHome> {
  int tab = 0;
  final pages = const [HomeTab(), ProduceTab(), DecisionTab(), OrdersTab()];
  @override
  Widget build(BuildContext context) => Scaffold(
    appBar: AppBar(title: const Text('FarmPlug AI'), centerTitle: false),
    body: pages[tab],
    bottomNavigationBar: NavigationBar(
      selectedIndex: tab,
      onDestinationSelected: (i) => setState(() => tab = i),
      destinations: const [
        NavigationDestination(icon: Icon(Icons.home_outlined), selectedIcon: Icon(Icons.home), label: 'Home'),
        NavigationDestination(icon: Icon(Icons.inventory_2_outlined), selectedIcon: Icon(Icons.inventory_2), label: 'Produce'),
        NavigationDestination(icon: Icon(Icons.auto_awesome_outlined), selectedIcon: Icon(Icons.auto_awesome), label: 'AI'),
        NavigationDestination(icon: Icon(Icons.receipt_long_outlined), selectedIcon: Icon(Icons.receipt_long), label: 'Orders'),
      ],
    ),
  );
}

class HomeTab extends StatelessWidget {
  const HomeTab({super.key});
  @override
  Widget build(BuildContext context) => ListView(padding: const EdgeInsets.all(16), children: [
    const Text('Welcome, Farmer', style: TextStyle(fontSize: 28, fontWeight: FontWeight.bold)),
    const SizedBox(height: 8),
    const Text('From Farm Intelligence to the Right Market'),
    const SizedBox(height: 24),
    Card(child: ListTile(leading: const CircleAvatar(child: Icon(Icons.auto_awesome)), title: const Text('AI Decision Center'), subtitle: const Text('Demand, selling window, buyer fit and logistics.'))),
    Card(child: ListTile(leading: const CircleAvatar(child: Icon(Icons.storefront)), title: const Text('Sell your produce'), subtitle: const Text('Prepare produce for buyers and FPO aggregation.'))),
    Card(child: ListTile(leading: const CircleAvatar(child: Icon(Icons.local_shipping)), title: const Text('Track fulfilment'), subtitle: const Text('Follow collection, order and delivery progress.'))),
    const SizedBox(height: 12),
    const Text('Demo app • FarmPlug AI • SIH 2026 PS 26033', style: TextStyle(fontSize: 12)),
  ]);
}

class ProduceTab extends StatelessWidget {
  const ProduceTab({super.key});
  @override
  Widget build(BuildContext context) => ListView(padding: const EdgeInsets.all(16), children: [
    const Text('My Produce', style: TextStyle(fontSize: 26, fontWeight: FontWeight.bold)),
    const SizedBox(height: 16),
    const Card(child: ListTile(title: Text('Tomato • 1,000 kg'), subtitle: Text('Grade A • Coimbatore • Demo listing'), trailing: Text('Ready'))),
    const Card(child: ListTile(title: Text('Coconut • 500 kg'), subtitle: Text('Grade A • Tamil Nadu • Demo listing'), trailing: Text('Ready'))),
    const SizedBox(height: 16),
    FilledButton.icon(onPressed: () => _showDemo(context), icon: const Icon(Icons.add), label: const Text('Add Produce')),
  ]);
  static void _showDemo(BuildContext context) => showDialog(context: context, builder: (_) => AlertDialog(title: const Text('Demo listing'), content: const Text('Connect the farmer account from the FarmPlug website to publish a real listing.'), actions: [TextButton(onPressed: () => Navigator.pop(context), child: const Text('OK'))]));
}

class DecisionTab extends StatefulWidget {
  const DecisionTab({super.key});
  @override State<DecisionTab> createState() => _DecisionTabState();
}
class _DecisionTabState extends State<DecisionTab> {
  final crop = TextEditingController(text: 'Tomato');
  final quantity = TextEditingController(text: '1000');
  final location = TextEditingController(text: 'Coimbatore');
  bool loading = false;
  String? result;
  Future<void> analyze() async {
    final kg = double.tryParse(quantity.text.trim());
    if (kg == null || kg <= 0) { setState(() => result = 'Enter a valid quantity.'); return; }
    setState(() { loading = true; result = null; });
    try {
      final r = await http.post(Uri.parse('$webBase/api/decision'), headers: {'Content-Type': 'application/json'}, body: jsonEncode({'crop': crop.text.trim(), 'location': location.text.trim(), 'quantity': kg, 'quality': 'Grade A', 'harvestDate': DateTime.now().toIso8601String(), 'storage': 'Open Storage'}));
      if (r.statusCode == 200) {
        final data = jsonDecode(r.body) as Map<String, dynamic>;
        setState(() => result = data.entries.take(5).map((e) => '${e.key}: ${e.value}').join('\n'));
      } else { setState(() => result = 'Decision service returned ${r.statusCode}.'); }
    } catch (_) { setState(() => result = 'Network unavailable. The app itself remains available offline.'); }
    if (mounted) setState(() => loading = false);
  }
  @override Widget build(BuildContext context) => ListView(padding: const EdgeInsets.all(16), children: [
    const Text('AI Decision Center', style: TextStyle(fontSize: 26, fontWeight: FontWeight.bold)), const SizedBox(height: 8), const Text('FarmPlug prototype decision engine.'), const SizedBox(height: 16),
    TextField(controller: crop, decoration: const InputDecoration(labelText: 'Crop', border: OutlineInputBorder())), const SizedBox(height: 10),
    TextField(controller: quantity, keyboardType: TextInputType.number, decoration: const InputDecoration(labelText: 'Quantity (kg)', border: OutlineInputBorder())), const SizedBox(height: 10),
    TextField(controller: location, decoration: const InputDecoration(labelText: 'Location', border: OutlineInputBorder())), const SizedBox(height: 14),
    FilledButton(onPressed: loading ? null : analyze, child: Text(loading ? 'Analyzing…' : 'Get AI decision')),
    if (result != null) Card(margin: const EdgeInsets.only(top: 16), child: Padding(padding: const EdgeInsets.all(16), child: Text(result!))),
    const SizedBox(height: 12), const Text('AI results are prototype outputs and are not scientifically validated.', style: TextStyle(fontSize: 12)),
  ]);
  @override void dispose() { crop.dispose(); quantity.dispose(); location.dispose(); super.dispose(); }
}

class OrdersTab extends StatelessWidget {
  const OrdersTab({super.key});
  @override Widget build(BuildContext context) => ListView(padding: const EdgeInsets.all(16), children: [
    const Text('Orders', style: TextStyle(fontSize: 26, fontWeight: FontWeight.bold)), const SizedBox(height: 16),
    const Card(child: ListTile(leading: Icon(Icons.receipt_long), title: Text('No confirmed orders yet'), subtitle: Text('Real buyer orders will appear after quote acceptance on the FarmPlug platform.'))),
  ]);
}
