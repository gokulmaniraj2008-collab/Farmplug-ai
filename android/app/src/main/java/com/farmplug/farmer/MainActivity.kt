package com.farmplug.farmer

import android.annotation.SuppressLint
import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.view.View
import android.view.ViewGroup
import android.webkit.WebResourceError
import android.webkit.WebResourceRequest
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.FrameLayout
import android.widget.ProgressBar
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity

class MainActivity : AppCompatActivity() {
    private lateinit var container: FrameLayout
    private var webView: WebView? = null
    private lateinit var progress: ProgressBar

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        container = FrameLayout(this)
        progress = ProgressBar(this).apply { isIndeterminate = true }
        container.addView(progress, FrameLayout.LayoutParams(56, 56).apply {
            gravity = android.view.Gravity.CENTER
        })
        setContentView(container)

        createWebView()
    }

    @SuppressLint("SetJavaScriptEnabled")
    private fun createWebView() {
        webView?.let { old ->
            container.removeView(old)
            old.stopLoading()
            old.destroy()
        }

        val view = WebView(this)
        webView = view
        container.addView(view, 0, FrameLayout.LayoutParams(-1, -1))

        view.settings.apply {
            javaScriptEnabled = true
            domStorageEnabled = true
            setSupportZoom(false)
            builtInZoomControls = false
            displayZoomControls = false
            allowFileAccess = false
            allowContentAccess = false
            javaScriptCanOpenWindowsAutomatically = false
            setSupportMultipleWindows(false)
        }

        view.webViewClient = object : WebViewClient() {
            override fun shouldOverrideUrlLoading(
                view: WebView,
                request: WebResourceRequest
            ): Boolean {
                val uri = request.url
                return if (uri.scheme == "https" && uri.host == CANONICAL_HOST) {
                    false
                } else {
                    openExternal(uri)
                    true
                }
            }

            override fun onPageStarted(view: WebView, url: String, favicon: android.graphics.Bitmap?) {
                progress.visibility = View.VISIBLE
            }

            override fun onPageFinished(view: WebView, url: String) {
                progress.visibility = View.GONE
            }

            override fun onReceivedError(
                view: WebView,
                request: WebResourceRequest,
                error: WebResourceError
            ) {
                if (request.isForMainFrame) {
                    progress.visibility = View.GONE
                    Toast.makeText(
                        this@MainActivity,
                        "FarmPlug could not load. Check your internet connection.",
                        Toast.LENGTH_LONG
                    ).show()
                }
            }

            override fun onRenderProcessGone(
                view: WebView,
                detail: android.webkit.RenderProcessGoneDetail
            ): Boolean {
                container.removeView(view)
                webView = null
                view.destroy()
                progress.visibility = View.GONE
                showRendererRecovery()
                return true
            }
        }

        view.loadUrl(HOME_URL)
    }

    private fun showRendererRecovery() {
        container.removeAllViews()
        val message = TextView(this).apply {
            text = "FarmPlug needs to restart its web engine.\n\nTap Retry to continue."
            textSize = 18f
            gravity = android.view.Gravity.CENTER
            setPadding(48, 48, 48, 48)
            setOnClickListener { recreate() }
        }
        container.addView(message, FrameLayout.LayoutParams(-1, -1))
    }

    private fun openExternal(uri: Uri) {
        runCatching {
            startActivity(Intent(Intent.ACTION_VIEW, uri))
        }.onFailure {
            Toast.makeText(this, "Unable to open this link.", Toast.LENGTH_SHORT).show()
        }
    }

    override fun onDestroy() {
        webView?.let { view ->
            (view.parent as? ViewGroup)?.removeView(view)
            view.stopLoading()
            view.webViewClient = WebViewClient()
            view.destroy()
        }
        webView = null
        super.onDestroy()
    }

    @Deprecated("Deprecated in Java")
    override fun onBackPressed() {
        val view = webView
        if (view != null && view.canGoBack()) view.goBack() else super.onBackPressed()
    }

    companion object {
        private const val HOME_URL = "https://farmplugaisxd.vercel.app/signin"
        private const val CANONICAL_HOST = "farmplugaisxd.vercel.app"
    }
}
