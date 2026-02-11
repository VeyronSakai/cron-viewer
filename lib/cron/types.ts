export type CronField = {
    label: string;
    min: number;
    max: number;
    names?: string[];
};

export const CRON_FIELDS: CronField[] = [
    {label: "分", min: 0, max: 59},
    {label: "時", min: 0, max: 23},
    {label: "日", min: 1, max: 31},
    {
        label: "月",
        min: 1,
        max: 12,
        names: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
    },
    {label: "曜日", min: 0, max: 6, names: ["日", "月", "火", "水", "木", "金", "土"]},
];

export type FieldMode = "every" | "interval" | "specific" | "range";

export type FieldConfig = {
    mode: FieldMode;
    intervalValue: number;
    intervalStart: number;
    specificValues: number[];
    rangeStart: number;
    rangeEnd: number;
};
