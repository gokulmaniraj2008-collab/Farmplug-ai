package com.farmplug.farmer

import android.annotation.SuppressLint
import android.content.Intent
import android.graphics.Color
import android.net.ConnectivityManager
import android.net.NetworkCapabilities
import android.os.Bundle
import android.view.Gravity
import android.view.View
import android.widget.FrameLayout
import android.widget.ProgressBar
import android.widget.TextView
import android.webkit.WebResourceError
import android.webkit.WebResourceRequest
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity

class MainActivity : AppCompatActivity() {
    private lateinit var webView: WebView
    private lateinit var root: FrameLayout
    private lateinit var launchOverlay: View

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        root = FrameLayout(this)
        webView = WebView(this).apply {
            settings.javaScriptEnabled = true
            settings.domStorageEnabled = true
            settings.databaseEnabled = true
            settings.setSupportZoom(false)
            settings.allowFileAccess = false
            settings.allowContentAccess = false
            settings.javaScriptCanOpenWindowsAutomatically = false
            settings.userAgentString = settings.userAgentString + " FarmPlugFarmer/2.0.0"
            webViewClient = object : WebViewClient() {
                override fun shouldOverrideUrlLoading(view: WebView, request: WebResourceRequest): Boolean {
                    val uri = request.url
                    return if (uri.scheme == "https" && uri.host == CANONICAL_HOST) {
                        false
                    } else {
                        runCatching { startActivity(Intent(Intent.ACTION_VIEW, uri)) }
                        true
                    }
                }

                override fun onPageStarted(view: WebView, url: String, favicon: android.graphics.Bitmap?) {
                    launchOverlay.visibility = View.VISIBLE
                }

                override fun onPageFinished(view: WebView, url: String) {
                    launchOverlay.animate().alpha(0f).setDuration(180).withEndAction {
                        launchOverlay.visibility = View.GONE
                        launchOverlay.alpha = 1f
                    }.start()
                }

                override fun onReceivedError(view: WebView, request: WebResourceRequest, error: WebResourceError) {
                    if (request.isForMainFrame) {
                        launchOverlay.visibility = View.GONE
                        Toast.makeText(
                            this@MainActivity,
                            if (isOnline()) "FarmPlug could not load this page. Please retry." else "No internet connection. Reconnect and retry.",
                            Toast.LENGTH_LONG
                        ).show()
                    }
                }
            }
        }

        root.addView(webView, FrameLayout.LayoutParams(-1, -1))
        launchOverlay = createLaunchOverlay()
        root.addView(launchOverlay, FrameLayout.LayoutParams(-1, -1))
        setContentView(root)

        if (savedInstanceState == null) webView.loadUrl(HOME_URL) else webView.restoreState(savedInstanceState)
    }

    private fun createLaunchOverlay(): View {
        val panel = FrameLayout(this).apply {
            setBackgroundColor(Color.WHITE)
            alpha = 1f
        }
        val content = FrameLayout(this)
        val mark = TextView(this).apply {
            text = "FP"
            setTextColor(Color.WHITE)
            textSize = 20f
            gravity = Gravity.CENTER
            setTypeface(typeface, android.graphics.Typeface.BOLD)
            setBackgroundColor(Color.rgb(23, 99, 58))
        }
        val density = resources.displayMetrics.density
        val markSize = (72 * density).toInt()
        content.addView(mark, FrameLayout.LayoutParams(markSize, markSize, Gravity.CENTER_HORIZONTAL).apply { topMargin = (190 * density).toInt() })

        val title = TextView(this).apply {
            text = "FARMPLUG AI"
            setTextColor(Color.rgb(20, 32, 25))
            textSize = 22f
            gravity = Gravity.CENTER
            setTypeface(typeface, android.graphics.Typeface.BOLD)
        }
        content.addView(title, FrameLayout.LayoutParams(-1, -2, Gravity.CENTER_HORIZONTAL).apply { topMargin = (280 * density).toInt() })

        val subtitle = TextView(this).apply {
            text = "Farmer workspace • Farm intelligence • Market"
            setTextColor(Color.rgb(100, 112, 103))
            textSize = 12f
            gravity = Gravity.CENTER
        }
        content.addView(subtitle, FrameLayout.LayoutParams(-1, -2, Gravity.CENTER_HORIZONTAL).apply { topMargin = (314 * density).toInt() })

        val progress = ProgressBar(this).apply { isIndeterminate = true }
        content.addView(progress, FrameLayout.LayoutParams(40, 40, Gravity.CENTER_HORIZONTAL).apply { topMargin = (370 * density).toInt() })
        panel.addView(content, FrameLayout.LayoutParams(-1, -1))
        return panel
    }

    override fun onSaveInstanceState(outState: Bundle) {
        webView.saveState(outState)
        super.onSaveInstanceState(outState)
    }

    override fun onResume() {
        super.onResume()
        if (::webView.isInitialized && webView.url == null && isOnline()) webView.loadUrl(HOME_URL)
    }

    override fun onDestroy() {
        if (::webView.isInitialized) {
            webView.stopLoading()
            webView.destroy()
        }
        super.onDestroy()
    }

    private fun isOnline(): Boolean {
        val manager = getSystemService(ConnectivityManager::class.java)
        val network = manager.activeNetwork ?: return false
        val capabilities = manager.getNetworkCapabilities(network) ?: return false
        return capabilities.hasCapability(NetworkCapabilities.NET_CAPABILITY_INTERNET)
    }

    @Deprecated("Deprecated in Java")
    override fun onBackPressed() {
        if (webView.canGoBack()) webView.goBack() else super.onBackPressed()
    }

    companion object {
        private const val HOME_URL = "https://farmplugaisxd.vercel.app/signin"
        private const val CANONICAL_HOST = "farmplugaisxd.vercel.app"
    }
}
