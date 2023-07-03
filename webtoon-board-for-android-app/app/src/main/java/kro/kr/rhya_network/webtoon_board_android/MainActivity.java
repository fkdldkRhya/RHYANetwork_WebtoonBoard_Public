package kro.kr.rhya_network.webtoon_board_android;

import androidx.appcompat.app.AppCompatActivity;
import androidx.constraintlayout.widget.ConstraintLayout;

import android.os.Bundle;
import android.view.View;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.widget.Toast;

import com.github.ybq.android.spinkit.SpinKitView;

import kro.kr.rhya_network.webtoon_board_android.util.WebViewClientClass;

public class MainActivity extends AppCompatActivity {
    // UI Object 변수 선언
    private ConstraintLayout splashLayout;
    private SpinKitView splashSpinKit;
    private WebView webView;
    // 뒤로 가기 버튼 클릭 시간
    private long backBtnTime = 0;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        // Context
        final MainActivity thisActivity = this;
        // UI Object 변수 초기화
        splashLayout = findViewById(R.id.splashLayout);
        splashSpinKit = findViewById(R.id.spinKit);
        webView = findViewById(R.id.webView);

        // Splash 화면 애니메이션 적용
        splashLayout.animate().alpha(1f).setDuration(2000).withEndAction(() -> {
            // Progress Bar 표시
            splashSpinKit.setVisibility(View.VISIBLE);

            // WebView 초기화
            try {
                webView.getSettings().setJavaScriptEnabled(true);
                webView.setWebChromeClient(new WebChromeClient());
                webView.setWebViewClient(new WebViewClientClass(splashLayout));
                webView.getSettings().setDomStorageEnabled(true);
                webView.getSettings().setDefaultTextEncodingName("UTF-8");
                webView.getSettings().setDisplayZoomControls(true);
                webView.getSettings().setJavaScriptCanOpenWindowsAutomatically(false);
                webView.getSettings().setLoadWithOverviewMode(true);
                webView.getSettings().setLoadWithOverviewMode(true);
                webView.getSettings().setSupportZoom(false);
                webView.getSettings().setAllowFileAccessFromFileURLs(true);
                webView.getSettings().setAllowContentAccess(true);
                webView.getSettings().setBuiltInZoomControls(false);
                webView.getSettings().setAllowFileAccess(true);
                webView.getSettings().setCacheMode(WebSettings.LOAD_NO_CACHE);
                webView.loadUrl("https://webtoon-board.rhya-network.kro.kr/");
            }catch (Exception ex) {
                Toast.makeText(thisActivity, String.format("WebView 초기화 중 오류 발생! (%s)", ex.getMessage()), Toast.LENGTH_SHORT).show();
            }
        });
    }

    @Override
    public void onBackPressed() {
        if (webView.canGoBack()) {
            webView.goBack();
        }else {
            backButtonPressAndExitEvent();
        } // if-else end
    }

    private void backButtonPressAndExitEvent() {
        long curTime = System.currentTimeMillis();
        long gapTime = curTime - backBtnTime;

        if (0 <= gapTime && 2000 >= gapTime) {
            // 종료
            finish();
        }else {
            backBtnTime = curTime;
            Toast.makeText(getApplicationContext(), "'뒤로' 버튼을 한번 더 누르시면 종료됩니다.", Toast.LENGTH_SHORT).show();
        } // if-else end
    }
}