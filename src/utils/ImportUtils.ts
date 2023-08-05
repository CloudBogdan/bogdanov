export default class ImportUtils {
    static importImage(path: string): string {
        return new URL(path, import.meta.url).href;
    }
}