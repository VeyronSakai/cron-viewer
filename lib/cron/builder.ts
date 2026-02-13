import {CronField, FieldConfig, CRON_FIELDS, CRON_FIELD_KEYS, CronFieldKey} from "./types";

/**
 * 指定フィールドに対する編集UIの初期設定を作る。
 * interval/range の初期値はフィールド範囲で埋める。
 */
export function defaultFieldConfig(field: CronField): FieldConfig {
    // 各モードの初期値はフィールドの有効範囲内で作る。
    return {
        mode: "every",
        intervalValue: 1,
        intervalStart: field.min,
        specificValues: [],
        rangeStart: field.min,
        rangeEnd: field.max,
    };
}

/**
 * フィールド単位のUI設定をcron記法の文字列へ変換する。
 * 例: interval(0開始, 5刻み) は5分刻みの記法へ変換される。
 */
export function fieldConfigToExpression(config: FieldConfig, field: CronField): string {
    switch (config.mode) {
        case "every":
            return "*";
        case "interval":
            // 最小値始まりは短縮記法 "*/N" を使う。
            if (config.intervalStart === field.min) {
                return `*/${config.intervalValue}`;
            }
            return `${config.intervalStart}/${config.intervalValue}`;
        case "specific":
            // 値未選択は "毎回" と同義なので "*" に倒す。
            if (config.specificValues.length === 0) {
                return "*";
            }

            // 出力の順序を固定するために昇順で連結する。
            return [...config.specificValues].sort((a, b) => a - b).join(",");
        case "range":
            return `${config.rangeStart}-${config.rangeEnd}`;
        default:
            return "*";
    }
}

/**
 * 5フィールド分の設定をcron式1行へ結合する。
 */
export function buildCronExpression(configs: Record<CronFieldKey, FieldConfig>): string {
    // Cron式の順序（分 時 日 月 曜日）で各フィールドを結合する。
    return CRON_FIELD_KEYS
        .map((key) => fieldConfigToExpression(configs[key], CRON_FIELDS[key]))
        .join(" ");
}
