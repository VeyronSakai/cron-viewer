import cronstrue from "cronstrue/i18n";

export function describeCron(expression: string): string {
    try {
        return cronstrue.toString(expression, {locale: "ja", use24HourTimeFormat: true});
    } catch {
        return "無効なcron式です";
    }
}

export function isValidCron(expression: string): boolean {
    try {
        cronstrue.toString(expression);
        return true;
    } catch {
        return false;
    }
}

function expandField(expr: string, min: number, max: number): number[] {
    const values = new Set<number>();
    for (const part of expr.split(",")) {
        if (part === "*") {
            for (let i = min; i <= max; i++) values.add(i);
        } else if (part.includes("/")) {
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
            const [s, e] = part.split("-").map(Number);
            for (let i = s; i <= e; i++) values.add(i);
        } else {
            const n = parseInt(part);
            if (!isNaN(n)) values.add(n);
        }
    }
    return [...values].sort((a, b) => a - b);
}

export function getNextExecutions(expression: string, count: number = 5): Date[] {
    if (!isValidCron(expression)) return [];

    const parts = expression.trim().split(/\s+/);
    if (parts.length !== 5) return [];

    const [minExpr, hourExpr, domExpr, monExpr, dowExpr] = parts;
    const minutes = expandField(minExpr, 0, 59);
    const hours = expandField(hourExpr, 0, 23);
    const doms = expandField(domExpr, 1, 31);
    const months = expandField(monExpr, 1, 12);
    const dows = expandField(dowExpr, 0, 6);

    const results: Date[] = [];
    const now = new Date();
    const cursor = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes() + 1, 0, 0);

    const maxIterations = 525600; // 1 year of minutes
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
