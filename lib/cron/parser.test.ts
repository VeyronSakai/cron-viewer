import {afterEach, describe, expect, it, vi} from "vitest";
import {describeCron, getNextExecutions, isValidCron} from "./parser";

describe("parser helpers", () => {
    afterEach(() => {
        vi.useRealTimers();
    });

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

    it("treats day-of-month and day-of-week as OR when both are restricted", () => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date(2026, 0, 1, 0, 0, 0, 0));

        const dates = getNextExecutions("0 0 31 2 1", 3);

        expect(dates).toHaveLength(3);
        dates.forEach((date) => {
            expect(date.getMonth()).toBe(1);
            expect(date.getDay()).toBe(1);
        });
    });
});
