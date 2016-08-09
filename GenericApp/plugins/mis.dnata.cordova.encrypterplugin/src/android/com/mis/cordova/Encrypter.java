package com.mis.cordova;

import android.util.Base64;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.json.JSONArray;
import org.json.JSONException;

import javax.crypto.Cipher;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;


/**
 * This class encrypts a message called from JavaScript.
 */
public class Encrypter extends CordovaPlugin {
    
    
    @Override
    public boolean execute(String action, JSONArray args, final CallbackContext callbackContext) throws JSONException {
        
        final String message = args.getString(0);
        final String client = args.getString(1);
        if (action.equals("encrypt")) {
            
            cordova.getThreadPool().execute(new Runnable() {
                public void run() {
                    encrypt(message,client, callbackContext);
                }
            });
            
            return true;
            
        }else if (action.equals("decrypt")) {
            
            cordova.getThreadPool().execute(new Runnable() {
                public void run() {
                    decrypt(message, client, callbackContext);
                }
            });
            
            return true;
        }
        return false;
    }
    
    private static void encrypt(String message,String client, CallbackContext callbackContext) {
        if (message != null && message.length() > 0) {
            
            try {
                callbackContext.success(encrypt(message,client));
            } catch (Exception e) {
                callbackContext.error("Failed to encrypt message"+message+".");
            }
        } else {
            callbackContext.error("Expected one non-empty string arguments.");
        }
    }
    
    private static String encrypt(String text, String client) throws Exception {
        Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5Padding");
        byte[] keyBytes= new byte[16];
        byte[] b= client.getBytes("UTF-8");
        int len= b.length;
        if (len > keyBytes.length) len = keyBytes.length;
        System.arraycopy(b, 0, keyBytes, 0, len);
        SecretKeySpec keySpec = new SecretKeySpec(keyBytes, "AES");
        IvParameterSpec ivSpec = new IvParameterSpec(keyBytes);
        cipher.init(Cipher.ENCRYPT_MODE,keySpec,ivSpec);
        
        byte[] results = cipher.doFinal(text.getBytes("UTF-8"));
        return Base64.encodeToString(results, Base64.DEFAULT);
    }
    
    private static void decrypt(String message,String client, CallbackContext callbackContext) {
        if (message != null && message.length() > 0) {
            
            try {
                callbackContext.success(decrypt(message,client));
            } catch (Exception e) {
                callbackContext.error("Failed to encrypt message"+message+".");
            }
        } else {
            callbackContext.error("Expected one non-empty string arguments.");
        }
    }
    
    private static String decrypt(String text, String client) throws Exception {
        Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5Padding");
        byte[] keyBytes= new byte[16];
        byte[] b= client.getBytes("UTF-8");
        int len= b.length;
        if (len > keyBytes.length) len = keyBytes.length;
        System.arraycopy(b, 0, keyBytes, 0, len);
        SecretKeySpec keySpec = new SecretKeySpec(keyBytes, "AES");
        IvParameterSpec ivSpec = new IvParameterSpec(keyBytes);
        cipher.init(Cipher.DECRYPT_MODE,keySpec,ivSpec);
        
        byte [] results = cipher.doFinal(Base64.decode(text,Base64.DEFAULT));
        return new String(results,"UTF-8");
    }
}
