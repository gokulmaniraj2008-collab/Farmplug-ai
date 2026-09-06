package ai.farmplug.app

import android.annotation.SuppressLint
import android.graphics.Color
import android.net.ConnectivityManager
import android.net.NetworkCapabilities
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.view.Gravity
import android.view.View
import android.webkit.CookieManager
import android.webkit.WebResourceError
import android.webkit.WebResourceRequest
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.FrameLayout
import android.widget.ProgressBar
import android.widget.TextView
import android.widget.Toast
import androidx.activity.OnBackPressedCallback
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowCompat
import androidx.core.view.WindowInsetsCompat

class MainActivity : AppCompatActivity() {
    private lateinit var web: WebView
    private lateinit var progress: ProgressBar
    private val handler = Handler(Looper.getMainLooper())
    private var retryCount = 0

    private fun hasNetwork(): Boolean {
        val manager = getSystemService(ConnectivityManager::class.java)
        val network = manager.activeNetwork ?: return false
        val caps = manager.getNetworkCapabilities(network) ?: return false
        return caps.hasCapability(NetworkCapabilities.NET_CAPABILITY_INTERNET)
    }

    private fun showLoadError() {
        progress.visibility = View.GONE
        Toast.makeText(this, "FarmPlug could not load. Check your internet connection and tap Retry.", Toast.LENGTH_LONG).show()
    }

    private fun loadFarmPlug() {
        retryCount++
        progress.visibility = View.VISIBLE
        web.loadUrl("https://farmplugaisxd.vercel.app/app-v2")
    }

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // Android 15+ edge-to-edge is handled explicitly so the WebView is not laid out
        // underneath system bars on newer devices.
        WindowCompat.setDecorFitsSystemWindows(window, true)
        window.statusBarColor = Color.rgb(22, 101, 52)
        window.navigationBarColor = Color.WHITE

        val root = FrameLayout(this)
        web = WebView(this)
        progress = ProgressBar(this).apply { isIndeterminate = true }

        CookieManager.getInstance().setAcceptCookie(true)
        CookieManager.getInstance().setAcceptThirdPartyCookies(web, true)

        web.settings.apply {
            javaScriptEnabled = true
            domStorageEnabled = true
            javaScriptCanOpenWindowsAutomatically = false
            setSupportMultipleWindows(false)
            allowFileAccess = false
            allowContentAccess = false
            mediaPlaybackRequiresUserGesture = true
            builtInZoomControls = false
            displayZoomControls = false
        }
        web.setBackgroundColor(Color.rgb(247, 251, 247))

        web.webViewClient = object : WebViewClient() {
            override fun onPageStarted(view: WebView, url: String?, favicon: android.graphics.Bitmap?) {
                progress.visibility = View.VISIBLE
                super.onPageStarted(view, url, favicon)
            }

            override fun onPageFinished(view: WebView, url: String?) {
                progress.visibility = View.GONE
                retryCount = 0
                super.onPageFinished(view, url)
            }

            override fun onReceivedError(view: WebView, request: WebResourceRequest, error: WebResourceError) {
                if (request.isForMainFrame) {
                    progress.visibility = View.GONE
                    if (retryCount < 2 && hasNetwork()) {
                        handler.postDelayed({ loadFarmPlug() }, 800)
                    } else {
                        showLoadError()
                    }
                }
                super.onReceivedError(view, request, error)
            }
        }

        ViewCompat.setOnApplyWindowInsetsListener(web) { view, insets ->
            val bars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
            view.setPadding(0, bars.top, 0, bars.bottom)
            insets
        }

        root.addView(web, FrameLayout.LayoutParams(-1, -1))
        val progressParams = FrameLayout.LayoutParams(64, 64).apply { gravity = Gravity.CENTER }
        root.addView(progress, progressParams)
        setContentView(root)

        onBackPressedDispatcher.addCallback(this, object : OnBackPressedCallback(true) {
            override fun handleOnBackPressed() {
                if (web.canGoBack()) web.goBack() else finish()
            }
        })

        // Do not restore an old WebView navigation snapshot. A stale renderer snapshot
        // can make the app immediately close on some Android/WebView versions.
        loadFarmPlug()

        if (!hasNetwork()) {
            Toast.makeText(this, "Internet connection is required for FarmPlug AI.", Toast.LENGTH_LONG).show()
        }
    }

    override fun onDestroy() {
        handler.removeCallbacksAndMessages(null)
        if (::web.isInitialized) {
            web.stopLoading()
            web.loadUrl("about:blank")
            web.clearHistory()
            web.removeAllViews()
            web.destroy()
        }
        super.onDestroy()
    }
}
