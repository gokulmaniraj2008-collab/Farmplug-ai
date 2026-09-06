package com.farmplug.farmer

import android.annotation.SuppressLint
import android.content.Intent
import android.graphics.Color
import android.net.Uri
import android.os.Bundle
import android.util.Log
import android.view.View
import android.view.ViewGroup
import android.webkit.RenderProcessGoneDetail
import android.webkit.WebChromeClient
import android.webkit.WebResourceError
import android.webkit.WebResourceRequest
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.Button
import android.widget.FrameLayout
import android.widget.LinearLayout
import android.widget.ProgressBar
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity

class MainActivity : AppCompatActivity() {
    companion object {
        private const val TAG = "FarmPlugWebView"
        private const val HOME_URL = "https://farmplugaisxd.vercel.app/signin"
        private const val CANONICAL_HOST = "farmplugaisxd.vercel.app"
        private const val MAX_RECOVERY = 2
    }

    private lateinit var container: FrameLayout
    private var webView: WebView? = null
    private lateinit var progress: ProgressBar
    private var recoveryCount = 0

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        container = FrameLayout(this)
        progress = ProgressBar(this).apply { isIndeterminate = true }
        container.addView(progress, FrameLayout.LayoutParams(56, 56).apply { gravity = android.view.Gravity.CENTER })
        setContentView(container)
        createWebView()
    }

    @SuppressLint("SetJavaScriptEnabled")
    private fun createWebView() {
        try {
            webView?.let { destroyWebView(it) }
            val view = WebView(this)
            webView = view
            container.addView(view, 0, FrameLayout.LayoutParams(-1, -1))
            view.settings.apply {
                javaScriptEnabled = true
                domStorageEnabled = true
                databaseEnabled = true
                setSupportZoom(false)
                builtInZoomControls = false
                displayZoomControls = false
                allowFileAccess = false
                allowContentAccess = false
                javaScriptCanOpenWindowsAutomatically = false
                setSupportMultipleWindows(false)
                cacheMode = WebSettings.LOAD_DEFAULT
            }
            view.webChromeClient = WebChromeClient()
            view.webViewClient = object : WebViewClient() {
                override fun onPageStarted(v: WebView, url: String, favicon: android.graphics.Bitmap?) { progress.visibility = View.VISIBLE }
                override fun onPageFinished(v: WebView, url: String) { progress.visibility = View.GONE }
                override fun onReceivedError(v: WebView, request: WebResourceRequest, error: WebResourceError) {
                    if (request.isForMainFrame) showError("FarmPlug could not load: ${error.description}")
                }
                override fun shouldOverrideUrlLoading(v: WebView, request: WebResourceRequest): Boolean {
                    val uri = request.url
                    return if (uri.scheme == "https" && uri.host == CANONICAL_HOST) false else { openExternal(uri); true }
                }
                override fun onRenderProcessGone(v: WebView, detail: RenderProcessGoneDetail): Boolean {
                    Log.e(TAG, "WebView renderer terminated. crashed=${detail.didCrash()}")
                    destroyWebView(v)
                    if (recoveryCount < MAX_RECOVERY) {
                        recoveryCount++
                        showError("FarmPlug web engine restarted. Tap Retry if needed.")
                    } else {
                        showError("FarmPlug web engine stopped repeatedly. Open in Chrome to continue.")
                    }
                    return true
                }
            }
            view.loadUrl(HOME_URL)
        } catch (t: Throwable) {
            Log.e(TAG, "WebView startup failed", t)
            showError("FarmPlug could not start: ${t.javaClass.simpleName}")
        }
    }

    private fun destroyWebView(view: WebView) {
        if (webView === view) webView = null
        (view.parent as? ViewGroup)?.removeView(view)
        runCatching { view.stopLoading() }
        runCatching { view.destroy() }
    }

    private fun showError(message: String) {
        progress.visibility = View.GONE
        container.removeAllViews()
        val panel = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            gravity = android.view.Gravity.CENTER
            setPadding(48, 48, 48, 48)
            setBackgroundColor(Color.WHITE)
        }
        panel.addView(TextView(this).apply { text = "FarmPlug Farmer"; textSize = 24f; setTextColor(Color.BLACK); gravity = android.view.Gravity.CENTER })
        panel.addView(TextView(this).apply { text = message; textSize = 16f; setTextColor(Color.DKGRAY); gravity = android.view.Gravity.CENTER; setPadding(0, 24, 0, 24) })
        panel.addView(Button(this).apply { text = "Retry"; setOnClickListener { container.removeAllViews(); container.addView(progress, FrameLayout.LayoutParams(56, 56).apply { gravity = android.view.Gravity.CENTER }); createWebView() } })
        panel.addView(Button(this).apply { text = "Open in Chrome"; setOnClickListener { openExternal(Uri.parse(HOME_URL)) } })
        container.addView(panel, FrameLayout.LayoutParams(-1, -1))
    }

    private fun openExternal(uri: Uri) { runCatching { startActivity(Intent(Intent.ACTION_VIEW, uri)) }.onFailure { Log.e(TAG, "Unable to open $uri", it) } }

    override fun onDestroy() { webView?.let { destroyWebView(it) }; webView = null; super.onDestroy() }

    @Deprecated("Deprecated in Java")
    override fun onBackPressed() { val view = webView; if (view != null && view.canGoBack()) view.goBack() else super.onBackPressed() }
}
