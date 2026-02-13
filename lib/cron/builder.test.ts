import {describe, expect, it} from "vitest";
import {buildCronExpression, defaultFieldConfig, fieldConfigToExpression} from "./builder";
import {CRON_FIELDS, CRON_FIELD_KEYS} from "./types";
import type {CronFieldKey, FieldConfig} from "./types";

describe("builder constants", () => {
    it("keeps cron field order", () => {
        expect(CRON_FIELD_KEYS).toEqual(["minute", "hour", "day", "month", "day_of_week"]);
    });
});

describe("defaultFieldConfig", () => {
    it("creates a range-safe default config for each field", () => {
        const minute = defaultFieldConfig(CRON_FIELDS.minute);
        expect(minute).toEqual({
            mode: "every",
            intervalValue: 1,
            intervalStart: 0,
            specificValues: [],
            rangeStart: 0,
            rangeEnd: 59,
        });
    });
});

describe("fieldConfigToExpression", () => {
    it("returns wildcard for every mode", () => {
        const config = defaultFieldConfig(CRON_FIELDS.hour);
        expect(fieldConfigToExpression(config, CRON_FIELDS.hour)).toBe("*");
    });

    it("uses short interval expression when interval starts at min", () => {
        const config: FieldConfig = {
            ...defaultFieldConfig(CRON_FIELDS.minute),
            mode: "interval",
            intervalStart: 0,
            intervalValue: 5,
        };
        expect(fieldConfigToExpression(config, CRON_FIELDS.minute)).toBe("*/5");
    });

    it("sorts specific values before joining", () => {
        const config: FieldConfig = {
            ...defaultFieldConfig(CRON_FIELDS.minute),
            mode: "specific",
            specificValues: [30, 5, 10],
        };
        expect(fieldConfigToExpression(config, CRON_FIELDS.minute)).toBe("5,10,30");
    });

    it("returns wildcard when specific list is empty", () => {
        const config: FieldConfig = {
            ...defaultFieldConfig(CRON_FIELDS.day),
            mode: "specific",
            specificValues: [],
        };
        expect(fieldConfigToExpression(config, CRON_FIELDS.day)).toBe("*");
    });
});

describe("buildCronExpression", () => {
    it("joins all fields in cron order", () => {
        const configs: Record<CronFieldKey, FieldConfig> = {
            minute: {...defaultFieldConfig(CRON_FIELDS.minute), mode: "specific", specificValues: [5]},
            hour: {...defaultFieldConfig(CRON_FIELDS.hour), mode: "specific", specificValues: [8]},
            day: {...defaultFieldConfig(CRON_FIELDS.day), mode: "specific", specificValues: [15]},
            month: {...defaultFieldConfig(CRON_FIELDS.month), mode: "specific", specificValues: [2]},
            day_of_week: {...defaultFieldConfig(CRON_FIELDS.day_of_week), mode: "specific", specificValues: [1]},
        };

        expect(buildCronExpression(configs)).toBe("5 8 15 2 1");
    });
});
