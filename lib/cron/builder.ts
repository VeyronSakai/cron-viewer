import {CronField, FieldConfig, CRON_FIELDS} from "./types";

export function defaultFieldConfig(field: CronField): FieldConfig {
    return {
        mode: "every",
        intervalValue: 1,
        intervalStart: field.min,
        specificValues: [],
        rangeStart: field.min,
        rangeEnd: field.max,
    };
}

export function fieldConfigToExpression(config: FieldConfig, field: CronField): string {
    switch (config.mode) {
        case "every":
            return "*";
        case "interval":
            if (config.intervalStart === field.min) {
                return `*/${config.intervalValue}`;
            }
            return `${config.intervalStart}/${config.intervalValue}`;
        case "specific":
            if (config.specificValues.length === 0) return "*";
            return [...config.specificValues].sort((a, b) => a - b).join(",");
        case "range":
            return `${config.rangeStart}-${config.rangeEnd}`;
        default:
            return "*";
    }
}

export function buildCronExpression(configs: FieldConfig[]): string {
    return configs.map((c, i) => fieldConfigToExpression(c, CRON_FIELDS[i])).join(" ");
}
