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
    // CRON_FIELD_KEYS の順序に合わせてデフォルト設定を生成する。
    // reduce で Record を組み立て、各フィールドの初期値を埋める。
    const createDefaultConfigs = (): Record<CronFieldKey, FieldConfig> =>
        CRON_FIELD_KEYS.reduce(
            (acc, key) => {
                acc[key] = defaultFieldConfig(CRON_FIELDS[key]);
                return acc;
            },
            {} as Record<CronFieldKey, FieldConfig>
        );

    const [configs, setConfigs] = useState<Record<CronFieldKey, FieldConfig>>(createDefaultConfigs);
    const [copied, setCopied] = useState(false);
    // 画面表示用に、現在の設定から式と説明文を毎レンダーで導出する。
    const expression = buildCronExpression(configs);
    const description = describeCron(expression);

    /**
     * 特定のフィールドの設定を更新する関数
     *
     * @param key - 更新対象のフィールドのキー
     * @param config - 新しいフィールド設定（FieldConfig型）
     *
     * useCallbackでメモ化することで、この関数が不必要に再生成されるのを防ぎ、
     * 子コンポーネント(CronFieldEditor)の不要な再レンダリングを抑制する
     */
    const updateField = useCallback(
        (key: CronFieldKey, config: FieldConfig) => {
            setConfigs((prev) => ({
                ...prev,
                [key]: config,
            }));
        },
        []
    );

    const handleReset = () => {
        // ボタン押下時は全フィールドを初期値に戻す。
        setConfigs(createDefaultConfigs());
    };

    const handleCopy = async () => {
        // コピー完了メッセージは短時間のみ表示する。
        await navigator.clipboard.writeText(expression);
        setCopied(true);
        setTimeout(() => setCopied(false), 1000);
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
                {CRON_FIELD_KEYS.map((key: CronFieldKey) => (
                    <CronFieldEditor
                        key={key}
                        field={CRON_FIELDS[key]}
                        config={configs[key]}
                        onChangeFieldAction={(c) => updateField(key, c)}
                    />
                ))}
            </div>
        </section>
    );
}
