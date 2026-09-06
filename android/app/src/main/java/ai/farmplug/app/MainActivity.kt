package ai.farmplug.app

import android.annotation.SuppressLint
import android.content.Intent
import android.graphics.Color
import android.net.ConnectivityManager
import android.net.NetworkCapabilities
import android.net.Uri
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
import android.widget.Button
import android.widget.FrameLayout
import android.widget.LinearLayout
import android.widget.ProgressBar
import android.widget.TextView
import androidx.activity.OnBackPressedCallback
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowCompat
import androidx.core.view.WindowInsetsCompat

class MainActivity : AppCompatActivity() {
    companion object {
        private const val PRIMARY_URL = "https://farmplugaisxd.vercel.app/app-v2"
        private const val FALLBACK_URL = "https://farmplugaisxd.vercel.app/"
    }

    private lateinit var web: WebView
    private lateinit var progress: ProgressBar
    private lateinit var errorView: View
    private val handler = Handler(Looper.getMainLooper())
    private var retryCount = 0
    private var loadingFallback = false

    private fun hasNetwork(): Boolean {
        val manager = getSystemService(ConnectivityManager::class.java)
        val network = manager.activeNetwork ?: return false
        val caps = manager.getNetworkCapabilities(network) ?: return false
        return caps.hasCapability(NetworkCapabilities.NET_CAPABILITY_INTERNET)
    }

    private fun showLoadError() {
        progress.visibility = View.GONE
        errorView.visibility = View.VISIBLE
    }

    private fun loadFarmPlug() {
        if (!hasNetwork()) {
            showLoadError()
            return
        }
        retryCount++
        errorView.visibility = View.GONE
        progress.visibility = View.VISIBLE
        loadingFallback = false
        web.loadUrl(PRIMARY_URL)
    }

    private fun loadFallback() {
        if (!hasNetwork()) {
            showLoadError()
            return
        }
        retryCount = 0
        loadingFallback = true
        errorView.visibility = View.GONE
        progress.visibility = View.VISIBLE
        web.loadUrl(FALLBACK_URL)
    }

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        WindowCompat.setDecorFitsSystemWindows(window, true)
        window.statusBarColor = Color.rgb(22, 101, 52)
        window.navigationBarColor = Color.WHITE

        val root = FrameLayout(this)
        web = WebView(this)
        progress = ProgressBar(this).apply { isIndeterminate = true }

        val errorLayout = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            gravity = Gravity.CENTER
            setPadding(48, 32, 48, 32)
            setBackgroundColor(Color.rgb(247, 251, 247))
        }
        val title = TextView(this).apply {
            text = "FarmPlug AI is temporarily unavailable"
            textSize = 22f
            setTextColor(Color.rgb(20, 45, 28))
            gravity = Gravity.CENTER
        }
        val message = TextView(this).apply {
            text = "We could not load the farmer workspace. Check your connection or try the website fallback."
            textSize = 16f
            setTextColor(Color.DKGRAY)
            gravity = Gravity.CENTER
            setPadding(0, 16, 0, 24)
        }
        val retry = Button(this).apply {
            text = "Retry FarmPlug"
            setOnClickListener { loadFarmPlug() }
        }
        val fallback = Button(this).apply {
            text = "Open FarmPlug Website"
            setOnClickListener { loadFallback() }
        }
        val browser = Button(this).apply {
            text = "Open in Browser"
            setOnClickListener {
                startActivity(Intent(Intent.ACTION_VIEW, Uri.parse(FALLBACK_URL)))
            }
        }
        errorLayout.addView(title)
        errorLayout.addView(message)
        errorLayout.addView(retry)
        errorLayout.addView(fallback)
        errorLayout.addView(browser)
        errorView = errorLayout
        errorView.visibility = View.GONE

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
                errorView.visibility = View.GONE
                super.onPageStarted(view, url, favicon)
            }

            override fun onPageFinished(view: WebView, url: String?) {
                progress.visibility = View.GONE
                errorView.visibility = View.GONE
                retryCount = 0
                super.onPageFinished(view, url)
            }

            override fun onReceivedError(view: WebView, request: WebResourceRequest, error: WebResourceError) {
                if (request.isForMainFrame) {
                    progress.visibility = View.GONE
                    if (!loadingFallback && retryCount < 2 && hasNetwork()) {
                        handler.postDelayed({ loadFarmPlug() }, 800)
                    } else if (!loadingFallback) {
                        handler.postDelayed({ loadFallback() }, 300)
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
        root.addView(errorView, FrameLayout.LayoutParams(-1, -1))
        setContentView(root)

        onBackPressedDispatcher.addCallback(this, object : OnBackPressedCallback(true) {
            override fun handleOnBackPressed() {
                if (web.canGoBack()) web.goBack() else finish()
            }
        })

        loadFarmPlug()
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
