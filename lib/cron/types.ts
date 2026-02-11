/**
 * Cronフィールドの定義型
 * 各フィールド（分、時、日、月、曜日）の設定情報を保持
 */
export type CronField = {
    label: string;  // フィールドの表示名
    min: number;    // 許可される最小値
    max: number;    // 許可される最大値
    names?: string[]; // 値の表示名（月や曜日など）
};

/**
 * Cronフィールドのキー型
 * Cron式の各フィールドを表すリテラル型
 */
export type CronFieldKey = "minute" | "hour" | "day" | "month" | "day_of_week";

/**
 * Cronフィールドの定義マップ
 * labelをキーとして、各フィールドの設定にアクセス可能
 *
 * 使用例: CRON_FIELDS["分"], CRON_FIELDS["時"]
 */
export const CRON_FIELDS: Record<CronFieldKey, CronField> = {
    "minute": {label: "分", min: 0, max: 59},
    "hour": {label: "時", min: 0, max: 23},
    "day": {label: "日", min: 1, max: 31},
    "month": {
        label: "月",
        min: 1,
        max: 12,
        names: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
    },
    "day_of_week": {label: "曜日", min: 0, max: 6, names: ["日", "月", "火", "水", "木", "金", "土"]},
};

/**
 * Cronフィールドのキー配列（CRON_FIELDSから導出）
 * Cron式の順序: 分 時 日 月 曜日
 */

export type FieldMode = "every" | "interval" | "specific" | "range";

export type FieldConfig = {
    mode: FieldMode;
    intervalValue: number;
    intervalStart: number;
    specificValues: number[];
    rangeStart: number;
    rangeEnd: number;
};
