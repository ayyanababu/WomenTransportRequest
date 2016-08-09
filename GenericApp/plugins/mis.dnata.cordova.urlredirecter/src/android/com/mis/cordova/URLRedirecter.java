package com.mis.cordova;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.json.JSONArray;
import org.json.JSONException;

import java.io.DataOutputStream;
import java.net.CookieHandler;
import java.net.CookieManager;
import java.net.HttpURLConnection;
import java.net.URL;
import java.security.cert.CertificateException;
import java.security.cert.X509Certificate;

import javax.net.ssl.HostnameVerifier;
import javax.net.ssl.HttpsURLConnection;
import javax.net.ssl.SSLContext;
import javax.net.ssl.SSLSession;
import javax.net.ssl.SSLSocketFactory;
import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;


/**
 * This class encrypts a message called from JavaScript.
 */
public class URLRedirecter extends CordovaPlugin {


    @Override
    public boolean execute(String action, JSONArray args, final CallbackContext callbackContext) throws JSONException {
        if (action.equals("redirect")) {
            final JSONArray input = args;
            cordova.getThreadPool().execute(new Runnable() {
                public void run() {
                    redirect(input, callbackContext);
                }
            });

            return true;
        }
        return false;
    }

    private static void redirect(JSONArray input, CallbackContext callbackContext) {
        if (input != null && input.length() > 2) {

            try {
                callbackContext.success(redirect(input));
            } catch (Exception e) {
                callbackContext.error("Failed to redirect url");
            }
        } else {
            callbackContext.error("Expected one non-empty string arguments.");
        }
    }

    private static String redirect(JSONArray input) throws Exception {
        CookieManager cookieManager = new CookieManager();
        CookieHandler.setDefault(cookieManager);
        String urlString = input.getString(0);
        boolean useHttps = false;
        if(urlString.contains("https"))
            useHttps = true;
        URL url = new URL(urlString);
        HttpURLConnection urlConnection = (HttpURLConnection) url.openConnection();
        HostnameVerifier oldHostnameVerifier = null;
        SSLSocketFactory oldSocketFactory = null;

        try {
            HttpsURLConnection https;
            if(useHttps)
            {
                https = (HttpsURLConnection)urlConnection;
                oldSocketFactory = trustAllHosts(https);
                // Save the current hostnameVerifier
                oldHostnameVerifier = https.getHostnameVerifier();
                // Setup the connection not to verify hostnames
                https.setHostnameVerifier(DO_NOT_VERIFY);
            }

            int responseCode = urlConnection.getResponseCode();
            urlConnection.disconnect();

            url = new URL(input.getString(1));
            urlConnection = (HttpURLConnection) url.openConnection();

            if(useHttps)
            {
                https = (HttpsURLConnection)urlConnection;
                oldSocketFactory = trustAllHosts(https);
                // Save the current hostnameVerifier
                oldHostnameVerifier = https.getHostnameVerifier();
                // Setup the connection not to verify hostnames
                https.setHostnameVerifier(DO_NOT_VERIFY);
            }


            urlConnection.setDoOutput(true);
            urlConnection.setChunkedStreamingMode(0);
            urlConnection.setRequestMethod("POST");
            urlConnection.setRequestProperty("Content-type", "application/x-www-form-urlencoded");

            DataOutputStream dStream = new DataOutputStream(urlConnection.getOutputStream());
            dStream.writeBytes(input.getString(2)); //Writes out the string to the underlying output stream as a sequence of bytes
            dStream.flush(); // Flushes the data output stream.
            dStream.close();
            urlConnection.setInstanceFollowRedirects(false);
            urlConnection.connect();

            boolean redirect = false;
            int status = urlConnection.getResponseCode();
            if (status != HttpURLConnection.HTTP_OK) {
                if (status == HttpURLConnection.HTTP_MOVED_TEMP
                    || status == HttpURLConnection.HTTP_MOVED_PERM
                    || status == HttpURLConnection.HTTP_SEE_OTHER)
                    redirect = true;
            }

            String newUrl = "";

            if (redirect) {

                // get redirect url from "location" header field
                newUrl = urlConnection.getHeaderField("Location");
            }

            return newUrl;
        } finally {

            if(useHttps)
            {
                HttpsURLConnection https = (HttpsURLConnection) urlConnection;
                https.setHostnameVerifier(oldHostnameVerifier);
                https.setSSLSocketFactory(oldSocketFactory);
            }
            urlConnection.disconnect();
        }

    }

    /**
     * This function will install a trust manager that will blindly trust all SSL
     * certificates.  The reason this code is being added is to enable developers
     * to do development using self signed SSL certificates on their web server.
     *
     * The standard HttpsURLConnection class will throw an exception on self
     * signed certificates if this code is not run.
     */
    private static SSLSocketFactory trustAllHosts(HttpsURLConnection connection) {
        // Install the all-trusting trust manager
        SSLSocketFactory oldFactory = connection.getSSLSocketFactory();
        try {
            // Install our all trusting manager
            SSLContext sc = SSLContext.getInstance("TLS");
            sc.init(null, trustAllCerts, new java.security.SecureRandom());
            SSLSocketFactory newFactory = sc.getSocketFactory();
            connection.setSSLSocketFactory(newFactory);
        } catch (Exception e) {
        }
        return oldFactory;
    }

    // always verify the host - don't check for certificate
    private static final HostnameVerifier DO_NOT_VERIFY = new HostnameVerifier() {
        public boolean verify(String hostname, SSLSession session) {
            return true;
        }
    };
// Create a trust manager that does not validate certificate chains
    private static final TrustManager[] trustAllCerts = new TrustManager[] { new X509TrustManager()
        {
            public java.security.cert.X509Certificate[] getAcceptedIssuers() {
                return new java.security.cert.X509Certificate[] {};
            }

            public void checkClientTrusted(X509Certificate[] chain,
                String authType) throws CertificateException {
            }

            public void checkServerTrusted(X509Certificate[] chain,
                String authType) throws CertificateException {
            }
        }
    };
}
