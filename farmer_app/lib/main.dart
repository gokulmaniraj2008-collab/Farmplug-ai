import 'package:flutter/material.dart';

const bg = Color(0xFFF7FAF7);
const surface = Colors.white;
const green = Color(0xFF2E9E4F);
const gold = Color(0xFFD6AD45);
const text = Color(0xFF172019);
const muted = Color(0xFF667066);
const border = Color(0xFFDCE5DC);

void main() {
  runApp(const FarmPlugApp());
}

void push(BuildContext context, Widget page) {
  Navigator.of(context).push(MaterialPageRoute(builder: (_) => page));
}

void replaceHome(BuildContext context) {
  Navigator.of(context).pushAndRemoveUntil(
    MaterialPageRoute(builder: (_) => const HomeShell()),
    (_) => false,
  );
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
        brightness: Brightness.light,
        scaffoldBackgroundColor: bg,
        colorScheme: ColorScheme.fromSeed(seedColor: green, brightness: Brightness.light),
        appBarTheme: const AppBarTheme(backgroundColor: bg, foregroundColor: text, elevation: 0),
        cardTheme: const CardThemeData(color: surface, elevation: 0),
        inputDecorationTheme: InputDecorationTheme(
          filled: true,
          fillColor: surface,
          border: OutlineInputBorder(
            borderRadius: BorderRadius.all(Radius.circular(14)),
            borderSide: BorderSide(color: border),
          ),
          enabledBorder: OutlineInputBorder(
            borderRadius: BorderRadius.all(Radius.circular(14)),
            borderSide: BorderSide(color: border),
          ),
          focusedBorder: OutlineInputBorder(
            borderRadius: BorderRadius.all(Radius.circular(14)),
            borderSide: BorderSide(color: green, width: 1.5),
          ),
        ),
      ),
      home: const SplashPage(),
    );
  }
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
    Future.delayed(const Duration(milliseconds: 600), () {
      if (!mounted) return;
      Navigator.of(context).pushReplacement(MaterialPageRoute(builder: (_) => const WelcomePage()));
    });
  }

  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      body: Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(Icons.eco_rounded, color: green, size: 64),
            SizedBox(height: 14),
            Text('FarmPlug AI', style: TextStyle(color: text, fontSize: 30, fontWeight: FontWeight.w800)),
            SizedBox(height: 8),
            Text('Smart farming. Better decisions. Greater yields.', textAlign: TextAlign.center, style: TextStyle(color: muted)),
            SizedBox(height: 22),
            CircularProgressIndicator(color: green),
          ],
        ),
      ),
    );
  }
}

class PageFrame extends StatelessWidget {
  final String title;
  final String subtitle;
  final List<Widget> children;

  const PageFrame({super.key, required this.title, required this.subtitle, required this.children});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(title, style: const TextStyle(fontWeight: FontWeight.w800)),
        leading: Navigator.canPop(context) ? const BackButton() : null,
      ),
      body: SafeArea(
        child: GestureDetector(
          onTap: () => FocusScope.of(context).unfocus(),
          child: ListView(
            padding: const EdgeInsets.fromLTRB(20, 12, 20, 28),
            keyboardDismissBehavior: ScrollViewKeyboardDismissBehavior.onDrag,
            children: [
              Text(subtitle, style: const TextStyle(color: muted, height: 1.35)),
              const SizedBox(height: 18),
              ...children.map((child) => Padding(padding: const EdgeInsets.only(bottom: 14), child: child)),
            ],
          ),
        ),
      ),
    );
  }
}

Widget primaryButton(String label, VoidCallback onPressed) {
  return SizedBox(
    width: double.infinity,
    height: 52,
    child: FilledButton(
      onPressed: onPressed,
      style: FilledButton.styleFrom(
        backgroundColor: green,
        foregroundColor: Colors.white,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
      ),
      child: Text(label, style: const TextStyle(fontWeight: FontWeight.w700)),
    ),
  );
}

Widget outlineButton(String label, VoidCallback onPressed) {
  return SizedBox(
    width: double.infinity,
    height: 50,
    child: OutlinedButton(
      onPressed: onPressed,
      style: OutlinedButton.styleFrom(
        foregroundColor: green,
        side: const BorderSide(color: green),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
      ),
      child: Text(label, style: const TextStyle(fontWeight: FontWeight.w700)),
    ),
  );
}

Widget textField(String label, IconData icon, {TextEditingController? controller, bool obscure = false, TextInputType? keyboardType, String? Function(String?)? validator}) {
  return TextFormField(
    controller: controller,
    obscureText: obscure,
    keyboardType: keyboardType,
    validator: validator,
    autocorrect: !obscure,
    decoration: InputDecoration(labelText: label, prefixIcon: Icon(icon), contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 15)),
  );
}

Widget statusBox(String title, String message, {Color color = green}) {
  return Container(
    width: double.infinity,
    padding: const EdgeInsets.all(14),
    decoration: BoxDecoration(color: color.withAlpha(20), borderRadius: BorderRadius.circular(14), border: Border.all(color: color.withAlpha(60))),
    child: Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Icon(Icons.check_circle_outline, color: color),
        const SizedBox(width: 10),
        Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [Text(title, style: TextStyle(color: color, fontWeight: FontWeight.w800)), const SizedBox(height: 3), Text(message, style: const TextStyle(color: text))])),
      ],
    ),
  );
}

Widget infoRow(String label, String value) {
  return Container(
    width: double.infinity,
    padding: const EdgeInsets.symmetric(vertical: 12),
    decoration: const BoxDecoration(border: Border(bottom: BorderSide(color: border))),
    child: Row(children: [SizedBox(width: 105, child: Text(label, style: const TextStyle(color: muted))), Expanded(child: Text(value, textAlign: TextAlign.right, style: const TextStyle(color: text, fontWeight: FontWeight.w700)))])
  );
}

Widget actionTile(String title, String detail, IconData icon, VoidCallback onTap, {Color color = green}) {
  return Card(
    child: ListTile(
      onTap: onTap,
      contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 4),
      leading: CircleAvatar(backgroundColor: color.withAlpha(26), foregroundColor: color, child: Icon(icon)),
      title: Text(title, style: const TextStyle(color: text, fontWeight: FontWeight.w700)),
      subtitle: Text(detail, style: const TextStyle(color: muted)),
      trailing: const Icon(Icons.chevron_right, color: muted),
    ),
  );
}

class WelcomePage extends StatelessWidget {
  const WelcomePage({super.key});

  @override
  Widget build(BuildContext context) {
    return PageFrame(title: 'Welcome to FarmPlug AI', subtitle: 'From Farm Intelligence to the Right Market.', children: [
      const Icon(Icons.agriculture_rounded, color: green, size: 78),
      const Text('One workspace for your farm, AI guidance, produce sales and orders.', style: TextStyle(color: text, fontSize: 18, height: 1.4)),
      primaryButton('Get Started', () => push(context, const SignInPage())),
      outlineButton('Explore Demo', () => push(context, const DemoRolePage())),
    ]);
  }
}

class SignInPage extends StatefulWidget {
  const SignInPage({super.key});

  @override
  State<SignInPage> createState() => _SignInPageState();
}

class _SignInPageState extends State<SignInPage> {
  final formKey = GlobalKey<FormState>();
  final login = TextEditingController();
  final password = TextEditingController();

  @override
  void dispose() {
    login.dispose();
    password.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return PageFrame(title: 'Sign In', subtitle: 'Use your FarmPlug account.', children: [
      Form(key: formKey, child: Column(children: [
        textField('Phone or email', Icons.person_outline, controller: login, validator: (value) => value == null || value.trim().isEmpty ? 'Enter phone or email' : null),
        const SizedBox(height: 12),
        textField('Password', Icons.lock_outline, controller: password, obscure: true, validator: (value) => value == null || value.length < 6 ? 'Minimum 6 characters' : null),
      ])),
      Align(alignment: Alignment.centerRight, child: TextButton(onPressed: () => push(context, const ForgotPasswordPage()), child: const Text('Forgot password?'))),
      primaryButton('Sign In', () { if (formKey.currentState!.validate()) replaceHome(context); }),
      outlineButton('Continue with Google', () => push(context, const GoogleLoginPage())),
      TextButton(onPressed: () => push(context, const SignUpPage()), child: const Text('New to FarmPlug? Sign Up')),
    ]);
  }
}

class SignUpPage extends StatefulWidget {
  const SignUpPage({super.key});

  @override
  State<SignUpPage> createState() => _SignUpPageState();
}

class _SignUpPageState extends State<SignUpPage> {
  final formKey = GlobalKey<FormState>();
  final name = TextEditingController();
  final phone = TextEditingController();
  final password = TextEditingController();
  final confirm = TextEditingController();

  @override
  void dispose() {
    name.dispose();
    phone.dispose();
    password.dispose();
    confirm.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return PageFrame(title: 'Create Account', subtitle: 'Create your farmer workspace.', children: [
      Form(key: formKey, child: Column(children: [
        textField('Full name', Icons.person_outline, controller: name, validator: (value) => value == null || value.trim().isEmpty ? 'Enter your name' : null),
        const SizedBox(height: 12),
        textField('Phone number', Icons.phone_outlined, controller: phone, keyboardType: TextInputType.phone, validator: (value) => value == null || value.trim().length < 10 ? 'Enter valid phone' : null),
        const SizedBox(height: 12),
        textField('Password', Icons.lock_outline, controller: password, obscure: true, validator: (value) => value == null || value.length < 6 ? 'Minimum 6 characters' : null),
        const SizedBox(height: 12),
        textField('Confirm password', Icons.lock_reset_outlined, controller: confirm, obscure: true, validator: (value) { if (value == null || value.isEmpty) return 'Confirm your password'; if (value != password.text) return 'Passwords do not match'; return null; }),
      ])),
      const Text('By continuing you agree to the FarmPlug Terms and Privacy Policy.', style: TextStyle(color: muted, fontSize: 12)),
      primaryButton('Create Account', () { if (formKey.currentState!.validate()) replaceHome(context); }),
    ]);
  }
}

class GoogleLoginPage extends StatelessWidget {
  const GoogleLoginPage({super.key});

  @override
  Widget build(BuildContext context) {
    return PageFrame(title: 'Google Login', subtitle: 'Google sign-in.', children: [
      const Icon(Icons.account_circle, color: green, size: 72),
      const Text('Google authentication is not connected in this demo build.', style: TextStyle(color: muted)),
      primaryButton('Continue', () => push(context, const RoleSelectionPage())),
    ]);
  }
}

class ForgotPasswordPage extends StatefulWidget {
  const ForgotPasswordPage({super.key});

  @override
  State<ForgotPasswordPage> createState() => _ForgotPasswordPageState();
}

class _ForgotPasswordPageState extends State<ForgotPasswordPage> {
  final email = TextEditingController();
  bool sent = false;

  @override
  void dispose() { email.dispose(); super.dispose(); }

  @override
  Widget build(BuildContext context) {
    return PageFrame(title: 'Forgot Password', subtitle: 'Request a password reset.', children: [
      textField('Phone or email', Icons.person_outline, controller: email),
      primaryButton(sent ? 'Request Sent' : 'Send Reset Request', () => setState(() => sent = true)),
      if (sent) statusBox('Request created', 'Check your registered contact.'),
    ]);
  }
}

class RoleSelectionPage extends StatelessWidget {
  const RoleSelectionPage({super.key});

  @override
  Widget build(BuildContext context) {
    return PageFrame(title: 'Choose Your Role', subtitle: 'Select how you use FarmPlug.', children: [
      actionTile('Farmer', 'Manage farms, crops and sales', Icons.agriculture, () => replaceHome(context)),
      actionTile('Buyer', 'Source verified produce', Icons.storefront, () => push(context, const MarketplacePage())),
      actionTile('FPO', 'Aggregate farmers and supply', Icons.groups, () => push(context, const AggregationPage())),
    ]);
  }
}

class DemoRolePage extends StatelessWidget {
  const DemoRolePage({super.key});

  @override
  Widget build(BuildContext context) {
    return PageFrame(title: 'Demo Role', subtitle: 'Explore seeded FarmPlug workflows.', children: [
      statusBox('DEMO MODE', 'Data is simulated and does not change production records.'),
      actionTile('Farmer Demo', 'Farmer workspace', Icons.agriculture, () => replaceHome(context)),
      actionTile('Buyer Demo', 'Marketplace and requirements', Icons.storefront, () => push(context, const MarketplacePage())),
      actionTile('FPO Demo', 'Aggregation and collection', Icons.groups, () => push(context, const AggregationPage())),
    ]);
  }
}

class HomeShell extends StatefulWidget {
  const HomeShell({super.key});

  @override
  State<HomeShell> createState() => _HomeShellState();
}

class _HomeShellState extends State<HomeShell> {
  int tab = 0;

  final pages = const [FarmerHomePage(), AiCenterPage(), MyFarmPage(), OrdersPage(), ProfilePage()];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(child: pages[tab]),
      bottomNavigationBar: NavigationBar(
        backgroundColor: surface,
        selectedIndex: tab,
        indicatorColor: green.withAlpha(35),
        onDestinationSelected: (index) => setState(() => tab = index),
        destinations: const [
          NavigationDestination(icon: Icon(Icons.home_outlined), selectedIcon: Icon(Icons.home), label: 'Home'),
          NavigationDestination(icon: Icon(Icons.auto_awesome_outlined), selectedIcon: Icon(Icons.auto_awesome), label: 'AI Center'),
          NavigationDestination(icon: Icon(Icons.agriculture_outlined), selectedIcon: Icon(Icons.agriculture), label: 'My Farm'),
          NavigationDestination(icon: Icon(Icons.receipt_long_outlined), selectedIcon: Icon(Icons.receipt_long), label: 'Orders'),
          NavigationDestination(icon: Icon(Icons.person_outline), selectedIcon: Icon(Icons.person), label: 'Profile'),
        ],
      ),
    );
  }
}

class FarmerHomePage extends StatelessWidget {
  const FarmerHomePage({super.key});

  @override
  Widget build(BuildContext context) {
    return PageFrame(title: 'Good morning, farmer', subtitle: 'Your farm at a glance.', children: [
      statusBox('Farm health', 'Healthy · 3 farms · 6 crops'),
      infoRow('Weather', '28°C · Demo data'),
      actionTile('Irrigation check', 'Tomato plot · due today', Icons.water_drop, () => push(context, const CropHealthPage())),
      actionTile('Review market price', 'Tomato · local signal', Icons.trending_up, () => push(context, const MarketplacePage()), color: gold),
      actionTile('Notifications', 'View latest updates', Icons.notifications_none, () => push(context, const NotificationsPage())),
    ]);
  }
}

class AiCenterPage extends StatefulWidget {
  const AiCenterPage({super.key});

  @override
  State<AiCenterPage> createState() => _AiCenterPageState();
}

class _AiCenterPageState extends State<AiCenterPage> {
  final query = TextEditingController();
  String answer = '';

  @override
  void dispose() { query.dispose(); super.dispose(); }

  void ask() {
    final value = query.text.trim();
    if (value.isEmpty) return;
    setState(() { answer = value.toLowerCase().contains('water') ? 'Check soil moisture before irrigation and avoid waterlogging.' : 'Check crop stage, soil moisture, weather and market conditions before deciding.'; });
  }

  @override
  Widget build(BuildContext context) {
    return PageFrame(title: 'AI Center', subtitle: 'Ask a farm question.', children: [
      statusBox('FarmPlug Intelligence', 'Practical recommendations for your next decision.'),
      TextField(controller: query, onSubmitted: (_) => ask(), decoration: InputDecoration(labelText: 'Ask FarmPlug AI', hintText: 'When should I irrigate tomato?', prefixIcon: const Icon(Icons.chat_bubble_outline), suffixIcon: IconButton(onPressed: ask, icon: const Icon(Icons.send, color: green)))),
      if (answer.isNotEmpty) statusBox('FarmPlug AI', answer),
      actionTile('Disease diagnosis', 'Check crop symptoms', Icons.bug_report, () => push(context, const CropHealthPage())),
      actionTile('Market prices', 'See price signals', Icons.trending_up, () => push(context, const MarketplacePage()), color: gold),
    ]);
  }
}

class MyFarmPage extends StatelessWidget {
  const MyFarmPage({super.key});

  @override
  Widget build(BuildContext context) {
    return PageFrame(title: 'My Farm', subtitle: 'Manage farms, crops and health.', children: [
      actionTile('North Field', '2.5 acres · Coimbatore · Healthy', Icons.agriculture, () => push(context, const CropsPage())),
      actionTile('Greenhouse Plot', '1.2 acres · Needs attention', Icons.agriculture, () => push(context, const CropsPage())),
      actionTile('Tomato', 'North Field · 1.4 acres · Healthy', Icons.spa, () => push(context, const CropDetailsPage())),
      actionTile('Chilli', 'North Field · 0.8 acres · Healthy', Icons.spa, () => push(context, const CropDetailsPage())),
    ]);
  }
}

class CropsPage extends StatelessWidget {
  const CropsPage({super.key});

  @override
  Widget build(BuildContext context) {
    return PageFrame(title: 'Crops', subtitle: 'All crops across your farms.', children: [
      actionTile('Tomato', 'North Field · 1.4 acres · Healthy', Icons.spa, () => push(context, const CropDetailsPage())),
      actionTile('Chilli', 'North Field · 0.8 acres · Healthy', Icons.spa, () => push(context, const CropDetailsPage())),
      primaryButton('Add Crop', () => push(context, const CropDetailsPage())),
    ]);
  }
}

class CropDetailsPage extends StatelessWidget {
  const CropDetailsPage({super.key});

  @override
  Widget build(BuildContext context) {
    return PageFrame(title: 'Crop Details', subtitle: 'Tomato · North Field · 1.4 acres', children: [
      statusBox('Crop Health', 'Healthy · 42 days to harvest'),
      infoRow('Sowing date', '20 Jul 2026'),
      infoRow('Irrigation', 'Check today'),
      infoRow('Area', '1.4 acres'),
      primaryButton('Open Crop Health', () => push(context, const CropHealthPage())),
      outlineButton('Farm Intelligence', () => push(context, const FarmIntelligencePage())),
    ]);
  }
}

class CropHealthPage extends StatelessWidget {
  const CropHealthPage({super.key});

  @override
  Widget build(BuildContext context) {
    return PageFrame(title: 'Crop Health', subtitle: 'Monitor symptoms and actions.', children: [
      statusBox('Healthy', 'No critical issue detected.'),
      infoRow('Latest check', 'Today'),
      infoRow('Risk', 'Low'),
      infoRow('Action', 'Continue planned irrigation'),
      primaryButton('Get AI Diagnosis', () => push(context, const AiDecisionPage())),
    ]);
  }
}

class FarmIntelligencePage extends StatelessWidget {
  const FarmIntelligencePage({super.key});

  @override
  Widget build(BuildContext context) {
    return PageFrame(title: 'Farm Intelligence', subtitle: 'Signals for your next decision.', children: [
      infoRow('Weather', '28°C · Demo data'),
      infoRow('Water', 'Irrigation check due'),
      infoRow('Market', 'Tomato signal positive'),
      infoRow('Crop', 'Tomato healthy'),
      primaryButton('Open AI Decision Center', () => push(context, const AiDecisionPage())),
    ]);
  }
}

class AiDecisionPage extends StatelessWidget {
  const AiDecisionPage({super.key});

  @override
  Widget build(BuildContext context) {
    return PageFrame(title: 'AI Decision Center', subtitle: 'Recommended next actions.', children: [
      statusBox('Recommendation', 'Check tomato irrigation today and review tomato prices before listing.'),
      primaryButton('Open Market', () => push(context, const MarketplacePage())),
    ]);
  }
}

class MarketplacePage extends StatefulWidget {
  const MarketplacePage({super.key});

  @override
  State<MarketplacePage> createState() => _MarketplacePageState();
}

class _MarketplacePageState extends State<MarketplacePage> {
  String query = '';
  String category = 'All';
  final products = const [
    {'name': 'Tomato', 'price': '₹42/kg', 'type': 'Vegetables'},
    {'name': 'Chilli', 'price': '₹86/kg', 'type': 'Vegetables'},
    {'name': 'Banana', 'price': '₹34/kg', 'type': 'Fruits'},
    {'name': 'Rice', 'price': '₹58/kg', 'type': 'Grains'},
  ];

  @override
  Widget build(BuildContext context) {
    final filtered = products.where((item) {
      final matchesCategory = category == 'All' || item['type'] == category;
      final haystack = '${item['name']} ${item['type']}'.toLowerCase();
      return matchesCategory && haystack.contains(query.toLowerCase());
    }).toList();

    return PageFrame(title: 'Marketplace', subtitle: 'Explore produce and price signals.', children: [
      TextField(onChanged: (value) => setState(() => query = value), decoration: const InputDecoration(labelText: 'Search produce', prefixIcon: Icon(Icons.search))),
      Wrap(spacing: 8, children: ['All', 'Vegetables', 'Fruits', 'Grains'].map((value) => ChoiceChip(label: Text(value), selected: category == value, onSelected: (_) => setState(() => category = value))).toList()),
      ...filtered.map((item) => actionTile(item['name']!, item['price']!, Icons.storefront, () => push(context, const ProduceDetailsPage()))),
      if (filtered.isEmpty) statusBox('No results', 'Try another search or category.'),
    ]);
  }
}

class ProduceDetailsPage extends StatelessWidget {
  const ProduceDetailsPage({super.key});

  @override
  Widget build(BuildContext context) {
    return PageFrame(title: 'Produce Details', subtitle: 'Tomato · Grade A · Demo listing.', children: [
      statusBox('Available', '1,200 kg · Farm verified · DEMO DATA'),
      infoRow('Price', '₹42/kg'),
      infoRow('Grade', 'A'),
      infoRow('Quantity', '1,200 kg'),
      primaryButton('Add to Requirement', () => ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Added to demo requirement')))),
    ]);
  }
}

class OrdersPage extends StatelessWidget {
  const OrdersPage({super.key});

  @override
  Widget build(BuildContext context) {
    return PageFrame(title: 'Orders', subtitle: 'Track your produce orders.', children: [
      actionTile('FP-1001', 'Tomato · 5,000 kg · In transit', Icons.local_shipping, () => push(context, const OrderDetailsPage())),
      actionTile('FP-0998', 'Chilli · 800 kg · Completed', Icons.check_circle_outline, () => push(context, const OrderDetailsPage())),
      statusBox('Order tracking', 'Pickup → Transit → Delivery → Completed'),
    ]);
  }
}

class OrderDetailsPage extends StatelessWidget {
  const OrderDetailsPage({super.key});

  @override
  Widget build(BuildContext context) {
    return PageFrame(title: 'Order Details', subtitle: 'FP-1001 · Tomato supply.', children: [
      statusBox('In transit', 'Estimated delivery is shown as demo logistics data.'),
      infoRow('Quantity', '5,000 kg'),
      infoRow('Status', 'In transit'),
      infoRow('Payment', 'Simulation'),
      primaryButton('View Logistics', () => push(context, const LogisticsPage())),
    ]);
  }
}

class LogisticsPage extends StatelessWidget {
  const LogisticsPage({super.key});

  @override
  Widget build(BuildContext context) {
    return PageFrame(title: 'Logistics', subtitle: 'Demo route and delivery events.', children: [
      infoRow('Route', 'Farm → Collection Center → Buyer'),
      infoRow('Distance', '42 km'),
      infoRow('Cost', 'Estimated ₹2,800'),
      statusBox('Live status', 'Vehicle in transit · DEMO DATA'),
    ]);
  }
}

class NotificationsPage extends StatelessWidget {
  const NotificationsPage({super.key});

  @override
  Widget build(BuildContext context) {
    return PageFrame(title: 'Notifications', subtitle: 'Latest FarmPlug updates.', children: [
      actionTile('Market alert', 'Tomato price signal increased', Icons.trending_up, () {}),
      actionTile('Order update', 'FP-1001 is in transit', Icons.local_shipping, () => push(context, const OrderDetailsPage())),
      actionTile('Crop reminder', 'Check tomato irrigation today', Icons.water_drop, () => push(context, const CropHealthPage())),
    ]);
  }
}

class ProfilePage extends StatelessWidget {
  const ProfilePage({super.key});

  @override
  Widget build(BuildContext context) {
    return PageFrame(title: 'Profile', subtitle: 'Your FarmPlug account.', children: [
      statusBox('Farmer account', 'Demo profile · Coimbatore'),
      actionTile('Farm settings', 'Farm and crop details', Icons.settings, () => push(context, const SettingsPage())),
      actionTile('Help & support', 'Get help with FarmPlug', Icons.help_outline, () => push(context, const HelpPage())),
      actionTile('Sign out', 'Return to welcome screen', Icons.logout, () => Navigator.of(context).pushAndRemoveUntil(MaterialPageRoute(builder: (_) => const WelcomePage()), (_) => false)),
    ]);
  }
}

class SettingsPage extends StatelessWidget {
  const SettingsPage({super.key});

  @override
  Widget build(BuildContext context) {
    return PageFrame(title: 'Settings', subtitle: 'Manage your app preferences.', children: [
      actionTile('Profile', 'Name and contact details', Icons.person_outline, () {}),
      actionTile('Farm details', 'Location, area and crops', Icons.agriculture, () => push(context, const MyFarmPage())),
      actionTile('Notifications', 'Alerts and updates', Icons.notifications_none, () => push(context, const NotificationsPage())),
      actionTile('Security', 'Password and account security', Icons.security, () {}),
      actionTile('Help', 'Support and FAQs', Icons.help_outline, () => push(context, const HelpPage())),
    ]);
  }
}

class HelpPage extends StatelessWidget {
  const HelpPage({super.key});

  @override
  Widget build(BuildContext context) {
    return PageFrame(title: 'Help & Support', subtitle: 'FarmPlug assistance.', children: [
      statusBox('Need help?', 'Use the website support channel for production account and integration issues.'),
      infoRow('App mode', 'Light-only'),
      infoRow('Data mode', 'Demo data'),
      primaryButton('Back to Home', () => replaceHome(context)),
    ]);
  }
}

class AggregationPage extends StatelessWidget {
  const AggregationPage({super.key});

  @override
  Widget build(BuildContext context) {
    return PageFrame(title: 'Aggregation', subtitle: 'Combine farmer supply for buyer requirements.', children: [
      statusBox('5,000 kg requirement', 'Farmer 1: 1,200 kg · Farmer 2: 1,800 kg · Farmer 3: 2,000 kg'),
      infoRow('Match', 'Explainable match · DEMO DATA'),
      infoRow('Quote', 'Digital quote · PAYMENT SIMULATION'),
      primaryButton('Create Demo Order', () => push(context, const OrderDetailsPage())),
    ]);
  }
}
