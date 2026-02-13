"use client";

import {useEffect, useMemo, useState} from "react";
import {describeCron, isValidCron, getNextExecutions} from "@/lib/cron";

// 実行候補日時を画面表示用のフォーマットへ変換する。
function formatDate(d: Date): string {
    const pad = (n: number) => n.toString().padStart(2, "0");
    const dayNames = ["日", "月", "火", "水", "木", "金", "土"];
    return `${d.getFullYear()}/${pad(d.getMonth() + 1)}/${pad(d.getDate())}(${dayNames[d.getDay()]}) ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function CronExpressionChecker() {
    const [expression, setExpression] = useState("");
    const [debouncedExpression, setDebouncedExpression] = useState(expression);

    useEffect(() => {
        const timeoutId = window.setTimeout(() => setDebouncedExpression(expression), 300);
        return () => window.clearTimeout(timeoutId);
    }, [expression]);

    // 入力式から表示状態（妥当性/説明/次回実行）を都度導出する。
    const valid = expression.trim() !== "" && isValidCron(expression);
    const description = expression.trim() !== "" ? describeCron(expression) : "";
    // 入力が落ち着いてから次回実行を計算し、連続入力中の重い探索を抑える。
    const nextDates = useMemo(() => {
        if (!valid || debouncedExpression !== expression) {
            return [];
        }
        return getNextExecutions(expression, 5);
    }, [debouncedExpression, expression, valid]);

    return (
        <section className="space-y-4">
            <h2 className="text-xl font-bold">Cron式確認</h2>
            <div className="flex gap-2">
                <input
                    type="text"
                    value={expression}
                    onChange={(e) => setExpression(e.target.value)}
                    placeholder="例: */5 * * * *"
                    className="flex-1 rounded-lg border border-zinc-300 bg-white px-4 py-2 font-mono text-lg dark:border-zinc-600 dark:bg-zinc-800"
                />
                <button
                    // 解析結果も同時に初期化されるよう入力値のみを空に戻す。
                    onClick={() => setExpression("")}
                    className="rounded-lg border border-zinc-300 px-4 py-2 text-sm hover:bg-zinc-100 dark:border-zinc-600 dark:hover:bg-zinc-700"
                >
                    クリア
                </button>
            </div>
            {expression.trim() !== "" && (
                <div
                    className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-800/50">
                    <p className={`text-lg ${valid ? "text-zinc-800 dark:text-zinc-200" : "text-red-500"}`}>
                        {description}
                    </p>
                    {nextDates.length > 0 && (
                        <div className="mt-3">
                            <p className="mb-1 text-sm font-semibold text-zinc-500 dark:text-zinc-400">次回の実行日時:</p>
                            <ul className="space-y-0.5 font-mono text-sm text-zinc-700 dark:text-zinc-300">
                                {nextDates.map((d, i) => (
                                    <li key={i}>{formatDate(d)}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </section>
    );
}
