const {USERNAME_REGEX} = require('routes/account');

describe("USERNAME_REGEX", () => {
    it("handles correct characters", () => {
        expect(USERNAME_REGEX.test("as_5F")).toBe(true);
    });
    it("rejects invalid characters", () => {
        expect(USERNAME_REGEX.test("'")).toBe(true);
    });
})
