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
  final config = await _loadConfig();
  if (config != null) {
    await Supabase.initialize(
      url: config['url']!,
      publishableKey: config['key']!,
    );
  }
  runApp(FarmPlugApp(configReady: config != null));
}

Future<Map<String, String>?> _loadConfig() async {
  try {
    final response = await http
        .get(Uri.parse('$webBase/api/mobile/config'))
        .timeout(const Duration(seconds: 8));
    if (response.statusCode != 200) return null;
    final body = jsonDecode(response.body) as Map<String, dynamic>;
    final url = '${body['url'] ?? ''}';
    final key = '${body['publishableKey'] ?? ''}';
    if (url.isEmpty || key.isEmpty) return null;
    return {'url': url, 'key': key};
  } catch (_) {
    return null;
  }
}

class FarmPlugApp extends StatelessWidget {
  final bool configReady;

  const FarmPlugApp({super.key, required this.configReady});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'FarmPlug AI',
      theme: ThemeData(
        useMaterial3: true,
        colorSchemeSeed: Colors.green,
        scaffoldBackgroundColor: const Color(0xFFF7FBF5),
      ),
      home: configReady ? const AuthGate() : const SetupError(),
    );
  }
}

class SetupError extends StatelessWidget {
  const SetupError({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Icon(Icons.cloud_off, size: 56),
              const SizedBox(height: 16),
              const Text(
                'FarmPlug is temporarily unavailable',
                textAlign: TextAlign.center,
                style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 8),
              const Text(
                'Please check your internet connection and try again.',
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 20),
              FilledButton(
                onPressed: () => main(),
                child: const Text('Retry'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class AuthGate extends StatelessWidget {
  const AuthGate({super.key});

  @override
  Widget build(BuildContext context) {
    return StreamBuilder<AuthState>(
      stream: Supabase.instance.client.auth.onAuthStateChange,
      builder: (_, __) {
        final session = Supabase.instance.client.auth.currentSession;
        return session == null ? const LoginPage() : const HomePage();
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
  bool loading = false;
  bool signup = false;
  String? error;

  Future<void> submit() async {
    final emailValue = email.text.trim();
    if (emailValue.isEmpty || password.text.length < 6) {
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
          ? await auth.signUp(email: emailValue, password: password.text)
          : await auth.signInWithPassword(
              email: emailValue,
              password: password.text,
            );
      if (signup && result.session == null && mounted) {
        setState(() {
          error = 'Account created. Check your email if confirmation is required.';
        });
      }
    } on AuthException catch (e) {
      if (mounted) setState(() => error = e.message);
    } catch (e) {
      if (mounted) setState(() => error = 'Something went wrong. Please retry.');
    } finally {
      if (mounted) setState(() => loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(24),
            child: ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: 440),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  const Icon(Icons.agriculture, size: 64),
                  const SizedBox(height: 12),
                  const Text(
                    'FarmPlug AI',
                    textAlign: TextAlign.center,
                    style: TextStyle(fontSize: 30, fontWeight: FontWeight.w800),
                  ),
                  const Text(
                    'From Farm Intelligence to the Right Market',
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 32),
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
                  const SizedBox(height: 16),
                  if (error != null)
                    Padding(
                      padding: const EdgeInsets.only(bottom: 12),
                      child: Text(
                        error!,
                        style: TextStyle(
                          color: Theme.of(context).colorScheme.error,
                        ),
                      ),
                    ),
                  FilledButton(
                    onPressed: loading ? null : submit,
                    child: Text(
                      loading
                          ? 'Please wait…'
                          : signup
                              ? 'Create farmer account'
                              : 'Sign in',
                    ),
                  ),
                  TextButton(
                    onPressed: loading
                        ? null
                        : () => setState(() {
                              signup = !signup;
                              error = null;
                            }),
                    child: Text(
                      signup
                          ? 'Already have an account? Sign in'
                          : 'New farmer? Create an account',
                    ),
                  ),
                ],
              ),
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
  final pages = const [
    DashboardTab(),
    ListingTab(),
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
          NavigationDestination(
            icon: Icon(Icons.home_outlined),
            selectedIcon: Icon(Icons.home),
            label: 'Home',
          ),
          NavigationDestination(
            icon: Icon(Icons.inventory_2_outlined),
            selectedIcon: Icon(Icons.inventory_2),
            label: 'Produce',
          ),
          NavigationDestination(
            icon: Icon(Icons.auto_awesome_outlined),
            selectedIcon: Icon(Icons.auto_awesome),
            label: 'AI',
          ),
          NavigationDestination(
            icon: Icon(Icons.receipt_long_outlined),
            selectedIcon: Icon(Icons.receipt_long),
            label: 'Orders',
          ),
        ],
      ),
    );
  }
}

class DashboardTab extends StatelessWidget {
  const DashboardTab({super.key});

  Widget card(IconData icon, String title, String body) {
    return Card(
      child: ListTile(
        leading: CircleAvatar(child: Icon(icon)),
        title: Text(title, style: const TextStyle(fontWeight: FontWeight.bold)),
        subtitle: Text(body),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        const Text(
          'Farmer dashboard',
          style: TextStyle(fontSize: 26, fontWeight: FontWeight.w800),
        ),
        const SizedBox(height: 6),
        const Text('Turn your harvest into a better market decision.'),
        const SizedBox(height: 20),
        card(Icons.psychology, 'AI Decision Center',
            'Check demand, selling window, buyer fit and logistics.'),
        card(Icons.storefront, 'Sell with confidence',
            'Publish produce so matched buyers and FPOs can find it.'),
        card(Icons.local_shipping, 'Track fulfillment',
            'Follow confirmed orders from collection to delivery.'),
        const SizedBox(height: 8),
        const Text(
          'FarmPlug AI is a prototype. Verify agronomic and commercial decisions before acting.',
          style: TextStyle(fontSize: 12),
        ),
      ],
    );
  }
}

class ListingTab extends StatefulWidget {
  const ListingTab({super.key});

  @override
  State<ListingTab> createState() => _ListingTabState();
}

class _ListingTabState extends State<ListingTab> {
  final crop = TextEditingController();
  final quantity = TextEditingController();
  final location = TextEditingController();
  String quality = 'Grade A';
  bool loading = false;
  List<dynamic> listings = [];
  String? message;

  Future<String?> _token() async {
    final session = Supabase.instance.client.auth.currentSession;
    return session?.accessToken;
  }

  Future<void> load() async {
    final token = await _token();
    if (token == null) return;
    try {
      final response = await http.get(
        Uri.parse('$webBase/api/farmer/listings'),
        headers: {'Authorization': 'Bearer $token'},
      );
      if (response.statusCode == 200 && mounted) {
        setState(() {
          listings = (jsonDecode(response.body)['listings'] as List?) ?? [];
        });
      }
    } catch (_) {
      // Keep the existing list when offline.
    }
  }

  Future<void> add() async {
    final token = await _token();
    final qty = double.tryParse(quantity.text.trim());
    if (token == null || crop.text.trim().isEmpty || qty == null || qty <= 0) {
      setState(() => message = 'Enter a crop and a valid quantity.');
      return;
    }

    setState(() {
      loading = true;
      message = null;
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
          'quantityKg': qty,
          'quality': quality,
          'location': location.text.trim(),
        }),
      );

      if (response.statusCode == 201) {
        crop.clear();
        quantity.clear();
        location.clear();
        if (mounted) setState(() => message = 'Produce published successfully.');
        await load();
      } else {
        final body = jsonDecode(response.body) as Map<String, dynamic>;
        if (mounted) setState(() => message = '${body['error'] ?? 'Could not publish.'}');
      }
    } catch (_) {
      if (mounted) setState(() => message = 'Network error. Please retry.');
    } finally {
      if (mounted) setState(() => loading = false);
    }
  }

  @override
  void initState() {
    super.initState();
    load();
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
        const Text('My produce', style: TextStyle(fontSize: 26, fontWeight: FontWeight.w800)),
        const SizedBox(height: 16),
        TextField(
          controller: crop,
          decoration: const InputDecoration(labelText: 'Crop', border: OutlineInputBorder()),
        ),
        const SizedBox(height: 10),
        TextField(
          controller: quantity,
          keyboardType: TextInputType.number,
          decoration: const InputDecoration(labelText: 'Quantity (kg)', border: OutlineInputBorder()),
        ),
        const SizedBox(height: 10),
        DropdownButtonFormField<String>(
          initialValue: quality,
          decoration: const InputDecoration(labelText: 'Quality', border: OutlineInputBorder()),
          items: ['Grade A', 'Grade B', 'Grade C']
              .map((item) => DropdownMenuItem(value: item, child: Text(item)))
              .toList(),
          onChanged: (value) => setState(() => quality = value ?? 'Grade A'),
        ),
        const SizedBox(height: 10),
        TextField(
          controller: location,
          decoration: const InputDecoration(labelText: 'Location', border: OutlineInputBorder()),
        ),
        const SizedBox(height: 14),
        FilledButton(
          onPressed: loading ? null : add,
          child: Text(loading ? 'Publishing…' : 'Publish produce'),
        ),
        if (message != null)
          Padding(
            padding: const EdgeInsets.only(top: 10),
            child: Text(message!),
          ),
        const SizedBox(height: 24),
        const Text('Published listings', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
        ...listings.map(
          (item) => Card(
            child: ListTile(
              title: Text('${item['crop']} • ${item['quantity_kg']} kg'),
              subtitle: Text('${item['quality']} • ${item['location']}'),
              trailing: Text('${item['status']}'),
            ),
          ),
        ),
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
  String quality = 'Grade A';
  String storage = 'Open Storage';
  bool loading = false;
  Map<String, dynamic>? result;
  String? error;

  Future<void> runDecision() async {
    final qty = double.tryParse(quantity.text.trim());
    if (crop.text.trim().isEmpty || qty == null || qty <= 0) {
      setState(() => error = 'Enter a crop and valid quantity.');
      return;
    }

    setState(() {
      loading = true;
      error = null;
      result = null;
    });

    try {
      final response = await http.post(
        Uri.parse('$webBase/api/decision'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'crop': crop.text.trim(),
          'quantityKg': qty,
          'location': location.text.trim(),
          'quality': quality,
          'harvestDate': DateTime.now().toIso8601String(),
          'storage': storage,
        }),
      );
      final body = jsonDecode(response.body) as Map<String, dynamic>;
      if (response.statusCode == 200) {
        setState(() => result = (body['result'] as Map?)?.cast<String, dynamic>() ?? {});
      } else {
        setState(() => error = '${body['error'] ?? 'Decision request failed.'}');
      }
    } catch (_) {
      setState(() => error = 'Network error. Please retry.');
    } finally {
      if (mounted) setState(() => loading = false);
    }
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
        const Text('AI Decision Center', style: TextStyle(fontSize: 26, fontWeight: FontWeight.w800)),
        const SizedBox(height: 6),
        const Text('Prototype scoring — not scientifically validated.'),
        const SizedBox(height: 16),
        TextField(
          controller: crop,
          decoration: const InputDecoration(labelText: 'Crop', border: OutlineInputBorder()),
        ),
        const SizedBox(height: 10),
        TextField(
          controller: quantity,
          keyboardType: TextInputType.number,
          decoration: const InputDecoration(labelText: 'Quantity (kg)', border: OutlineInputBorder()),
        ),
        const SizedBox(height: 10),
        TextField(
          controller: location,
          decoration: const InputDecoration(labelText: 'Location', border: OutlineInputBorder()),
        ),
        const SizedBox(height: 14),
        FilledButton(
          onPressed: loading ? null : runDecision,
          child: Text(loading ? 'Analyzing…' : 'Run FarmPlug AI'),
        ),
        if (error != null) ...[
          const SizedBox(height: 10),
          Text(error!, style: TextStyle(color: Theme.of(context).colorScheme.error)),
        ],
        if (result != null)
          Card(
            margin: const EdgeInsets.only(top: 18),
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Text(
                const JsonEncoder.withIndent('  ').convert(result),
                style: const TextStyle(fontFamily: 'monospace'),
              ),
            ),
          ),
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
  String? error;

  @override
  void initState() {
    super.initState();
    load();
  }

  Future<void> load() async {
    final session = Supabase.instance.client.auth.currentSession;
    if (session == null) return;
    setState(() {
      loading = true;
      error = null;
    });
    try {
      final response = await http.get(
        Uri.parse('$webBase/api/orders'),
        headers: {'Authorization': 'Bearer ${session.accessToken}'},
      );
      if (response.statusCode == 200) {
        setState(() {
          orders = (jsonDecode(response.body)['orders'] as List?) ?? [];
        });
      } else {
        setState(() => error = 'Could not load orders.');
      }
    } catch (_) {
      setState(() => error = 'Network error. Please retry.');
    } finally {
      if (mounted) setState(() => loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return RefreshIndicator(
      onRefresh: load,
      child: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          const Text('Orders', style: TextStyle(fontSize: 26, fontWeight: FontWeight.w800)),
          const SizedBox(height: 16),
          if (loading) const Center(child: CircularProgressIndicator()),
          if (error != null) Text(error!),
          if (!loading && error == null && orders.isEmpty)
            const Text('No orders yet. Accepted buyer quotes will appear here.'),
          ...orders.map(
            (order) => Card(
              child: ListTile(
                title: Text('${order['quantity_kg']} kg • ${order['status']}'),
                subtitle: Text('Delivery: ${order['delivery_location'] ?? '—'}'),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
