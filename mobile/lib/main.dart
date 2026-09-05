import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:supabase_flutter/supabase_flutter.dart';

const webBase = String.fromEnvironment('FARMPLUG_WEB_URL', defaultValue: 'https://farmplugaisxd.vercel.app');

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  final config = await _loadConfig();
  if (config != null) {
    await Supabase.initialize(url: config['url']!, anonKey: config['key']!);
  }
  runApp(FarmPlugApp(configReady: config != null));
}

Future<Map<String, String>?> _loadConfig() async {
  try {
    final r = await http.get(Uri.parse('$webBase/api/mobile/config')).timeout(const Duration(seconds: 8));
    if (r.statusCode != 200) return null;
    final body = jsonDecode(r.body) as Map<String, dynamic>;
    return {'url': '${body['url']}', 'key': '${body['publishableKey']}'};
  } catch (_) { return null; }
}

class FarmPlugApp extends StatelessWidget {
  final bool configReady;
  const FarmPlugApp({super.key, required this.configReady});
  @override
  Widget build(BuildContext context) => MaterialApp(
    debugShowCheckedModeBanner: false,
    title: 'FarmPlug AI',
    theme: ThemeData(useMaterial3: true, colorSchemeSeed: Colors.green, scaffoldBackgroundColor: const Color(0xFFF7FBF5)),
    home: configReady ? const AuthGate() : const SetupError(),
  );
}

class SetupError extends StatelessWidget {
  const SetupError({super.key});
  @override
  Widget build(BuildContext context) => Scaffold(body: Center(child: Padding(padding: const EdgeInsets.all(24), child: Column(mainAxisSize: MainAxisSize.min, children: [const Icon(Icons.cloud_off, size: 56), const SizedBox(height: 16), const Text('FarmPlug is temporarily unavailable', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)), const SizedBox(height: 8), const Text('Please check your internet connection and try again.'), const SizedBox(height: 20), FilledButton(onPressed: () => main(), child: const Text('Retry'))])));
}

class AuthGate extends StatelessWidget {
  const AuthGate({super.key});
  @override
  Widget build(BuildContext context) => StreamBuilder<AuthState>(stream: Supabase.instance.client.auth.onAuthStateChange, builder: (_, __) => Supabase.instance.client.auth.currentSession == null ? const LoginPage() : const HomePage());
}

class LoginPage extends StatefulWidget { const LoginPage({super.key}); @override State<LoginPage> createState() => _LoginPageState(); }
class _LoginPageState extends State<LoginPage> {
  final email = TextEditingController(), password = TextEditingController();
  bool loading = false, signup = false; String? error;
  Future<void> submit() async {
    setState(() { loading = true; error = null; });
    try {
      final a = Supabase.instance.client.auth;
      final res = signup ? await a.signUp(email: email.text.trim(), password: password.text) : await a.signInWithPassword(email: email.text.trim(), password: password.text);
      if (signup && res.session == null) error = 'Account created. Check your email if confirmation is required.';
    } on AuthException catch (e) { error = e.message; } catch (e) { error = e.toString(); }
    if (mounted) setState(() => loading = false);
  }
  @override Widget build(BuildContext context) => Scaffold(body: SafeArea(child: Center(child: SingleChildScrollView(padding: const EdgeInsets.all(24), child: ConstrainedBox(constraints: const BoxConstraints(maxWidth: 440), child: Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
    const Icon(Icons.agriculture, size: 64), const SizedBox(height: 12), const Text('FarmPlug AI', textAlign: TextAlign.center, style: TextStyle(fontSize: 30, fontWeight: FontWeight.w800)), const Text('From Farm Intelligence to the Right Market', textAlign: TextAlign.center), const SizedBox(height: 32),
    TextField(controller: email, keyboardType: TextInputType.emailAddress, decoration: const InputDecoration(labelText: 'Email', border: OutlineInputBorder())), const SizedBox(height: 12),
    TextField(controller: password, obscureText: true, decoration: const InputDecoration(labelText: 'Password', border: OutlineInputBorder())), const SizedBox(height: 16),
    if (error != null) Padding(padding: const EdgeInsets.only(bottom: 12), child: Text(error!, style: TextStyle(color: Theme.of(context).colorScheme.error))),
    FilledButton(onPressed: loading ? null : submit, child: Text(loading ? 'Please wait…' : signup ? 'Create farmer account' : 'Sign in')),
    TextButton(onPressed: loading ? null : () => setState(() { signup = !signup; error = null; }), child: Text(signup ? 'Already have an account? Sign in' : 'New farmer? Create an account'))
  ])))));
}

class HomePage extends StatefulWidget { const HomePage({super.key}); @override State<HomePage> createState() => _HomePageState(); }
class _HomePageState extends State<HomePage> {
  int tab = 0;
  final pages = const [DashboardTab(), ListingTab(), DecisionTab(), OrdersTab()];
  @override Widget build(BuildContext context) => Scaffold(appBar: AppBar(title: const Text('FarmPlug AI'), actions: [IconButton(onPressed: () async => Supabase.instance.client.auth.signOut(), icon: const Icon(Icons.logout))]), body: pages[tab], bottomNavigationBar: NavigationBar(selectedIndex: tab, onDestinationSelected: (i) => setState(() => tab = i), destinations: const [NavigationDestination(icon: Icon(Icons.home_outlined), selectedIcon: Icon(Icons.home), label: 'Home'), NavigationDestination(icon: Icon(Icons.inventory_2_outlined), selectedIcon: Icon(Icons.inventory_2), label: 'Produce'), NavigationDestination(icon: Icon(Icons.auto_awesome_outlined), selectedIcon: Icon(Icons.auto_awesome), label: 'AI'), NavigationDestination(icon: Icon(Icons.receipt_long_outlined), selectedIcon: Icon(Icons.receipt_long), label: 'Orders')]);
}

class DashboardTab extends StatelessWidget { const DashboardTab({super.key}); @override Widget build(BuildContext context) => ListView(padding: const EdgeInsets.all(16), children: [const Text('Farmer dashboard', style: TextStyle(fontSize: 26, fontWeight: FontWeight.w800)), const SizedBox(height: 6), const Text('Turn your harvest into a better market decision.'), const SizedBox(height: 20), _card(Icons.psychology, 'AI Decision Center', 'Check demand, selling window, buyer fit and logistics.'), _card(Icons.storefront, 'Sell with confidence', 'Publish produce so matched buyers and FPOs can find it.'), _card(Icons.local_shipping, 'Track fulfillment', 'Follow confirmed orders from collection to delivery.'), const SizedBox(height: 8), const Text('FarmPlug AI is a prototype. Verify agronomic and commercial decisions before acting.', style: TextStyle(fontSize: 12))]); }
Widget _card(IconData i, String title, String body) => Card(child: ListTile(leading: CircleAvatar(child: Icon(i)), title: Text(title, style: const TextStyle(fontWeight: FontWeight.bold)), subtitle: Text(body)));

class ListingTab extends StatefulWidget { const ListingTab({super.key}); @override State<ListingTab> createState() => _ListingTabState(); }
class _ListingTabState extends State<ListingTab> {
  final crop=TextEditingController(), qty=TextEditingController(), location=TextEditingController(); String quality='Grade A'; bool loading=false; List listings=[]; String? message;
  Future<void> load() async { final s=Supabase.instance.client.auth.currentSession; if(s==null)return; final r=await http.get(Uri.parse('$webBase/api/farmer/listings'),headers:{'Authorization':'Bearer ${s.accessToken}'}); if(r.statusCode==200) setState(()=>listings=(jsonDecode(r.body)['listings'] as List)); }
  Future<void> add() async { final s=Supabase.instance.client.auth.currentSession; if(s==null)return; setState(()=>loading=true); final r=await http.post(Uri.parse('$webBase/api/farmer/listings'),headers:{'Authorization':'Bearer ${s.accessToken}','Content-Type':'application/json'},body:jsonEncode({'crop':crop.text,'quantityKg':double.tryParse(qty.text),'quality':quality,'location':location.text})); setState(()=>loading=false); if(r.statusCode==201){crop.clear();qty.clear();location.clear();message='Produce published successfully.';load();}else message=(jsonDecode(r.body)['error']??'Could not publish').toString(); }
  @override void initState(){super.initState();load();}
  @override Widget build(BuildContext context)=>ListView(padding:const EdgeInsets.all(16),children:[const Text('My produce',style:TextStyle(fontSize:26,fontWeight:FontWeight.w800)),const SizedBox(height:16),TextField(controller:crop,decoration:const InputDecoration(labelText:'Crop',border:OutlineInputBorder())),const SizedBox(height:10),TextField(controller:qty,keyboardType:TextInputType.number,decoration:const InputDecoration(labelText:'Quantity (kg)',border:OutlineInputBorder())),const SizedBox(height:10),DropdownButtonFormField(value:quality,decoration:const InputDecoration(labelText:'Quality',border:OutlineInputBorder()),items:['Grade A','Grade B','Grade C'].map((x)=>DropdownMenuItem(value:x,child:Text(x))).toList(),onChanged:(x)=>setState(()=>quality=x!)),const SizedBox(height:10),TextField(controller:location,decoration:const InputDecoration(labelText:'Location',border:OutlineInputBorder())),const SizedBox(height:14),FilledButton(onPressed:loading?null:add,child:Text(loading?'Publishing…':'Publish produce')),if(message!=null)Padding(padding:const EdgeInsets.only(top:10),child:Text(message!)),const SizedBox(height:24),const Text('Published listings',style:TextStyle(fontSize:18,fontWeight:FontWeight.bold)),...listings.map((x)=>Card(child:ListTile(title:Text('${x['crop']} • ${x['quantity_kg']} kg'),subtitle:Text('${x['quality']} • ${x['location']}'),trailing:Text('${x['status']}'))))]);
}

class DecisionTab extends StatefulWidget { const DecisionTab({super.key}); @override State<DecisionTab> createState()=>_DecisionTabState(); }
class _DecisionTabState extends State<DecisionTab>{ final crop=TextEditingController(text:'Tomato'),qty=TextEditingController(text:'1000'),loc=TextEditingController(text:'Coimbatore'); String quality='Grade A',storage='Open Storage'; bool loading=false; Map<String,dynamic>? result; String? error;
Future<void> run()async{setState(()=>loading=true);try{final r=await http.post(Uri.parse('$webBase/api/decision'),headers:{'Content-Type':'application/json'},body:jsonEncode({'crop':crop.text,'quantityKg':double.tryParse(qty.text),'location':loc.text,'quality':quality,'harvestDate':DateTime.now().toIso8601String(),'storage':storage}));final b=jsonDecode(r.body);if(r.statusCode==200)setState(()=>result=b['result']);else setState(()=>error=b['error']);}catch(e){setState(()=>error=e.toString());}setState(()=>loading=false);}
@override Widget build(BuildContext context)=>ListView(padding:const EdgeInsets.all(16),children:[const Text('AI Decision Center',style:TextStyle(fontSize:26,fontWeight:FontWeight.w800)),const SizedBox(height:6),const Text('Prototype scoring — not scientifically validated.'),const SizedBox(height:16),TextField(controller:crop,decoration:const InputDecoration(labelText:'Crop',border:OutlineInputBorder())),const SizedBox(height:10),TextField(controller:qty,keyboardType:TextInputType.number,decoration:const InputDecoration(labelText:'Quantity (kg)',border:OutlineInputBorder())),const SizedBox(height:10),TextField(controller:loc,decoration:const InputDecoration(labelText:'Location',border:OutlineInputBorder())),const SizedBox(height:14),FilledButton(onPressed:loading?null:run,child:Text(loading?'Analyzing…':'Run FarmPlug AI')),if(error!=null)Text(error!),if(result!=null)Card(margin:const EdgeInsets.only(top:18),child:Padding(padding:const EdgeInsets.all(16),child:Text(const JsonEncoder.withIndent('  ').convert(result),style:const TextStyle(fontFamily:'monospace'))))]);}

class OrdersTab extends StatefulWidget { const OrdersTab({super.key}); @override State<OrdersTab> createState()=>_OrdersTabState(); }
class _OrdersTabState extends State<OrdersTab>{List orders=[];bool loading=true;@override void initState(){super.initState();load();}Future<void>load()async{final s=Supabase.instance.client.auth.currentSession;if(s==null)return;final r=await http.get(Uri.parse('$webBase/api/orders'),headers:{'Authorization':'Bearer ${s.accessToken}'});if(r.statusCode==200)setState(()=>orders=jsonDecode(r.body)['orders']);setState(()=>loading=false);}@override Widget build(BuildContext context)=>RefreshIndicator(onRefresh:load,child:ListView(padding:const EdgeInsets.all(16),children:[const Text('Orders',style:TextStyle(fontSize:26,fontWeight:FontWeight.w800)),const SizedBox(height:16),if(loading)const Center(child:CircularProgressIndicator()),if(!loading&&orders.isEmpty)const Text('No orders yet. When a buyer accepts your quote, the order will appear here.'),...orders.map((o)=>Card(child:ListTile(title:Text('${o['quantity_kg']} kg • ${o['status']}'),subtitle:Text('Delivery: ${o['delivery_location']??'—'}'),isThreeLine:true)))]));}
