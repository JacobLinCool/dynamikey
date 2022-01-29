import Dynamikey from "../index";

describe("Dynamikey", () => {
    const dynamikey = new Dynamikey({
        a: 123,
        b: () => 456,
        c: {
            d: 789,
        },
    })
        .add(/^test\.id-\d{3}$/, (path) => "test no. " + path[1].substring(3))
        .add(/^no-\d{3}$/, (path) => "No. " + path[0].substring(3), "value")
        .add(/^sum-\d{1,10}$/, (path, params) => +path[0].substring(4) + (<number[]>params).reduce((a, b) => a + b, 0))
        .gen();

    it("should be able to get value of existing key", () => {
        expect(dynamikey.a).toBe(123);
    });

    it("should be able to get value of existing function key", () => {
        expect(dynamikey.b).toBeInstanceOf(Function);
        expect(dynamikey.b()).toBe(456);
    });

    it("should be able to get value of existing nested key", () => {
        expect(dynamikey.c.d).toBe(789);
    });

    it("should be able to get value of non-existing key that returns a function", () => {
        expect(dynamikey.test["id-123"]()).toBe("test no. 123");
    });

    it("should be able to get value of non-existing key that returns a function with parameters", () => {
        expect(dynamikey["sum-1000"](1, 2, 3)).toBe(1006);
    });

    it("should be able to get value of non-existing key that returns a value", () => {
        expect(dynamikey["no-123"]).toBe("No. 123");
    });

    it("should be able to throw an error with unconfigured key", () => {
        expect(dynamikey.error.should.found).toThrow(Error);
    });
});
