export default class Random {
    static float(min: number, max: number): number {
        return Math.random() * (max - min) + min;
    }
    static int(min: number, max: number): number {
        return Math.floor(this.float(min, max+1));
    }
    static sign(): number {
        return this.bool() ? 1 : -1;
    }
    static bool(chance: number=.5): boolean {
        return Math.random() < chance;
    }
    static item<T>(array: T[]): T {
        return array[this.int(0, array.length-1)];
    }
}