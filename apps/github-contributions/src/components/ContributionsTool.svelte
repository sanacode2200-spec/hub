<script lang="ts">
  import { onMount } from "svelte";

  // GitHub Contributions Visualizer
  // データ取得: https://github-contributions-api.jogruber.de/v4/<user>?y=<year>
  // CORS対応・トークン不要のパブリックAPI

  type View = "Year" | "Month";
  type Theme = "Green" | "Amber" | "Violet";
  type Level = 0 | 1 | 2 | 3 | 4;

  type Day = {
    date: string; // "YYYY-MM-DD"
    count: number;
    level: Level;
  };

  type ApiResponse = {
    total: Record<string, number>;
    contributions: Day[];
  };

  // レベル1..4の色（レベル0は rgba(255,255,255,0.06)）
  const THEMES: Record<Theme, [string, string, string, string]> = {
    Green: ["#0e4429", "#006d32", "#26a641", "#39d353"],
    Amber: ["#7a3a12", "#b5611d", "#e08a2e", "#ffb454"],
    Violet: ["#3b2b6b", "#5b46a8", "#8266d6", "#b59bff"],
  };

  const EMPTY_COLOR = "rgba(255,255,255,0.06)";

  const MONTHS = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const VIEW_LABELS: Record<View, string> = {
    Year: "年",
    Month: "月",
  };

  const CURRENT_YEAR = new Date().getFullYear();
  // 直近8年（現在の年を含む、新しい順）
  const YEARS: number[] = Array.from({ length: 8 }, (_, i) => CURRENT_YEAR - i);

  let username = $state("sanacode2200-spec");
  let year = $state<number>(CURRENT_YEAR);
  let view = $state<View>("Year");
  let month = $state<number>(0); // 0..11
  let theme = $state<Theme>("Green");

  let days = $state<Day[]>([]);
  let yearTotal = $state<number>(0);
  let loading = $state(false);
  let errorMsg = $state<string | null>(null);

  // 連打・年切り替えで古いレスポンスが後から返ってきた場合に上書きしないためのカウンタ
  let latestRequestId = 0;

  // テーマに応じてレベルから色を返す
  function levelColor(level: Level, t: Theme): string {
    if (level === 0) return EMPTY_COLOR;
    return THEMES[t][level - 1];
  }

  // 日付文字列をローカルにパースして曜日を得る
  function parseDate(date: string): { y: number; m: number; d: number; wd: number } {
    const [y, m, d] = date.split("-").map(Number);
    const dt = new Date(y, m - 1, d);
    return { y, m, d, wd: dt.getDay() };
  }

  // ===== データ取得 =====
  async function load() {
    const user = username.trim();
    if (!user) {
      errorMsg = "GitHubのユーザー名を入力してください";
      return;
    }
    loading = true;
    errorMsg = null;
    const requestId = ++latestRequestId;
    try {
      const res = await fetch(
        `https://github-contributions-api.jogruber.de/v4/${encodeURIComponent(user)}?y=${year}`
      );
      if (requestId !== latestRequestId) return;
      if (res.status === 404) throw new Error("not found");
      if (!res.ok) throw new Error("request failed");
      const data: ApiResponse = await res.json();
      if (!data || !Array.isArray(data.contributions)) throw new Error("bad data");
      days = data.contributions;
      yearTotal = data.total?.[String(year)] ?? 0;
    } catch (err) {
      if (requestId !== latestRequestId) return;
      days = [];
      yearTotal = 0;
      errorMsg =
        err instanceof Error && err.message === "not found"
          ? "ユーザーが見つかりません。ユーザー名を確認してください"
          : "データの取得に失敗しました。時間をおいて再度お試しください";
    } finally {
      if (requestId === latestRequestId) loading = false;
    }
  }

  function onKey(e: KeyboardEvent) {
    if (e.key === "Enter") load();
  }

  function selectYear(y: number) {
    year = y;
    load();
  }

  // ===== 年表示: 週カラム × 曜日行に整形 =====
  type Column = (Day | null)[]; // 長さ7、index=曜日（0=Sun .. 6=Sat）

  const columns = $derived.by<Column[]>(() => {
    const cols: Column[] = [];
    let current: Column | null = null;
    for (let i = 0; i < days.length; i++) {
      const day = days[i];
      const { wd } = parseDate(day.date);
      // 週の先頭(日曜)または最初の日で新しいカラムを開始
      if (wd === 0 || i === 0) {
        current = [null, null, null, null, null, null, null];
        cols.push(current);
      }
      if (current) current[wd] = day;
    }
    return cols;
  });

  // 月ラベル: 各月が最初に現れるカラムindexにラベルを置く
  const monthLabels = $derived.by<{ index: number; label: string }[]>(() => {
    const labels: { index: number; label: string }[] = [];
    let lastMonth = -1;
    columns.forEach((col, ci) => {
      // カラム内で最初に存在する日を見つける
      const firstDay = col.find((d) => d !== null) as Day | undefined;
      if (!firstDay) return;
      const { m } = parseDate(firstDay.date);
      if (m !== lastMonth) {
        lastMonth = m;
        labels.push({ index: ci, label: MONTHS[m - 1] });
      }
    });
    return labels;
  });

  // セル+ギャップの幅 (11px + 3px gap)
  const COL_STEP = 14;

  // ===== 月表示: カレンダー整形 =====
  // 選択月の日のみ抽出
  const monthDays = $derived.by<Day[]>(() =>
    days.filter((d) => {
      const { m } = parseDate(d.date);
      return m - 1 === month;
    })
  );

  // カレンダーセル（先頭/末尾の空白を含む）
  const calCells = $derived.by<(Day | null)[]>(() => {
    if (monthDays.length === 0) return [];
    const first = parseDate(monthDays[0].date);
    const cells: (Day | null)[] = [];
    for (let i = 0; i < first.wd; i++) cells.push(null); // 先頭の空白
    for (const d of monthDays) cells.push(d);
    // 末尾を7の倍数まで埋める
    while (cells.length % 7 !== 0) cells.push(null);
    return cells;
  });

  // 月表示のカラーが明るい場合は文字を暗くする（level 3,4）
  function isDarkText(level: Level): boolean {
    return level >= 3;
  }

  // ===== 統計 =====
  const stats = $derived.by(() => {
    let busiestCount = 0;
    let busiestDate = "";
    let activeDays = 0;
    let longestStreak = 0;
    let currentStreak = 0;
    for (const d of days) {
      if (d.count > 0) {
        activeDays++;
        currentStreak++;
        if (currentStreak > longestStreak) longestStreak = currentStreak;
      } else {
        currentStreak = 0;
      }
      if (d.count > busiestCount) {
        busiestCount = d.count;
        busiestDate = d.date;
      }
    }
    return { busiestCount, busiestDate, activeDays, longestStreak };
  });

  // ===== 初回マウント時に一度だけ自動取得（依存を追跡しない） =====
  onMount(() => {
    load();
  });
</script>

<section class="glass-card gh-card" aria-label="GitHub Contributions">
  <!-- Toolbar -->
  <div class="gh-toolbar">
    <div class="gh-load-row">
      <input
        type="text"
        class="qr-field"
        bind:value={username}
        onkeydown={onKey}
        placeholder="GitHubのユーザー名（例: torvalds）"
        autocapitalize="off"
        autocorrect="off"
        spellcheck="false"
      />
      <button type="button" class="qr-action" onclick={load}>表示</button>
    </div>

    <div class="gh-controls-row">
      <div class="gh-control">
        <span class="qr-section-label">年</span>
        <div class="option-tabs">
          {#each YEARS as y (y)}
            <button
              type="button"
              class="option-tab"
              class:is-active={year === y}
              onclick={() => selectYear(y)}
            >
              {y}
            </button>
          {/each}
        </div>
      </div>

      <div class="gh-control">
        <span class="qr-section-label">表示</span>
        <div class="option-tabs">
          {#each ["Year", "Month"] as v (v)}
            <button
              type="button"
              class="option-tab"
              class:is-active={view === v}
              onclick={() => (view = v as View)}
            >
              {VIEW_LABELS[v as View]}
            </button>
          {/each}
        </div>
      </div>

      <div class="gh-control">
        <span class="qr-section-label">テーマ</span>
        <div class="option-tabs">
          {#each ["Green", "Amber", "Violet"] as t (t)}
            <button
              type="button"
              class="option-tab"
              class:is-active={theme === t}
              onclick={() => (theme = t as Theme)}
            >
              {t}
            </button>
          {/each}
        </div>
      </div>
    </div>

    {#if view === "Month"}
      <div class="gh-control">
        <span class="qr-section-label">月</span>
        <div class="option-tabs">
          {#each MONTHS as m, i (m)}
            <button
              type="button"
              class="option-tab"
              class:is-active={month === i}
              onclick={() => (month = i)}
            >
              {m}
            </button>
          {/each}
        </div>
      </div>
    {/if}
  </div>

  {#if errorMsg}
    <div class="gh-error">⚠ {errorMsg}</div>
  {/if}

  <!-- Graph -->
  <div class="gh-graph">
    {#if loading}
      <div class="gh-graph-loading">読み込み中…</div>
    {:else if days.length === 0}
      <div class="gh-graph-empty">表示できるデータがありません。</div>
    {:else if view === "Year"}
      <div class="gh-heatmap">
        <div class="gh-month-labels">
          {#each monthLabels as ml (ml.index)}
            <span class="gh-month-label" style={`left:${ml.index * COL_STEP}px`}>
              {ml.label}
            </span>
          {/each}
        </div>
        <div class="gh-weeks">
          {#each columns as col, ci (ci)}
            <div class="gh-week">
              {#each col as cell, ri (ri)}
                {#if cell}
                  <div
                    class="gh-cell"
                    style={`background:${levelColor(cell.level, theme)}`}
                    title={`${cell.date}: ${cell.count} 件のContributions`}
                  ></div>
                {:else}
                  <div class="gh-cell is-empty"></div>
                {/if}
              {/each}
            </div>
          {/each}
        </div>
      </div>
    {:else}
      <div class="gh-cal">
        {#each WEEKDAYS as wd (wd)}
          <div class="gh-cal-head">{wd}</div>
        {/each}
        {#each calCells as cell, ci (ci)}
          {#if cell}
            <div
              class="gh-cal-cell"
              class:is-dark={isDarkText(cell.level)}
              style={`background:${levelColor(cell.level, theme)}`}
              title={`${cell.date}: ${cell.count} 件のContributions`}
            >
              {parseDate(cell.date).d}
            </div>
          {:else}
            <div class="gh-cal-cell is-blank"></div>
          {/if}
        {/each}
      </div>
    {/if}
  </div>

  <!-- Stats -->
  {#if days.length > 0 && !loading}
    <div class="gh-stats">
      <div class="gh-stat">
        <span class="gh-stat-label">合計</span>
        <span class="gh-stat-value">{yearTotal.toLocaleString()}</span>
        <span class="gh-stat-sub">{year}年のContributions</span>
      </div>
      <div class="gh-stat">
        <span class="gh-stat-label">最も活発な日</span>
        <span class="gh-stat-value">{stats.busiestCount}</span>
        <span class="gh-stat-sub">{stats.busiestDate || "—"}</span>
      </div>
      <div class="gh-stat">
        <span class="gh-stat-label">最長連続日数</span>
        <span class="gh-stat-value">{stats.longestStreak}</span>
        <span class="gh-stat-sub">日連続</span>
      </div>
      <div class="gh-stat">
        <span class="gh-stat-label">活動日数</span>
        <span class="gh-stat-value">{stats.activeDays}</span>
        <span class="gh-stat-sub">日間活動</span>
      </div>
    </div>

    <!-- Legend -->
    <div class="gh-legend">
      <span>Less</span>
      <span class="gh-legend-cells">
        <span class="gh-legend-cell" style={`background:${EMPTY_COLOR}`}></span>
        <span class="gh-legend-cell" style={`background:${levelColor(1, theme)}`}></span>
        <span class="gh-legend-cell" style={`background:${levelColor(2, theme)}`}></span>
        <span class="gh-legend-cell" style={`background:${levelColor(3, theme)}`}></span>
        <span class="gh-legend-cell" style={`background:${levelColor(4, theme)}`}></span>
      </span>
      <span>More</span>
    </div>
  {/if}
</section>
