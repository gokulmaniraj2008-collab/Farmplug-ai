import 'package:flutter_test/flutter_test.dart';
import 'package:farmplug_farmer/main.dart';

void main() {
  testWidgets('FarmPlug app can be constructed', (tester) async {
    await tester.pumpWidget(const FarmPlugApp());
    expect(find.text('FarmPlug AI'), findsOneWidget);
  });
}
