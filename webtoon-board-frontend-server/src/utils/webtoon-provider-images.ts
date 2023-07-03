export function getProviderImage(provider: string) : string {
    switch (provider.toLocaleUpperCase()) {
        case "NAVER":
            return "/webtoon-provider/naver.png";
        default:
            return "";
    }
}