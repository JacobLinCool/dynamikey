/**
 * @param path The access path to the target.
 * @param params The parameters that will be passed to the handler.
 */
export type Handler<T = unknown[], K = unknown> = (path: string[], params: T) => K;

/**
 * The reaction of the handler.
 * `function` means that the handler will be returned as a function.
 * `value` means that the handler will be evaluated and returned as a value.
 */
export type Reaction = "function" | "value";

export type Rule = [RegExp, Handler, Reaction];
