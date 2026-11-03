import type { ExplorationReport, ExplorationSource, WorkOrder } from '../contracts.js';
import type { SqliteFusionStore } from '../task/sqlite-store.js';
import type { WorkspaceSnapshot } from './workspace.js';
/**
 * Source-backed handoff. Completed reports are checked against the files they cite,
 * not against every other file in a non-git root. blocked and needs-decision reports
 * are always recorded, with drift or a failed whole-tree snapshot named, and are not acceptance.
 *
 * A completed report normally cites 1–12 ranges. Zero ranges are accepted only when
 * the frozen baseline and the listing taken at submit time both contain no entries,
 * and the summary states that the scope is empty. The sentence is not proof: a
 * non-empty listing still requires 1–12 ranges, including when a search matched nothing.
 *
 * `current` is omitted when snapshotting the tree threw. The failure is stored on a
 * non-completed report. A completed report ignores that unrelated failure and still
 * stands or falls on the cited files alone. Zero ranges cannot use that path, because
 * there is no cited file to check and the live listing was not confirmed empty.
 */
export declare function captureExploration(store: SqliteFusionStore, order: WorkOrder, baseline: WorkspaceSnapshot, current: WorkspaceSnapshot | undefined, submitted: Pick<ExplorationReport, 'summary' | 'status' | 'unresolved'>, sources: readonly ExplorationSource[], snapshotFailure?: string): ExplorationReport;
/** Path of the first cited file whose bytes no longer match the captured digest, if any. */
export declare function citedEvidenceChanged(root: string, baseline: WorkspaceSnapshot, report: Pick<ExplorationReport, 'sources'>): string | undefined;
