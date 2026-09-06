package com.farmplug.farmer

import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.browser.customtabs.CustomTabsIntent

class MainActivity : AppCompatActivity() {
    companion object {
        private const val HOME_URL = "https://farmplugaisxd.vercel.app/signin"
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        openFarmPlug()
    }

    private fun openFarmPlug() {
        val uri = Uri.parse(HOME_URL)
        try {
            CustomTabsIntent.Builder()
                .setShowTitle(true)
                .build()
                .launchUrl(this, uri)
        } catch (_: Throwable) {
            try {
                startActivity(Intent(Intent.ACTION_VIEW, uri))
            } catch (_: Throwable) {
                Toast.makeText(this, "Please install or update Chrome, then try again.", Toast.LENGTH_LONG).show()
            }
        }
    }
}
