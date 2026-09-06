import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

const webBase = String.fromEnvironment(
  'FARMPLUG_WEB_URL',
  defaultValue: 'https://farmplugaisxd.vercel.app',
);

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  final config = await _loadConfig();
  if (config != null) {
    await Supabase.initialize(url: config['url']!, publishableKey: config['key']!);
  }
  runApp(FarmPlugApp(configReady: config != null));
}

Future<Map<String, String>?> _loadConfig() async {
  try {
    final response = await http.get(Uri.parse('$webBase/api/mobile/config')).timeout(const Duration(seconds: 8));
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
        inputDecorationTheme: const InputDecorationTheme(border: OutlineInputBorder()),
        cardTheme: const CardThemeData(margin: EdgeInsets.only(bottom: 12)),
      ),
      home: configReady ? const SplashPage() : const SetupError(),
    );
  }
}

class SetupError extends StatelessWidget {
  const SetupError({super.key});
  @override
  Widget build(BuildContext context) => Scaffold(
        body: Center(
          child: Padding(
            padding: const EdgeInsets.all(24),
            child: Column(mainAxisSize: MainAxisSize.min, children: [
              const Icon(Icons.cloud_off, size: 56),
              const SizedBox(height: 16),
              const Text('FarmPlug is temporarily unavailable', textAlign: TextAlign.center, style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
              const SizedBox(height: 8),
              const Text('Check your internet connection and try again.', textAlign: TextAlign.center),
              const SizedBox(height: 20),
              FilledButton(onPressed: () => main(), child: const Text('Retry')),
            ]),
          ),
        ),
      );
}

class SplashPage extends StatefulWidget {
  const SplashPage({super.key});
  @override
  State<SplashPage> createState() => _SplashPageState();
}

class _SplashPageState extends State<SplashPage> {
  @override
  void initState() {
    super.initState();
    _continue();
  }

  Future<void> _continue() async {
    await Future<void>.delayed(const Duration(milliseconds: 900));
    if (!mounted) return;
    final session = Supabase.instance.client.auth.currentSession;
    if (session != null) {
      Navigator.pushReplacement(context, MaterialPageRoute(builder: (_) => const HomePage()));
      return;
    }
    final prefs = await SharedPreferences.getInstance();
    final onboardingDone = prefs.getBool('onboarding_done') ?? false;
    Navigator.pushReplacement(context, MaterialPageRoute(builder: (_) => onboardingDone ? const LoginPage() : const GoalOnboardingPage()));
  }

  @override
  Widget build(BuildContext context) => Scaffold(
        body: Center(
          child: Column(mainAxisSize: MainAxisSize.min, children: [
            Container(width: 88, height: 88, decoration: BoxDecoration(color: Colors.green.shade700, borderRadius: BorderRadius.circular(26)), child: const Icon(Icons.agriculture, color: Colors.white, size: 50)),
            const SizedBox(height: 20),
            const Text('FarmPlug AI', style: TextStyle(fontSize: 32, fontWeight: FontWeight.w800)),
            const SizedBox(height: 6),
            const Text('From Farm Intelligence to the Right Market'),
            const SizedBox(height: 28),
            const SizedBox(width: 28, height: 28, child: CircularProgressIndicator(strokeWidth: 3)),
          ]),
        ),
      );
}

class GoalOnboardingPage extends StatefulWidget {
  const GoalOnboardingPage({super.key});
  @override
  State<GoalOnboardingPage> createState() => _GoalOnboardingPageState();
}

class _GoalOnboardingPageState extends State<GoalOnboardingPage> {
  String? goal;
  final goals = const ['Sell my harvest', 'Find better market prices', 'Find buyers', 'Get AI farming advice'];

  Future<void> next() async {
    if (goal == null) return;
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('onboarding_goal', goal!);
    if (!mounted) return;
    Navigator.push(context, MaterialPageRoute(builder: (_) => const FarmOnboardingPage()));
  }

  @override
  Widget build(BuildContext context) => OnboardingShell(
        step: 1,
        title: 'What do you want to achieve?',
        subtitle: 'FarmPlug AI will tailor the experience to your goal.',
        child: Column(children: [
          ...goals.map((item) => Card(
                child: RadioListTile<String>(value: item, groupValue: goal, title: Text(item), onChanged: (v) => setState(() => goal = v)),
              )),
          const SizedBox(height: 12),
          FilledButton(onPressed: goal == null ? null : next, child: const SizedBox(width: double.infinity, child: Center(child: Text('Continue')))),
          TextButton(onPressed: () => _skipOnboarding(context), child: const Text('Skip for now')),
        ]),
      );
}

class FarmOnboardingPage extends StatefulWidget {
  const FarmOnboardingPage({super.key});
  @override
  State<FarmOnboardingPage> createState() => _FarmOnboardingPageState();
}

class _FarmOnboardingPageState extends State<FarmOnboardingPage> {
  final location = TextEditingController();
  final area = TextEditingController();
  final crop = TextEditingController();

  Future<void> next() async {
    if (location.text.trim().isEmpty || double.tryParse(area.text.trim()) == null || crop.text.trim().isEmpty) return;
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('onboarding_location', location.text.trim());
    await prefs.setString('onboarding_area', area.text.trim());
    await prefs.setString('onboarding_crop', crop.text.trim());
    if (!mounted) return;
    Navigator.push(context, MaterialPageRoute(builder: (_) => const FirstInsightPage()));
  }

  @override
  void dispose() { location.dispose(); area.dispose(); crop.dispose(); super.dispose(); }

  @override
  Widget build(BuildContext context) => OnboardingShell(
        step: 2,
        title: 'Tell us about your farm',
        subtitle: 'You can edit these details later from My Farm.',
        child: Column(children: [
          TextField(controller: location, decoration: const InputDecoration(labelText: 'Farm location')),
          const SizedBox(height: 12),
          TextField(controller: area, keyboardType: const TextInputType.numberWithOptions(decimal: true), decoration: const InputDecoration(labelText: 'Land area (acres)')),
          const SizedBox(height: 12),
          TextField(controller: crop, decoration: const InputDecoration(labelText: 'Main crop')),
          const SizedBox(height: 16),
          FilledButton(onPressed: next, child: const SizedBox(width: double.infinity, child: Center(child: Text('Continue')))),
          TextButton(onPressed: () => _skipOnboarding(context), child: const Text('Skip for now')),
        ]),
      );
}

class FirstInsightPage extends StatelessWidget {
  const FirstInsightPage({super.key});
  Future<void> finish(BuildContext context) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool('onboarding_done', true);
    if (!context.mounted) return;
    Navigator.pushAndRemoveUntil(context, MaterialPageRoute(builder: (_) => const LoginPage()), (_) => false);
  }

  @override
  Widget build(BuildContext context) {
    final prefsFuture = SharedPreferences.getInstance();
    return FutureBuilder<SharedPreferences>(
      future: prefsFuture,
      builder: (context, snapshot) {
        final crop = snapshot.data?.getString('onboarding_crop') ?? 'Your crop';
        final location = snapshot.data?.getString('onboarding_location') ?? 'your area';
        return OnboardingShell(
          step: 3,
          title: 'Your first FarmPlug AI insight',
          subtitle: 'A starting signal from the information you entered. It is a prototype insight, not a live market forecast.',
          child: Column(children: [
            Card(child: Padding(padding: const EdgeInsets.all(18), child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Text(crop, style: const TextStyle(fontSize: 24, fontWeight: FontWeight.w800)),
              const SizedBox(height: 8),
              Text('Location: $location'),
              const Divider(height: 28),
              const _MetricRow(icon: Icons.trending_up, label: 'Demand signal', value: 'Review after login'),
              const _MetricRow(icon: Icons.schedule, label: 'Selling window', value: 'Analyze your harvest'),
              const _MetricRow(icon: Icons.storefront, label: 'Buyer opportunities', value: 'Find matched buyers'),
            ]))),
            const SizedBox(height: 12),
            FilledButton(onPressed: () => finish(context), child: const SizedBox(width: double.infinity, child: Center(child: Text('See My Farm Dashboard')))),
            TextButton(onPressed: () => finish(context), child: const Text('Skip for now')),
          ]),
        );
      },
    );
  }
}

class OnboardingShell extends StatelessWidget {
  final int step;
  final String title;
  final String subtitle;
  final Widget child;
  const OnboardingShell({super.key, required this.step, required this.title, required this.subtitle, required this.child});
  @override
  Widget build(BuildContext context) => Scaffold(
        appBar: AppBar(title: Text('Step $step of 3'), centerTitle: true),
        body: SafeArea(child: SingleChildScrollView(padding: const EdgeInsets.fromLTRB(20, 24, 20, 32), child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Text(title, style: const TextStyle(fontSize: 28, fontWeight: FontWeight.w800)),
          const SizedBox(height: 8),
          Text(subtitle),
          const SizedBox(height: 24),
          child,
        ]))),
      );
}

Future<void> _skipOnboarding(BuildContext context) async {
  final prefs = await SharedPreferences.getInstance();
  await prefs.setBool('onboarding_done', true);
  if (!context.mounted) return;
  Navigator.pushAndRemoveUntil(context, MaterialPageRoute(builder: (_) => const LoginPage()), (_) => false);
}

class LoginPage extends StatefulWidget {
  const LoginPage({super.key});
  @override
  State<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  final email = TextEditingController();
  final password = TextEditingController();
  final name = TextEditingController();
  bool signup = false;
  bool loading = false;
  String? error;

  Future<void> submit() async {
    final emailValue = email.text.trim();
    if (emailValue.isEmpty || password.text.length < 6 || (signup && name.text.trim().isEmpty)) {
      setState(() => error = signup ? 'Enter your name, email and a password of 6+ characters.' : 'Enter a valid email and password (6+ characters).');
      return;
    }
    setState(() { loading = true; error = null; });
    try {
      final auth = Supabase.instance.client.auth;
      final result = signup
          ? await auth.signUp(email: emailValue, password: password.text, data: {'full_name': name.text.trim(), 'farm_role': 'farmer'})
          : await auth.signInWithPassword(email: emailValue, password: password.text);
      if (signup && result.user != null) {
        await _ensureFarmerProfile(result.user!, name.text.trim());
        if (result.session == null && mounted) setState(() => error = 'Account created. Check your email if confirmation is required.');
      }
      if (result.session != null && mounted) Navigator.pushAndRemoveUntil(context, MaterialPageRoute(builder: (_) => const HomePage()), (_) => false);
    } on AuthException catch (e) {
      if (mounted) setState(() => error = e.message);
    } catch (_) {
      if (mounted) setState(() => error = 'Something went wrong. Please retry.');
    } finally {
      if (mounted) setState(() => loading = false);
    }
  }

  Future<void> _ensureFarmerProfile(User user, String fallbackName) async {
    try {
      await Supabase.instance.client.from('farmer_profiles').upsert({
        'id': user.id,
        'full_name': fallbackName.isEmpty ? (user.userMetadata?['full_name'] ?? 'Farmer') : fallbackName,
      });
      await Supabase.instance.client.from('profiles').upsert({'id': user.id, 'farm_role': 'farmer'});
    } catch (_) {
      // Profile creation can be completed from the profile screen if a deployment has not applied the foundation migration yet.
    }
  }

  @override
  void dispose() { email.dispose(); password.dispose(); name.dispose(); super.dispose(); }

  @override
  Widget build(BuildContext context) => Scaffold(
        appBar: AppBar(),
        body: SafeArea(child: Center(child: SingleChildScrollView(padding: const EdgeInsets.all(24), child: ConstrainedBox(constraints: const BoxConstraints(maxWidth: 440), child: Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
          Container(width: 72, height: 72, decoration: BoxDecoration(color: Colors.green.shade700, borderRadius: BorderRadius.circular(20)), child: const Icon(Icons.agriculture, color: Colors.white, size: 42)),
          const SizedBox(height: 16),
          Text(signup ? 'Create your farmer account' : 'Welcome back 👋', style: const TextStyle(fontSize: 28, fontWeight: FontWeight.w800)),
          const SizedBox(height: 6),
          const Text('FarmPlug AI — From Farm Intelligence to the Right Market.'),
          const SizedBox(height: 28),
          if (signup) ...[TextField(controller: name, textCapitalization: TextCapitalization.words, decoration: const InputDecoration(labelText: 'Full name')), const SizedBox(height: 12)],
          TextField(controller: email, keyboardType: TextInputType.emailAddress, decoration: const InputDecoration(labelText: 'Email')),
          const SizedBox(height: 12),
          TextField(controller: password, obscureText: true, decoration: const InputDecoration(labelText: 'Password')),
          const SizedBox(height: 12),
          if (error != null) Padding(padding: const EdgeInsets.only(bottom: 12), child: Text(error!, style: TextStyle(color: Theme.of(context).colorScheme.error))),
          FilledButton(onPressed: loading ? null : submit, child: Text(loading ? 'Please wait…' : signup ? 'Create Account' : 'Sign In')),
          if (!signup) TextButton(onPressed: loading ? null : () => setState(() => error = 'Use your Supabase email/password account or contact support to reset it.'), child: const Text('Forgot Password')),
          TextButton(onPressed: loading ? null : () => setState(() { signup = !signup; error = null; }), child: Text(signup ? 'Already have an account? Sign in' : 'New farmer? Create an account')),
        ]))))),
      );
}

Future<void> _ensureProfile() async {
  final user = Supabase.instance.client.auth.currentUser;
  if (user == null) return;
  try {
    await Supabase.instance.client.from('farmer_profiles').upsert({'id': user.id, 'full_name': '${user.userMetadata?['full_name'] ?? 'Farmer'}'});
    await Supabase.instance.client.from('profiles').upsert({'id': user.id, 'farm_role': 'farmer'});
  } catch (_) {}
}

class HomePage extends StatefulWidget {
  const HomePage({super.key});
  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  int tab = 0;
  @override
  void initState() { super.initState(); _ensureProfile(); }

  @override
  Widget build(BuildContext context) {
    final pages = const [HomeTab(), MarketPlaceholderTab(), DecisionPlaceholderTab(), OrdersPlaceholderTab(), ProfileTab()];
    return Scaffold(
      appBar: AppBar(title: const Text('FarmPlug AI'), actions: [IconButton(tooltip: 'Notifications', onPressed: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const NotificationsPlaceholderPage())), icon: const Icon(Icons.notifications_none))]),
      body: pages[tab],
      bottomNavigationBar: NavigationBar(selectedIndex: tab, onDestinationSelected: (i) => setState(() => tab = i), destinations: const [
        NavigationDestination(icon: Icon(Icons.home_outlined), selectedIcon: Icon(Icons.home), label: 'Home'),
        NavigationDestination(icon: Icon(Icons.storefront_outlined), selectedIcon: Icon(Icons.storefront), label: 'Market'),
        NavigationDestination(icon: Icon(Icons.auto_awesome_outlined), selectedIcon: Icon(Icons.auto_awesome), label: 'AI Center'),
        NavigationDestination(icon: Icon(Icons.receipt_long_outlined), selectedIcon: Icon(Icons.receipt_long), label: 'Orders'),
        NavigationDestination(icon: Icon(Icons.person_outline), selectedIcon: Icon(Icons.person), label: 'Profile'),
      ]),
    );
  }
}

class HomeTab extends StatefulWidget {
  const HomeTab({super.key});
  @override
  State<HomeTab> createState() => _HomeTabState();
}

class _HomeTabState extends State<HomeTab> {
  Map<String, dynamic>? profile;
  int farmCount = 0;
  bool loading = true;

  @override
  void initState() { super.initState(); load(); }
  Future<void> load() async {
    final user = Supabase.instance.client.auth.currentUser;
    if (user == null) return;
    try {
      final p = await Supabase.instance.client.from('farmer_profiles').select('full_name,location,verification_status').eq('id', user.id).maybeSingle();
      final farms = await Supabase.instance.client.from('farms').select('id').eq('owner_id', user.id);
      if (mounted) setState(() { profile = p; farmCount = (farms as List).length; loading = false; });
    } catch (_) {
      if (mounted) setState(() => loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final name = '${profile?['full_name'] ?? 'Farmer'}';
    return RefreshIndicator(onRefresh: load, child: ListView(padding: const EdgeInsets.all(16), children: [
      Text('Hello, $name 👋', style: const TextStyle(fontSize: 27, fontWeight: FontWeight.w800)),
      const SizedBox(height: 4),
      const Text('Make your next harvest decision with confidence.'),
      const SizedBox(height: 18),
      Card(child: Padding(padding: const EdgeInsets.all(18), child: Row(children: [
        CircleAvatar(radius: 24, child: Icon(loading ? Icons.sync : Icons.agriculture)),
        const SizedBox(width: 14),
        Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [const Text('Farm overview', style: TextStyle(fontWeight: FontWeight.bold)), Text('$farmCount farm${farmCount == 1 ? '' : 's'} connected to your account')]))
      ]))),
      Card(child: ListTile(leading: const Icon(Icons.psychology), title: const Text('Your Next Best Action', style: TextStyle(fontWeight: FontWeight.bold)), subtitle: const Text('Add a farm and harvest to unlock a personalized decision.'), trailing: const Icon(Icons.chevron_right), onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const MyFarmPage())))),
      Card(child: ListTile(leading: const Icon(Icons.storefront), title: const Text('Find the right buyer'), subtitle: const Text('Buyer matching is connected to the shared FarmPlug backend.'), trailing: const Icon(Icons.chevron_right), onTap: () => _showComingSoon(context, 'Market screen is the next Phase 2 build.'))),
      Card(child: ListTile(leading: const Icon(Icons.agriculture), title: const Text('My Farm'), subtitle: const Text('Create, view and manage your farms.'), trailing: const Icon(Icons.chevron_right), onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const MyFarmPage())))),
      const SizedBox(height: 8),
      const Text('Phase 1 focuses on a reliable farmer identity and farm foundation. Market, AI, orders and logistics screens will be connected in later phases.', style: TextStyle(fontSize: 12)),
    ]));
  }
}

class MyFarmPage extends StatefulWidget {
  const MyFarmPage({super.key});
  @override
  State<MyFarmPage> createState() => _MyFarmPageState();
}

class _MyFarmPageState extends State<MyFarmPage> {
  List<Map<String, dynamic>> farms = [];
  bool loading = true;
  String? error;

  @override
  void initState() { super.initState(); load(); }
  Future<void> load() async {
    final user = Supabase.instance.client.auth.currentUser;
    if (user == null) return;
    setState(() { loading = true; error = null; });
    try {
      final rows = await Supabase.instance.client.from('farms').select('id,name,location,area_acres,latitude,longitude,created_at').eq('owner_id', user.id).order('created_at', ascending: false);
      if (mounted) setState(() { farms = List<Map<String, dynamic>>.from(rows); loading = false; });
    } catch (e) {
      if (mounted) setState(() { loading = false; error = 'Unable to load farms. Check your connection and try again.'; });
    }
  }

  Future<void> addFarm() async {
    final created = await Navigator.push<bool>(context, MaterialPageRoute(builder: (_) => const AddFarmPage()));
    if (created == true) load();
  }

  @override
  Widget build(BuildContext context) => Scaffold(
        appBar: AppBar(title: const Text('My Farm')),
        floatingActionButton: FloatingActionButton.extended(onPressed: addFarm, icon: const Icon(Icons.add), label: const Text('Add Farm')),
        body: RefreshIndicator(onRefresh: load, child: ListView(padding: const EdgeInsets.all(16), children: [
          const Text('Your farms', style: TextStyle(fontSize: 27, fontWeight: FontWeight.w800)),
          const SizedBox(height: 6),
          const Text('Farm data is stored in Supabase and shared with the web platform.'),
          const SizedBox(height: 18),
          if (loading) const Center(child: Padding(padding: EdgeInsets.all(32), child: CircularProgressIndicator())),
          if (error != null) Card(child: ListTile(leading: const Icon(Icons.error_outline), title: Text(error!), trailing: TextButton(onPressed: load, child: const Text('Retry')))),
          if (!loading && error == null && farms.isEmpty) Card(child: Padding(padding: const EdgeInsets.all(24), child: Column(children: [const Icon(Icons.agriculture, size: 48), const SizedBox(height: 12), const Text('No farms yet', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)), const SizedBox(height: 6), const Text('Add your first farm to start building your FarmPlug profile.', textAlign: TextAlign.center), const SizedBox(height: 16), FilledButton.icon(onPressed: addFarm, icon: const Icon(Icons.add), label: const Text('Add my first farm'))]))),
          ...farms.map((farm) => Card(child: ListTile(leading: const CircleAvatar(child: Icon(Icons.agriculture)), title: Text('${farm['name']}'), subtitle: Text('${farm['area_acres']} acres • ${farm['location']}'), trailing: const Icon(Icons.chevron_right), onTap: () => _showFarmDetails(context, farm)))),
        ]));
}

class AddFarmPage extends StatefulWidget {
  const AddFarmPage({super.key});
  @override
  State<AddFarmPage> createState() => _AddFarmPageState();
}

class _AddFarmPageState extends State<AddFarmPage> {
  final name = TextEditingController(text: 'My Farm');
  final location = TextEditingController();
  final area = TextEditingController();
  final latitude = TextEditingController();
  final longitude = TextEditingController();
  bool loading = false;
  String? error;

  Future<void> save() async {
    final user = Supabase.instance.client.auth.currentUser;
    final areaValue = double.tryParse(area.text.trim());
    if (user == null || location.text.trim().isEmpty || areaValue == null || areaValue <= 0) {
      setState(() => error = 'Enter a location and a valid area greater than 0 acres.');
      return;
    }
    setState(() { loading = true; error = null; });
    try {
      final lat = double.tryParse(latitude.text.trim());
      final lng = double.tryParse(longitude.text.trim());
      await Supabase.instance.client.from('farms').insert({
        'owner_id': user.id,
        'name': name.text.trim().isEmpty ? 'My Farm' : name.text.trim(),
        'location': location.text.trim(),
        'area_acres': areaValue,
        if (lat != null) 'latitude': lat,
        if (lng != null) 'longitude': lng,
      });
      if (mounted) Navigator.pop(context, true);
    } catch (_) {
      if (mounted) setState(() => error = 'Could not save the farm. Please retry.');
    } finally {
      if (mounted) setState(() => loading = false);
    }
  }

  @override
  void dispose() { name.dispose(); location.dispose(); area.dispose(); latitude.dispose(); longitude.dispose(); super.dispose(); }
  @override
  Widget build(BuildContext context) => Scaffold(appBar: AppBar(title: const Text('Add Farm')), body: ListView(padding: const EdgeInsets.all(20), children: [
    const Text('Farm details', style: TextStyle(fontSize: 27, fontWeight: FontWeight.w800)),
    const SizedBox(height: 8),
    const Text('Only your authenticated account can create this farm.'),
    const SizedBox(height: 20),
    TextField(controller: name, decoration: const InputDecoration(labelText: 'Farm name')),
    const SizedBox(height: 12),
    TextField(controller: location, decoration: const InputDecoration(labelText: 'Location')),
    const SizedBox(height: 12),
    TextField(controller: area, keyboardType: const TextInputType.numberWithOptions(decimal: true), decoration: const InputDecoration(labelText: 'Area (acres)')),
    const SizedBox(height: 12),
    ExpansionTile(title: const Text('GPS coordinates (optional)'), children: [Padding(padding: const EdgeInsets.only(bottom: 12), child: Column(children: [TextField(controller: latitude, keyboardType: const TextInputType.numberWithOptions(decimal: true), decoration: const InputDecoration(labelText: 'Latitude')), const SizedBox(height: 12), TextField(controller: longitude, keyboardType: const TextInputType.numberWithOptions(decimal: true), decoration: const InputDecoration(labelText: 'Longitude'))]))]),
    if (error != null) Padding(padding: const EdgeInsets.symmetric(vertical: 12), child: Text(error!, style: TextStyle(color: Theme.of(context).colorScheme.error))),
    const SizedBox(height: 12),
    FilledButton(onPressed: loading ? null : save, child: Text(loading ? 'Saving…' : 'Save Farm')),
  ]));
}

class ProfileTab extends StatelessWidget {
  const ProfileTab({super.key});
  @override
  Widget build(BuildContext context) {
    final user = Supabase.instance.client.auth.currentUser;
    return ListView(padding: const EdgeInsets.all(16), children: [
      const Text('Profile', style: TextStyle(fontSize: 27, fontWeight: FontWeight.w800)),
      const SizedBox(height: 6),
      Text(user?.email ?? 'Farmer account'),
      const SizedBox(height: 20),
      Card(child: ListTile(leading: const Icon(Icons.agriculture), title: const Text('My Farm'), trailing: const Icon(Icons.chevron_right), onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const MyFarmPage())))),
      Card(child: ListTile(leading: const Icon(Icons.settings), title: const Text('Settings'), trailing: const Icon(Icons.chevron_right), onTap: () => _showComingSoon(context, 'Settings will be expanded in Phase 2.'))),
      const SizedBox(height: 16),
      OutlinedButton.icon(onPressed: () async { await Supabase.instance.client.auth.signOut(); if (context.mounted) Navigator.pushAndRemoveUntil(context, MaterialPageRoute(builder: (_) => const LoginPage()), (_) => false); }, icon: const Icon(Icons.logout), label: const Text('Log out')),
    ]);
  }
}

class MarketPlaceholderTab extends StatelessWidget {
  const MarketPlaceholderTab({super.key});
  @override
  Widget build(BuildContext context) => _PlaceholderTab(icon: Icons.storefront, title: 'Market', body: 'Phase 2 will connect market prices and buyer requirements from Supabase.');
}
class DecisionPlaceholderTab extends StatelessWidget {
  const DecisionPlaceholderTab({super.key});
  @override
  Widget build(BuildContext context) => _PlaceholderTab(icon: Icons.auto_awesome, title: 'AI Decision Center', body: 'Phase 2 will connect harvest data, market signals and explainable buyer recommendations.');
}
class OrdersPlaceholderTab extends StatelessWidget {
  const OrdersPlaceholderTab({super.key});
  @override
  Widget build(BuildContext context) => _PlaceholderTab(icon: Icons.receipt_long, title: 'Orders', body: 'Phase 2 will connect the farmer order timeline and realtime status updates.');
}
class NotificationsPlaceholderPage extends StatelessWidget {
  const NotificationsPlaceholderPage({super.key});
  @override
  Widget build(BuildContext context) => Scaffold(appBar: AppBar(title: const Text('Notifications')), body: const _PlaceholderTab(icon: Icons.notifications_none, title: 'Notifications', body: 'Your Supabase notifications will appear here as notification events are connected.'));
}
class _PlaceholderTab extends StatelessWidget {
  final IconData icon; final String title; final String body;
  const _PlaceholderTab({required this.icon, required this.title, required this.body});
  @override
  Widget build(BuildContext context) => Center(child: Padding(padding: const EdgeInsets.all(28), child: Column(mainAxisSize: MainAxisSize.min, children: [CircleAvatar(radius: 34, child: Icon(icon, size: 32)), const SizedBox(height: 18), Text(title, style: const TextStyle(fontSize: 28, fontWeight: FontWeight.w800)), const SizedBox(height: 8), Text(body, textAlign: TextAlign.center), const SizedBox(height: 18), const Chip(label: Text('Phase 1'))])));
}
class _MetricRow extends StatelessWidget {
  final IconData icon; final String label; final String value;
  const _MetricRow({required this.icon, required this.label, required this.value});
  @override
  Widget build(BuildContext context) => Padding(padding: const EdgeInsets.only(bottom: 12), child: Row(children: [Icon(icon, size: 20), const SizedBox(width: 10), Expanded(child: Text(label)), Text(value, style: const TextStyle(fontWeight: FontWeight.bold))]));
}

void _showFarmDetails(BuildContext context, Map<String, dynamic> farm) {
  showModalBottomSheet(context: context, showDragHandle: true, builder: (_) => Padding(padding: const EdgeInsets.fromLTRB(20, 4, 20, 30), child: Column(mainAxisSize: MainAxisSize.min, crossAxisAlignment: CrossAxisAlignment.start, children: [Text('${farm['name']}', style: const TextStyle(fontSize: 24, fontWeight: FontWeight.w800)), const SizedBox(height: 12), Text('Location: ${farm['location']}'), Text('Area: ${farm['area_acres']} acres'), if (farm['latitude'] != null) Text('GPS: ${farm['latitude']}, ${farm['longitude']}'), const SizedBox(height: 12), const Text('Crop and harvest management will be connected in Phase 2.')])));
}

void _showComingSoon(BuildContext context, String text) => ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(text)));
