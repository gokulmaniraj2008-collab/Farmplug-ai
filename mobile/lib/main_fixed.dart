import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:supabase_flutter/supabase_flutter.dart';

const webBase = String.fromEnvironment('FARMPLUG_WEB_URL', defaultValue: 'https://farmplugaisxd.vercel.app');

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  try {
    final r = await http.get(Uri.parse('$webBase/api/mobile/config')).timeout(const Duration(seconds: 8));
    if (r.statusCode == 200) {
      final m = jsonDecode(r.body) as Map<String, dynamic>;
      await Supabase.initialize(url: '${m['url']}', publishableKey: '${m['publishableKey']}');
      runApp(const FarmPlugApp());
      return;
    }
  } catch (_) {}
  runApp(const MaterialApp(home: Scaffold(body: Center(child: Text('FarmPlug is temporarily unavailable')))));
}

class FarmPlugApp extends StatelessWidget {
  const FarmPlugApp({super.key});
  @override Widget build(BuildContext context) => MaterialApp(debugShowCheckedModeBanner: false, title: 'FarmPlug AI', theme: ThemeData(useMaterial3: true, colorSchemeSeed: Colors.green), home: const AuthGate());
}

class AuthGate extends StatelessWidget {
  const AuthGate({super.key});
  @override Widget build(BuildContext context) => StreamBuilder<AuthState>(stream: Supabase.instance.client.auth.onAuthStateChange, builder: (_, __) => Supabase.instance.client.auth.currentSession == null ? const LoginPage() : const HomePage());
}

class LoginPage extends StatefulWidget { const LoginPage({super.key}); @override State<LoginPage> createState() => _LoginPageState(); }
class _LoginPageState extends State<LoginPage> {
  final email=TextEditingController(), password=TextEditingController(); bool signup=false, loading=false; String? error;
  Future<void> submit() async { if(email.text.trim().isEmpty || password.text.length<6){setState(()=>error='Enter a valid email and password (6+ characters).');return;} setState(()=>loading=true); try { final a=Supabase.instance.client.auth; final r=signup?await a.signUp(email:email.text.trim(),password:password.text):await a.signInWithPassword(email:email.text.trim(),password:password.text); if(signup&&r.session==null&&mounted)setState(()=>error='Account created. Check your email if confirmation is required.'); } on AuthException catch(e){if(mounted)setState(()=>error=e.message);} catch(_){if(mounted)setState(()=>error='Unable to connect. Please retry.');} if(mounted)setState(()=>loading=false); }
  @override Widget build(BuildContext c)=>Scaffold(body:SafeArea(child:Center(child:SingleChildScrollView(padding:const EdgeInsets.all(24),child:Column(crossAxisAlignment:CrossAxisAlignment.stretch,children:[const Icon(Icons.agriculture,size:64),const SizedBox(height:12),const Text('FarmPlug AI',textAlign:TextAlign.center,style:TextStyle(fontSize:30,fontWeight:FontWeight.bold)),const Text('From Farm Intelligence to the Right Market',textAlign:TextAlign.center),const SizedBox(height:28),TextField(controller:email,keyboardType:TextInputType.emailAddress,decoration:const InputDecoration(labelText:'Email',border:OutlineInputBorder())),const SizedBox(height:12),TextField(controller:password,obscureText:true,decoration:const InputDecoration(labelText:'Password',border:OutlineInputBorder())),if(error!=null)Padding(padding:const EdgeInsets.only(top:10),child:Text(error!,style:TextStyle(color:Theme.of(c).colorScheme.error))),const SizedBox(height:14),FilledButton(onPressed:loading?null:submit,child:Text(loading?'Please wait…':signup?'Create farmer account':'Sign in')),TextButton(onPressed:loading?null:()=>setState(()=>signup=!signup),child:Text(signup?'Already have an account? Sign in':'New farmer? Create an account'))])))));
}

class HomePage extends StatefulWidget { const HomePage({super.key}); @override State<HomePage> createState()=>_HomePageState(); }
class _HomePageState extends State<HomePage> { int tab=0; final pages=const[DashboardTab(),ProduceTab(),DecisionTab(),OrdersTab()]; @override Widget build(BuildContext c)=>Scaffold(appBar:AppBar(title:const Text('FarmPlug AI'),actions:[IconButton(onPressed:()=>Supabase.instance.client.auth.signOut(),icon:const Icon(Icons.logout))]),body:pages[tab],bottomNavigationBar:NavigationBar(selectedIndex:tab,onDestinationSelected:(i)=>setState(()=>tab=i),destinations:const[NavigationDestination(icon:Icon(Icons.home_outlined),selectedIcon:Icon(Icons.home),label:'Home'),NavigationDestination(icon:Icon(Icons.inventory_2_outlined),selectedIcon:Icon(Icons.inventory_2),label:'Produce'),NavigationDestination(icon:Icon(Icons.auto_awesome_outlined),selectedIcon:Icon(Icons.auto_awesome),label:'AI'),NavigationDestination(icon:Icon(Icons.receipt_long_outlined),selectedIcon:Icon(Icons.receipt_long),label:'Orders')])); }
}

class DashboardTab extends StatelessWidget { const DashboardTab({super.key}); @override Widget build(BuildContext c)=>ListView(padding:const EdgeInsets.all(16),children:[const Text('Farmer dashboard',style:TextStyle(fontSize:26,fontWeight:FontWeight.bold)),const SizedBox(height:8),const Text('Make a better harvest-to-market decision.'),const SizedBox(height:20),_card(Icons.auto_awesome,'AI Decision Center','Demand, selling window, buyer fit and logistics.'),_card(Icons.storefront,'My produce','Publish produce for matched buyers and FPOs.'),_card(Icons.local_shipping,'Orders','Track confirmed orders through fulfilment.'),const SizedBox(height:12),const Text('Prototype: verify agronomic and commercial decisions before acting.',style:TextStyle(fontSize:12))]); }
Widget _card(IconData i,String t,String s)=>Card(child:ListTile(leading:CircleAvatar(child:Icon(i)),title:Text(t,style:const TextStyle(fontWeight:FontWeight.bold)),subtitle:Text(s)));
}

class ProduceTab extends StatefulWidget { const ProduceTab({super.key}); @override State<ProduceTab> createState()=>_ProduceTabState(); }
class _ProduceTabState extends State<ProduceTab>{ final crop=TextEditingController(),qty=TextEditingController(),location=TextEditingController(); String quality='Grade A',msg=''; List<dynamic> items=[]; bool loading=false;
 Future<String?> token() async=>Supabase.instance.client.auth.currentSession?.accessToken;
 Future<void> load() async{final t=await token();if(t==null)return;try{final r=await http.get(Uri.parse('$webBase/api/farmer/listings'),headers:{'Authorization':'Bearer $t'});if(r.statusCode==200&&mounted)setState(()=>items=(jsonDecode(r.body)['listings'] as List?)??[]);}catch(_){}}
 Future<void> add() async{final t=await token(),q=double.tryParse(qty.text);if(t==null||crop.text.trim().isEmpty||q==null||q<=0){setState(()=>msg='Enter crop and valid quantity.');return;}setState(()=>loading=true);try{final r=await http.post(Uri.parse('$webBase/api/farmer/listings'),headers:{'Authorization':'Bearer $t','Content-Type':'application/json'},body:jsonEncode({'crop':crop.text.trim(),'quantityKg':q,'quality':quality,'location':location.text.trim()}));setState(()=>msg=r.statusCode==201?'Produce published successfully.':'Could not publish produce.');if(r.statusCode==201){crop.clear();qty.clear();location.clear();await load();}}catch(_){setState(()=>msg='Network error. Please retry.');}if(mounted)setState(()=>loading=false);}
 @override void initState(){super.initState();load();}
 @override void dispose(){crop.dispose();qty.dispose();location.dispose();super.dispose();}
 @override Widget build(BuildContext c)=>ListView(padding:const EdgeInsets.all(16),children:[const Text('My produce',style:TextStyle(fontSize:26,fontWeight:FontWeight.bold)),const SizedBox(height:16),TextField(controller:crop,decoration:const InputDecoration(labelText:'Crop',border:OutlineInputBorder())),const SizedBox(height:10),TextField(controller:qty,keyboardType:TextInputType.number,decoration:const InputDecoration(labelText:'Quantity (kg)',border:OutlineInputBorder())),const SizedBox(height:10),DropdownButtonFormField<String>(initialValue:quality,decoration:const InputDecoration(labelText:'Quality',border:OutlineInputBorder()),items:['Grade A','Grade B','Grade C'].map((x)=>DropdownMenuItem(value:x,child:Text(x))).toList(),onChanged:(x)=>setState(()=>quality=x??'Grade A')),const SizedBox(height:10),TextField(controller:location,decoration:const InputDecoration(labelText:'Location',border:OutlineInputBorder())),const SizedBox(height:14),FilledButton(onPressed:loading?null:add,child:Text(loading?'Publishing…':'Publish produce')),if(msg.isNotEmpty)Padding(padding:const EdgeInsets.only(top:10),child:Text(msg)),const SizedBox(height:20),const Text('Published listings',style:TextStyle(fontSize:18,fontWeight:FontWeight.bold)),...items.map((x)=>Card(child:ListTile(title:Text('${x['crop']} • ${x['quantity_kg']} kg'),subtitle:Text('${x['quality']} • ${x['location']}'),trailing:Text('${x['status']}'))))]); }
}

class DecisionTab extends StatefulWidget { const DecisionTab({super.key}); @override State<DecisionTab> createState()=>_DecisionTabState(); }
class _DecisionTabState extends State<DecisionTab>{final crop=TextEditingController(text:'Tomato'),qty=TextEditingController(text:'1000'),location=TextEditingController(text:'Coimbatore');bool loading=false;Map<String,dynamic>? result;String? error;
 Future<void> run() async{final q=double.tryParse(qty.text);if(crop.text.trim().isEmpty||q==null||q<=0){setState(()=>error='Enter valid crop and quantity.');return;}setState(()=>loading=true);try{final r=await http.post(Uri.parse('$webBase/api/decision'),headers:{'Content-Type':'application/json'},body:jsonEncode({'crop':crop.text.trim(),'location':location.text.trim(),'quantity':q,'quality':'Grade A','harvestDate':DateTime.now().toIso8601String(),'storage':'Open Storage'}));if(r.statusCode==200)setState(()=>result=jsonDecode(r.body) as Map<String,dynamic>);else setState(()=>error='Decision service unavailable.');}catch(_){setState(()=>error='Network error. Please retry.');}if(mounted)setState(()=>loading=false);}
 @override Widget build(BuildContext c)=>ListView(padding:const EdgeInsets.all(16),children:[const Text('AI Decision Center',style:TextStyle(fontSize:26,fontWeight:FontWeight.bold)),const SizedBox(height:8),const Text('Prototype scoring from the FarmPlug decision engine.'),const SizedBox(height:16),TextField(controller:crop,decoration:const InputDecoration(labelText:'Crop',border:OutlineInputBorder())),const SizedBox(height:10),TextField(controller:qty,keyboardType:TextInputType.number,decoration:const InputDecoration(labelText:'Quantity (kg)',border:OutlineInputBorder())),const SizedBox(height:10),TextField(controller:location,decoration:const InputDecoration(labelText:'Location',border:OutlineInputBorder())),const SizedBox(height:14),FilledButton(onPressed:loading?null:run,child:Text(loading?'Analyzing…':'Get AI decision')),if(error!=null)Padding(padding:const EdgeInsets.only(top:10),child:Text(error!)),if(result!=null)...result!.entries.take(8).map((e)=>Card(child:ListTile(title:Text(e.key),subtitle:Text('${e.value}')))),const SizedBox(height:12),const Text('AI demo results are simulated/prototype outputs and are not scientifically validated.',style:TextStyle(fontSize:12))]); }
}

class OrdersTab extends StatefulWidget { const OrdersTab({super.key}); @override State<OrdersTab> createState()=>_OrdersTabState(); }
class _OrdersTabState extends State<OrdersTab>{List<dynamic> orders=[];bool loading=true;Future<void> load() async{final t=Supabase.instance.client.auth.currentSession?.accessToken;if(t==null)return;try{final r=await http.get(Uri.parse('$webBase/api/orders'),headers:{'Authorization':'Bearer $t'});if(r.statusCode==200)setState(()=>orders=(jsonDecode(r.body)['orders'] as List?)??[]);}catch(_){ }setState(()=>loading=false);} @override void initState(){super.initState();load();}@override Widget build(BuildContext c)=>RefreshIndicator(onRefresh:load,child:ListView(padding:const EdgeInsets.all(16),children:[const Text('My orders',style:TextStyle(fontSize:26,fontWeight:FontWeight.bold)),const SizedBox(height:16),if(loading)const Center(child:CircularProgressIndicator()),if(!loading&&orders.isEmpty)const Card(child:Padding(padding:EdgeInsets.all(20),child:Text('No orders yet. Accepted quotes will appear here.'))),...orders.map((o)=>Card(child:ListTile(title:Text('${o['quantity_kg']} kg • ${o['status']}'),subtitle:Text('${o['delivery_location']??'Delivery location pending'}'),isThreeLine:true)))]));}
}
