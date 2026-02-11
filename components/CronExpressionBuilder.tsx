"use client";

import {useState, useCallback} from "react";
import {
    CRON_FIELDS,
    CRON_FIELD_KEYS,
    CronFieldKey,
    FieldConfig,
    defaultFieldConfig,
    buildCronExpression,
    describeCron,
} from "@/lib/cron";
import CronFieldEditor from "@/components/CronFieldEditor";

export default function CronExpressionBuilder() {
    const [configs, setConfigs] = useState<FieldConfig[]>(
        CRON_FIELD_KEYS.map((key: CronFieldKey) => defaultFieldConfig(CRON_FIELDS[key]))
    );
    const [copied, setCopied] = useState(false);
    const expression = buildCronExpression(configs);
    const description = describeCron(expression);

    /**
     * 特定のフィールドの設定を更新する関数
     *
     * @param index - 更新対象のフィールドのインデックス (0: 分, 1: 時, 2: 日, 3: 月, 4: 曜日)
     * @param config - 新しいフィールド設定（FieldConfig型）
     *
     * useCallbackでメモ化することで、この関数が不必要に再生成されるのを防ぎ、
     * 子コンポーネント(CronFieldEditor)の不要な再レンダリングを抑制する
     */
    const updateField = useCallback(
        (index: number, config: FieldConfig) => {
            // setConfigsの関数形式を使用して、最新の状態(prev)を取得
            setConfigs((prev) => {
                // スプレッド構文で既存の配列をシャローコピー（イミュータブルな更新のため）
                const next = [...prev];
                // 指定されたインデックスの要素のみを新しい設定で置き換え
                next[index] = config;
                // 新しい配列を返すことで、Reactが状態の変更を検知して再レンダリングを実行
                return next;
            });
        },
        // 依存配列が空なので、この関数はコンポーネントのライフサイクル全体で1度だけ生成される
        []
    );

    const handleReset = () => {
        setConfigs(CRON_FIELD_KEYS.map((key: CronFieldKey) => defaultFieldConfig(CRON_FIELDS[key])));
    };

    const handleCopy = async () => {
        await navigator.clipboard.writeText(expression);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <section className="space-y-4">
            <h2 className="text-xl font-bold">Cron式作成</h2>

            <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-800/50">
                <div className="flex items-center gap-3">
                    <code className="flex-1 font-mono text-xl font-bold text-blue-600 dark:text-blue-400">
                        {expression}
                    </code>
                    <button
                        onClick={handleCopy}
                        className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
                    >
                        {copied ? "コピー済み!" : "コピー"}
                    </button>
                    <button
                        onClick={handleReset}
                        className="rounded-lg border border-zinc-300 px-4 py-2 text-sm hover:bg-zinc-100 dark:border-zinc-600 dark:hover:bg-zinc-700"
                    >
                        リセット
                    </button>
                </div>
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{description}</p>
            </div>

            <div className="space-y-3">
                {CRON_FIELD_KEYS.map((key: CronFieldKey, i: number) => (
                    <CronFieldEditor
                        key={key}
                        field={CRON_FIELDS[key]}
                        config={configs[i]}
                        onChangeFieldAction={(c) => updateField(i, c)}
                    />
                ))}
            </div>
        </section>
    );
}
