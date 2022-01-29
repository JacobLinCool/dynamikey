import type { Handler, Reaction, Rule } from "./types";

const default_handler: Handler = (path, params) => {
    console.error(`Path ${path.join(".")} called with params [ ${params.join(", ")} ]`);
    throw new Error(`No handler for path ${path.join(".")}`);
};

class Dynamikey {
    private rules: Rule[] = [];
    private root: object = {};

    public constructor(obj: object) {
        this.init(obj);
    }

    public add(match: string | RegExp, handler = default_handler, reaction: Reaction = "function"): this {
        if (typeof match === "string") {
            match = new RegExp(`^${match}$`);
        }

        this.rules.push([new RegExp(match), handler, reaction]);

        return this;
    }

    public init(obj: object): this {
        this.root = obj;
        return this;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public gen(): any {
        this.add(".*", default_handler);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return new Proxy(this.root, this.create_handler()) as any;
    }

    private create_handler(...prev: string[]): { get(target: object, name: string): unknown } {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const self = this;

        return {
            get(target: object, name: string): unknown {
                const raw = Reflect.get(target, name);

                if (typeof raw === "undefined") {
                    const path = [...prev, name];
                    const match = self.match(path);

                    if (match) {
                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                        const [handler, reaction] = match;

                        if (reaction === "function") {
                            const func = (...params: unknown[]) => handler(path, params);
                            return new Proxy(func, self.create_handler(...prev, name));
                        } else if (reaction === "value") {
                            return handler(path, []);
                        }
                    }

                    return undefined;
                }

                return raw;
            },
        };
    }

    private match(path: string[]): [Handler, Reaction] | undefined {
        const test = path.join(".");

        for (const [match, handler, reaction] of this.rules) {
            if (match.test(test)) {
                return [handler, reaction];
            }
        }

        return undefined;
    }
}

export { Dynamikey };
