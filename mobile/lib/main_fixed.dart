import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:supabase_flutter/supabase_flutter.dart';

const webBase = String.fromEnvironment(
  'FARMPLUG_WEB_URL',
  defaultValue: 'https://farmplugaisxd.vercel.app',
);

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  try {
    final response = await http
        .get(Uri.parse('$webBase/api/mobile/config'))
        .timeout(const Duration(seconds: 8));
    if (response.statusCode == 200) {
      final config = jsonDecode(response.body) as Map<String, dynamic>;
      final url = config['url']?.toString();
      final key = config['publishableKey']?.toString();
      if (url != null && url.isNotEmpty && key != null && key.isNotEmpty) {
        await Supabase.initialize(url: url, publishableKey: key);
        runApp(const FarmPlugApp());
        return;
      }
    }
  } catch (_) {}
  runApp(const MaterialApp(
    debugShowCheckedModeBanner: false,
    home: Scaffold(
      body: Center(child: Text('FarmPlug is temporarily unavailable')),
    ),
  ));
}

class FarmPlugApp extends StatelessWidget {
  const FarmPlugApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'FarmPlug AI',
      theme: ThemeData(
        useMaterial3: true,
        colorSchemeSeed: Colors.green,
      ),
      home: const AuthGate(),
    );
  }
}

class AuthGate extends StatelessWidget {
  const AuthGate({super.key});

  @override
  Widget build(BuildContext context) {
    final auth = Supabase.instance.client.auth;
    return StreamBuilder<AuthState>(
      stream: auth.onAuthStateChange,
      builder: (context, snapshot) {
        return auth.currentSession == null
            ? const LoginPage()
            : const HomePage();
      },
    );
  }
}

class LoginPage extends StatefulWidget {
  const LoginPage({super.key});

  @override
  State<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  final email = TextEditingController();
  final password = TextEditingController();
  bool signup = false;
  bool loading = false;
  String? error;

  Future<void> submit() async {
    final emailText = email.text.trim();
    final passwordText = password.text;
    if (emailText.isEmpty || passwordText.length < 6) {
      setState(() => error = 'Enter a valid email and password (6+ characters).');
      return;
    }
    setState(() {
      loading = true;
      error = null;
    });
    try {
      final auth = Supabase.instance.client.auth;
      final result = signup
          ? await auth.signUp(email: emailText, password: passwordText)
          : await auth.signInWithPassword(email: emailText, password: passwordText);
      if (signup && result.session == null && mounted) {
        setState(() => error = 'Account created. Check your email if confirmation is required.');
      }
    } on AuthException catch (e) {
      if (mounted) setState(() => error = e.message);
    } catch (_) {
      if (mounted) setState(() => error = 'Unable to connect. Please retry.');
    }
    if (mounted) setState(() => loading = false);
  }

  @override
  void dispose() {
    email.dispose();
    password.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(24),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                const Icon(Icons.agriculture, size: 64),
                const SizedBox(height: 12),
                const Text(
                  'FarmPlug AI',
                  textAlign: TextAlign.center,
                  style: TextStyle(fontSize: 30, fontWeight: FontWeight.bold),
                ),
                const Text(
                  'From Farm Intelligence to the Right Market',
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 28),
                TextField(
                  controller: email,
                  keyboardType: TextInputType.emailAddress,
                  decoration: const InputDecoration(
                    labelText: 'Email',
                    border: OutlineInputBorder(),
                  ),
                ),
                const SizedBox(height: 12),
                TextField(
                  controller: password,
                  obscureText: true,
                  decoration: const InputDecoration(
                    labelText: 'Password',
                    border: OutlineInputBorder(),
                  ),
                ),
                if (error != null)
                  Padding(
                    padding: const EdgeInsets.only(top: 10),
                    child: Text(
                      error!,
                      style: TextStyle(color: Theme.of(context).colorScheme.error),
                    ),
                  ),
                const SizedBox(height: 14),
                FilledButton(
                  onPressed: loading ? null : submit,
                  child: Text(loading
                      ? 'Please wait…'
                      : signup
                          ? 'Create farmer account'
                          : 'Sign in'),
                ),
                TextButton(
                  onPressed: loading ? null : () => setState(() => signup = !signup),
                  child: Text(signup
                      ? 'Already have an account? Sign in'
                      : 'New farmer? Create an account'),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  int tab = 0;

  static const pages = [
    DashboardTab(),
    ProduceTab(),
    DecisionTab(),
    OrdersTab(),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('FarmPlug AI'),
        actions: [
          IconButton(
            tooltip: 'Sign out',
            onPressed: () => Supabase.instance.client.auth.signOut(),
            icon: const Icon(Icons.logout),
          ),
        ],
      ),
      body: pages[tab],
      bottomNavigationBar: NavigationBar(
        selectedIndex: tab,
        onDestinationSelected: (index) => setState(() => tab = index),
        destinations: const [
          NavigationDestination(icon: Icon(Icons.home_outlined), selectedIcon: Icon(Icons.home), label: 'Home'),
          NavigationDestination(icon: Icon(Icons.inventory_2_outlined), selectedIcon: Icon(Icons.inventory_2), label: 'Produce'),
          NavigationDestination(icon: Icon(Icons.auto_awesome_outlined), selectedIcon: Icon(Icons.auto_awesome), label: 'AI'),
          NavigationDestination(icon: Icon(Icons.receipt_long_outlined), selectedIcon: Icon(Icons.receipt_long), label: 'Orders'),
        ],
      ),
    );
  }
}

class DashboardTab extends StatelessWidget {
  const DashboardTab({super.key});

  Widget card(IconData icon, String title, String subtitle) {
    return Card(
      child: ListTile(
        leading: CircleAvatar(child: Icon(icon)),
        title: Text(title, style: const TextStyle(fontWeight: FontWeight.bold)),
        subtitle: Text(subtitle),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        const Text('Farmer dashboard', style: TextStyle(fontSize: 26, fontWeight: FontWeight.bold)),
        const SizedBox(height: 8),
        const Text('Make a better harvest-to-market decision.'),
        const SizedBox(height: 20),
        card(Icons.auto_awesome, 'AI Decision Center', 'Demand, selling window, buyer fit and logistics.'),
        card(Icons.storefront, 'My produce', 'Publish produce for matched buyers and FPOs.'),
        card(Icons.local_shipping, 'Orders', 'Track confirmed orders through fulfilment.'),
        const SizedBox(height: 12),
        const Text('Prototype: verify agronomic and commercial decisions before acting.', style: TextStyle(fontSize: 12)),
      ],
    );
  }
}

class ProduceTab extends StatefulWidget {
  const ProduceTab({super.key});

  @override
  State<ProduceTab> createState() => _ProduceTabState();
}

class _ProduceTabState extends State<ProduceTab> {
  final crop = TextEditingController();
  final quantity = TextEditingController();
  final location = TextEditingController();
  String quality = 'Grade A';
  String message = '';
  List<dynamic> listings = [];
  bool loading = false;

  Future<String?> getToken() async => Supabase.instance.client.auth.currentSession?.accessToken;

  Future<void> loadListings() async {
    final token = await getToken();
    if (token == null) return;
    try {
      final response = await http.get(
        Uri.parse('$webBase/api/farmer/listings'),
        headers: {'Authorization': 'Bearer $token'},
      );
      if (response.statusCode == 200 && mounted) {
        final data = jsonDecode(response.body) as Map<String, dynamic>;
        setState(() => listings = (data['listings'] as List?) ?? []);
      }
    } catch (_) {}
  }

  Future<void> publish() async {
    final token = await getToken();
    final kg = double.tryParse(quantity.text);
    if (token == null || crop.text.trim().isEmpty || kg == null || kg <= 0) {
      setState(() => message = 'Enter crop and a valid quantity.');
      return;
    }
    setState(() {
      loading = true;
      message = '';
    });
    try {
      final response = await http.post(
        Uri.parse('$webBase/api/farmer/listings'),
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
        },
        body: jsonEncode({
          'crop': crop.text.trim(),
          'quantityKg': kg,
          'quality': quality,
          'location': location.text.trim(),
        }),
      );
      if (mounted) {
        setState(() => message = response.statusCode == 201
            ? 'Produce published successfully.'
            : 'Could not publish produce.');
      }
      if (response.statusCode == 201) {
        crop.clear();
        quantity.clear();
        location.clear();
        await loadListings();
      }
    } catch (_) {
      if (mounted) setState(() => message = 'Network error. Please retry.');
    }
    if (mounted) setState(() => loading = false);
  }

  @override
  void initState() {
    super.initState();
    loadListings();
  }

  @override
  void dispose() {
    crop.dispose();
    quantity.dispose();
    location.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        const Text('My produce', style: TextStyle(fontSize: 26, fontWeight: FontWeight.bold)),
        const SizedBox(height: 16),
        TextField(controller: crop, decoration: const InputDecoration(labelText: 'Crop', border: OutlineInputBorder())),
        const SizedBox(height: 10),
        TextField(controller: quantity, keyboardType: TextInputType.number, decoration: const InputDecoration(labelText: 'Quantity (kg)', border: OutlineInputBorder())),
        const SizedBox(height: 10),
        DropdownButtonFormField<String>(
          initialValue: quality,
          decoration: const InputDecoration(labelText: 'Quality', border: OutlineInputBorder()),
          items: ['Grade A', 'Grade B', 'Grade C'].map((item) => DropdownMenuItem(value: item, child: Text(item))).toList(),
          onChanged: (value) => setState(() => quality = value ?? 'Grade A'),
        ),
        const SizedBox(height: 10),
        TextField(controller: location, decoration: const InputDecoration(labelText: 'Location', border: OutlineInputBorder())),
        const SizedBox(height: 14),
        FilledButton(onPressed: loading ? null : publish, child: Text(loading ? 'Publishing…' : 'Publish produce')),
        if (message.isNotEmpty) Padding(padding: const EdgeInsets.only(top: 10), child: Text(message)),
        const SizedBox(height: 20),
        const Text('Published listings', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
        ...listings.map((item) => Card(
              child: ListTile(
                title: Text('${item['crop']} • ${item['quantity_kg']} kg'),
                subtitle: Text('${item['quality']} • ${item['location']}'),
                trailing: Text('${item['status']}'),
              ),
            )),
      ],
    );
  }
}

class DecisionTab extends StatefulWidget {
  const DecisionTab({super.key});

  @override
  State<DecisionTab> createState() => _DecisionTabState();
}

class _DecisionTabState extends State<DecisionTab> {
  final crop = TextEditingController(text: 'Tomato');
  final quantity = TextEditingController(text: '1000');
  final location = TextEditingController(text: 'Coimbatore');
  bool loading = false;
  Map<String, dynamic>? result;
  String? error;

  Future<void> analyze() async {
    final kg = double.tryParse(quantity.text);
    if (crop.text.trim().isEmpty || kg == null || kg <= 0) {
      setState(() => error = 'Enter valid crop and quantity.');
      return;
    }
    setState(() {
      loading = true;
      error = null;
    });
    try {
      final response = await http.post(
        Uri.parse('$webBase/api/decision'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'crop': crop.text.trim(),
          'location': location.text.trim(),
          'quantity': kg,
          'quality': 'Grade A',
          'harvestDate': DateTime.now().toIso8601String(),
          'storage': 'Open Storage',
        }),
      );
      if (response.statusCode == 200 && mounted) {
        setState(() => result = jsonDecode(response.body) as Map<String, dynamic>);
      } else if (mounted) {
        setState(() => error = 'Decision service unavailable.');
      }
    } catch (_) {
      if (mounted) setState(() => error = 'Network error. Please retry.');
    }
    if (mounted) setState(() => loading = false);
  }

  @override
  void dispose() {
    crop.dispose();
    quantity.dispose();
    location.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        const Text('AI Decision Center', style: TextStyle(fontSize: 26, fontWeight: FontWeight.bold)),
        const SizedBox(height: 8),
        const Text('Prototype scoring from the FarmPlug decision engine.'),
        const SizedBox(height: 16),
        TextField(controller: crop, decoration: const InputDecoration(labelText: 'Crop', border: OutlineInputBorder())),
        const SizedBox(height: 10),
        TextField(controller: quantity, keyboardType: TextInputType.number, decoration: const InputDecoration(labelText: 'Quantity (kg)', border: OutlineInputBorder())),
        const SizedBox(height: 10),
        TextField(controller: location, decoration: const InputDecoration(labelText: 'Location', border: OutlineInputBorder())),
        const SizedBox(height: 14),
        FilledButton(onPressed: loading ? null : analyze, child: Text(loading ? 'Analyzing…' : 'Get AI decision')),
        if (error != null) Padding(padding: const EdgeInsets.only(top: 10), child: Text(error!)),
        if (result != null)
          ...result!.entries.take(8).map((entry) => Card(
                child: ListTile(title: Text(entry.key), subtitle: Text('${entry.value}')),
              )),
        const SizedBox(height: 12),
        const Text('AI demo results are prototype outputs and are not scientifically validated.', style: TextStyle(fontSize: 12)),
      ],
    );
  }
}

class OrdersTab extends StatefulWidget {
  const OrdersTab({super.key});

  @override
  State<OrdersTab> createState() => _OrdersTabState();
}

class _OrdersTabState extends State<OrdersTab> {
  List<dynamic> orders = [];
  bool loading = true;

  Future<void> loadOrders() async {
    final token = Supabase.instance.client.auth.currentSession?.accessToken;
    if (token == null) return;
    try {
      final response = await http.get(
        Uri.parse('$webBase/api/orders'),
        headers: {'Authorization': 'Bearer $token'},
      );
      if (response.statusCode == 200 && mounted) {
        final data = jsonDecode(response.body) as Map<String, dynamic>;
        setState(() => orders = (data['orders'] as List?) ?? []);
      }
    } catch (_) {}
    if (mounted) setState(() => loading = false);
  }

  @override
  void initState() {
    super.initState();
    loadOrders();
  }

  @override
  Widget build(BuildContext context) {
    return RefreshIndicator(
      onRefresh: loadOrders,
      child: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          const Text('My orders', style: TextStyle(fontSize: 26, fontWeight: FontWeight.bold)),
          const SizedBox(height: 16),
          if (loading) const Center(child: CircularProgressIndicator()),
          if (!loading && orders.isEmpty)
            const Card(
              child: Padding(
                padding: EdgeInsets.all(20),
                child: Text('No orders yet. Accepted quotes will appear here.'),
              ),
            ),
          ...orders.map((order) => Card(
                child: ListTile(
                  title: Text('${order['quantity_kg']} kg • ${order['status']}'),
                  subtitle: Text('${order['delivery_location'] ?? 'Delivery location pending'}'),
                ),
              )),
        ],
      ),
    );
  }
}
