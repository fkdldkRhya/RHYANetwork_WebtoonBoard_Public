package kro.kr.rhya_network.webtoon_board_android.util;

import android.view.View;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import androidx.constraintlayout.widget.ConstraintLayout;

public class WebViewClientClass extends WebViewClient {
    private final ConstraintLayout splashLayout;

    public WebViewClientClass(ConstraintLayout splashLayout) {
        this.splashLayout = splashLayout;
    }

    @Override
    public void onPageFinished(WebView view, String url) {
        if (url.contains("rhya-network.kro.kr")) {
            splashLayout.setVisibility(ConstraintLayout.GONE);
            view.setVisibility(View.VISIBLE);
        }
    }
}
