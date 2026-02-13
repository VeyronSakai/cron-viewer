import {describe, expect, it} from "vitest";
import {describeCron, getNextExecutions, isValidCron} from "./parser";

describe("parser helpers", () => {
    it("validates cron expressions", () => {
        expect(isValidCron("*/5 * * * *")).toBe(true);
        expect(isValidCron("invalid cron")).toBe(false);
    });

    it("describes valid cron and returns fallback for invalid cron", () => {
        expect(describeCron("invalid cron")).toBe("無効なcron式です");
        expect(describeCron("*/10 * * * *")).not.toBe("無効なcron式です");
    });

    it("returns next executions that match the expression", () => {
        const dates = getNextExecutions("*/15 * * * *", 3);

        expect(dates).toHaveLength(3);
        dates.forEach((date, index) => {
            expect(date.getSeconds()).toBe(0);
            expect(date.getMilliseconds()).toBe(0);
            expect(date.getMinutes() % 15).toBe(0);
            if (index > 0) {
                expect(date.getTime()).toBeGreaterThan(dates[index - 1].getTime());
            }
        });
    });

    it("returns empty array for invalid cron", () => {
        expect(getNextExecutions("invalid cron", 3)).toEqual([]);
    });
});
