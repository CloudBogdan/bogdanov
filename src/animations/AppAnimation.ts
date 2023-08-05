export default class AppAnimation {
    static timeScale: number = 1;
    static isPageLoaded: boolean = false;

    static getIsMobile(): boolean {
        return navigator.userAgent.toLowerCase().indexOf("mobile") >= 0;
    }
}