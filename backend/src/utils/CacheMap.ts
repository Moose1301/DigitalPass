export interface Value<T> {
    value: T;
    tid: ReturnType<typeof setTimeout>;

}
export class CacheMap<K, V> {
    private defaultTimeout: number;
    private lookup: Map<K, Value<V>>;

    constructor (defaultTimeout: number) {
       this.lookup = new Map();
       this.defaultTimeout = defaultTimeout;
    }
    

    set(key: K, value: V, duration: number = this.defaultTimeout): boolean {
        const found = this.lookup.has(key)
        if (found) {
            clearTimeout(this.lookup.get(key)!.tid)
        };
        this.lookup.set(key, {
            value: value,
            tid: setTimeout(() => this.lookup.delete(key), duration)
        });
        return found;
    }

    get(key: K): V | undefined {
        return this.lookup.has(key) ? this.lookup.get(key)!.value : undefined;
    }
    clear(): void {
        this.lookup.clear();
    }
 
    delete(key: K): boolean {
        return this.lookup.delete(key);
    }

    count(): number {
        return this.lookup.size;
    }

    has(key: K): boolean {
        return this.lookup.has(key);
    }
}