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
export type CronFieldKey = "分" | "時" | "日" | "月" | "曜日";

/**
 * Cronフィールドのキー配列（順序を保持するため）
 * Cron式の順序: 分 時 日 月 曜日
 */
export const CRON_FIELD_KEYS: CronFieldKey[] = ["分", "時", "日", "月", "曜日"];

/**
 * Cronフィールドの定義マップ
 * labelをキーとして、各フィールドの設定にアクセス可能
 *
 * 使用例: CRON_FIELDS["分"], CRON_FIELDS["時"]
 */
export const CRON_FIELDS: Record<CronFieldKey, CronField> = {
    "分": {label: "分", min: 0, max: 59},
    "時": {label: "時", min: 0, max: 23},
    "日": {label: "日", min: 1, max: 31},
    "月": {
        label: "月",
        min: 1,
        max: 12,
        names: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
    },
    "曜日": {label: "曜日", min: 0, max: 6, names: ["日", "月", "火", "水", "木", "金", "土"]},
};


export type FieldMode = "every" | "interval" | "specific" | "range";

export type FieldConfig = {
    mode: FieldMode;
    intervalValue: number;
    intervalStart: number;
    specificValues: number[];
    rangeStart: number;
    rangeEnd: number;
};
