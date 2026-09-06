// REFERENCE ONLY — not verified against your actual Android project,
// which wasn't provided. This is a starting scaffold per master prompt
// section 25 (Android Farmer App / WebView), not a drop-in file.
//
// IMPORTANT: Google itself blocks OAuth sign-in inside embedded
// WebViews for security reasons (disallowed_useragent error). Do NOT
// attempt Google Sign-In inside the WebView itself. Use Android
// Custom Tabs (below) to open the browser for the Google OAuth leg,
// then hand control back into the WebView once Supabase's session
// cookie is set via your /auth/callback deep link.
//
// Flow: WebView loads your site -> user taps "Continue with Google"
// -> site opens Custom Tabs to Google's real OAuth page (not inside
// the WebView) -> Google redirects to Supabase -> Supabase redirects
// to your configured deep link (farmplugai://auth/callback) ->
// Android intent-filter catches it -> app passes the resulting URL
// back into the WebView's existing /auth/callback page to complete
// session handling (same logic as the web route.ts).

package com.example.farmplugai // TODO: replace with your actual package name

import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.webkit.CookieManager
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.appcompat.app.AppCompatActivity
import androidx.browser.customtabs.CustomTabsIntent

class MainActivity : AppCompatActivity() {

    private lateinit var webView: WebView

    // TODO: replace with your actual deployed production URL
    private val siteBaseUrl = "https://your-farmplug-domain.example.com"

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main) // TODO: must contain a WebView with id webview

        webView = findViewById(R.id.webview)
        configureWebView()
        webView.loadUrl(siteBaseUrl)

        handleIncomingDeepLink(intent)
    }

    override fun onNewIntent(intent: Intent) {
        super.onNewIntent(intent)
        handleIncomingDeepLink(intent)
    }

    private fun configureWebView() {
        webView.settings.javaScriptEnabled = true
        webView.settings.domStorageEnabled = true // required for Supabase session persistence

        // Session persistence across app restarts.
        CookieManager.getInstance().setAcceptCookie(true)
        CookieManager.getInstance().setAcceptThirdPartyCookies(webView, true)

        webView.webViewClient = object : WebViewClient() {
            override fun shouldOverrideUrlLoading(view: WebView, url: String): Boolean {
                // Route Google's own OAuth domain out to Custom Tabs —
                // never let Google's sign-in page render inside the
                // WebView itself (Google blocks this, and it's a
                // legitimate security boundary you shouldn't try to
                // work around).
                if (url.contains("accounts.google.com")) {
                    openInCustomTab(url)
                    return true
                }
                return false // let the WebView handle everything else, including your own /auth/callback page
            }
        }
    }

    private fun openInCustomTab(url: String) {
        val customTabsIntent = CustomTabsIntent.Builder().build()
        customTabsIntent.launchUrl(this, Uri.parse(url))
    }

    private fun handleIncomingDeepLink(intent: Intent) {
        val data = intent.data ?: return
        // Expected scheme: farmplugai://auth/callback?... — must match
        // AndroidManifest's intent-filter AND the redirect URL
        // registered in Supabase Auth -> Providers -> Google, and in
        // the Google Cloud OAuth client's authorized redirect URIs.
        if (data.scheme == "farmplugai" && data.host == "auth") {
            // Hand the full callback URL to your existing web
            // /auth/callback route by loading it in the WebView —
            // reuses the exact same session/profile/role logic as
            // the website instead of duplicating it in Kotlin.
            val callbackUrl = "$siteBaseUrl/auth/callback${data.encodedQuery?.let { "?$it" } ?: ""}"
            webView.loadUrl(callbackUrl)
        }
    }

    override fun onBackPressed() {
        if (webView.canGoBack()) webView.goBack() else super.onBackPressed()
    }
}
