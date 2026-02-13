import cronstrue from "cronstrue/i18n";

/**
 * cron式を日本語の自然文へ変換する。
 */
export function describeCron(expression: string): string {
    try {
        return cronstrue.toString(expression, {locale: "ja", use24HourTimeFormat: true});
    } catch {
        // UI側ではこの文言をそのまま表示する。
        return "無効なcron式です";
    }
}

/**
 * cronstrue のパース可否を使ってcron式の妥当性を判定する。
 */
export function isValidCron(expression: string): boolean {
    try {
        cronstrue.toString(expression);
        return true;
    } catch {
        return false;
    }
}

// 1つのcronフィールド式（例: "*/5,10-20"）を数値配列へ展開する。
function expandField(expr: string, min: number, max: number): number[] {
    const values = new Set<number>();
    for (const part of expr.split(",")) {
        if (part === "*") {
            for (let i = min; i <= max; i++) values.add(i);
        } else if (part.includes("/")) {
            // "*/5" / "10-30/5" / "15/10" のようなステップ指定を処理する。
            const [rangeOrStart, stepStr] = part.split("/");
            const step = parseInt(stepStr);
            let start = min;
            let end = max;
            if (rangeOrStart !== "*") {
                if (rangeOrStart.includes("-")) {
                    const [s, e] = rangeOrStart.split("-").map(Number);
                    start = s;
                    end = e;
                } else {
                    start = parseInt(rangeOrStart);
                }
            }
            for (let i = start; i <= end; i += step) values.add(i);
        } else if (part.includes("-")) {
            // "10-20" のような範囲指定。
            const [s, e] = part.split("-").map(Number);
            for (let i = s; i <= e; i++) values.add(i);
        } else {
            // 単一値（例: "5"）。
            const n = parseInt(part);
            if (!isNaN(n)) values.add(n);
        }
    }
    return [...values].sort((a, b) => a - b);
}

/**
 * 次回実行日時を分単位で探索して最大 count 件返す。
 */
export function getNextExecutions(expression: string, count: number = 5): Date[] {
    // 解析不能な式は空配列を返す。
    if (!isValidCron(expression)) return [];

    // 本アプリは標準の5フィールド形式（分 時 日 月 曜日）のみを対象とする。
    const parts = expression.trim().split(/\s+/);
    if (parts.length !== 5) return [];

    const [minExpr, hourExpr, domExpr, monExpr, dowExpr] = parts;
    // 各フィールド式を比較しやすい数値配列に展開する。
    const minutes = expandField(minExpr, 0, 59);
    const hours = expandField(hourExpr, 0, 23);
    const doms = expandField(domExpr, 1, 31);
    const months = expandField(monExpr, 1, 12);
    const dows = expandField(dowExpr, 0, 6);

    const results: Date[] = [];
    const now = new Date();
    // 現在時刻そのものではなく「次の1分」から探索を開始する。
    const cursor = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes() + 1, 0, 0);

    // 無限ループ回避のため、探索範囲は最大1年分に制限する。
    const maxIterations = 525600; // 1 year of minutes
    // 1分ずつ未来へ進めながら一致する日時を必要件数ぶん集める。
    for (let i = 0; i < maxIterations && results.length < count; i++) {
        const m = cursor.getMinutes();
        const h = cursor.getHours();
        const dom = cursor.getDate();
        const mon = cursor.getMonth() + 1;
        const dow = cursor.getDay();

        if (
            minutes.includes(m) &&
            hours.includes(h) &&
            doms.includes(dom) &&
            months.includes(mon) &&
            dows.includes(dow)
        ) {
            results.push(new Date(cursor));
        }
        cursor.setMinutes(cursor.getMinutes() + 1);
    }

    return results;
}
