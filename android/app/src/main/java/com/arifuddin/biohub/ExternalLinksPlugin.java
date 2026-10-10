package com.arifuddin.biohub;
import android.content.Intent;
import android.net.Uri;
import android.content.ActivityNotFoundException;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
@CapacitorPlugin(name = "ExternalLinks")
public class ExternalLinksPlugin extends Plugin {
    @PluginMethod public void open(PluginCall call) {
        String url = call.getString("url");
        if (url == null) { call.reject("Missing link."); return; }
        Uri uri = Uri.parse(url);
        String scheme = uri.getScheme();
        if (!"mailto".equals(scheme) && !"tel".equals(scheme)) { call.reject("Unsupported link type."); return; }
        try {
            getActivity().startActivity(new Intent("tel".equals(scheme) ? Intent.ACTION_DIAL : Intent.ACTION_SENDTO, uri));
            call.resolve();
        } catch (ActivityNotFoundException e) { call.reject("No installed app can open this link."); }
    }
}
