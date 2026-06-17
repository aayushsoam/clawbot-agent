import type * as React from 'react'
import { useCallback, useEffect, useMemo, useState } from 'react'

import {
  disableAgentPlugin,
  enableAgentPlugin,
  getPluginsHub,
  type HubAgentPluginRow,
  installAgentPlugin,
  type PluginsHubResponse,
  removeAgentPlugin,
  rescanPlugins,
  savePluginProviders,
  setPluginVisibility,
  updateAgentPlugin
} from '@/clawbot'
import { PageLoader } from '@/components/page-loader'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Codicon } from '@/components/ui/codicon'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { useI18n } from '@/i18n'
import { cn } from '@/lib/utils'
import { notify, notifyError } from '@/store/notifications'

import { useRefreshHotkey } from '../hooks/use-refresh-hotkey'
import { PageSearchShell } from '../page-search-shell'
import type { SetStatusbarItemGroup } from '../shell/statusbar-controls'

// Select maps an empty string to an empty label, so built-in memory needs a
// real sentinel value that we translate back to "" before saving.
const MEMORY_PROVIDER_BUILTIN = '__clawbot_memory_builtin__'
const CONTEXT_ENGINE_DEFAULT = 'compressor'

function statusVariant(status: HubAgentPluginRow['runtime_status']): 'default' | 'destructive' | 'muted' {
  if (status === 'enabled') {
    return 'default'
  }

  if (status === 'disabled') {
    return 'destructive'
  }

  return 'muted'
}

function matchesQuery(row: HubAgentPluginRow, query: string): boolean {
  const q = query.trim().toLowerCase()

  if (!q) {
    return true
  }

  return (
    row.name.toLowerCase().includes(q) ||
    row.description.toLowerCase().includes(q) ||
    row.source.toLowerCase().includes(q)
  )
}

interface PluginsViewProps extends React.ComponentProps<'section'> {
  setStatusbarItemGroup?: SetStatusbarItemGroup
}

export function PluginsView({ setStatusbarItemGroup: _setStatusbarItemGroup, ...props }: PluginsViewProps) {
  const { t } = useI18n()
  const p = t.plugins

  const [hub, setHub] = useState<PluginsHubResponse | null>(null)
  const [query, setQuery] = useState('')
  const [refreshing, setRefreshing] = useState(false)
  const [rescanBusy, setRescanBusy] = useState(false)
  const [rowBusy, setRowBusy] = useState<string | null>(null)

  const [installId, setInstallId] = useState('')
  const [installForce, setInstallForce] = useState(false)
  const [installEnable, setInstallEnable] = useState(true)
  const [installBusy, setInstallBusy] = useState(false)

  const [memorySel, setMemorySel] = useState(MEMORY_PROVIDER_BUILTIN)
  const [contextSel, setContextSel] = useState(CONTEXT_ENGINE_DEFAULT)
  const [providerBusy, setProviderBusy] = useState(false)

  const [removeTarget, setRemoveTarget] = useState<string | null>(null)

  const loadHub = useCallback(async () => {
    setRefreshing(true)

    try {
      const next = await getPluginsHub()
      setHub(next)
      setMemorySel(next.providers.memory_provider || MEMORY_PROVIDER_BUILTIN)
      setContextSel(next.providers.context_engine || CONTEXT_ENGINE_DEFAULT)
    } catch (err) {
      notifyError(err, p.loadFailed)
    } finally {
      setRefreshing(false)
    }
  }, [p.loadFailed])

  useRefreshHotkey(loadHub)

  useEffect(() => {
    void loadHub()
  }, [loadHub])

  const rows = useMemo(() => (hub ? hub.plugins.filter(row => matchesQuery(row, query)) : []), [hub, query])

  const runRow = useCallback(
    async (name: string, fn: () => Promise<unknown>, success: string) => {
      setRowBusy(name)

      try {
        await fn()
        notify({ kind: 'success', message: success })
        await loadHub()
      } catch (err) {
        notifyError(err, p.actionFailed)
      } finally {
        setRowBusy(null)
      }
    },
    [loadHub, p.actionFailed]
  )

  const onInstall = useCallback(async () => {
    const id = installId.trim()

    if (!id) {
      notify({ kind: 'warning', message: p.installHint })

      return
    }

    setInstallBusy(true)

    try {
      const res = await installAgentPlugin({ identifier: id, force: installForce, enable: installEnable })
      notify({ kind: 'success', message: p.installed(res.plugin_name ?? id) })

      if (res.warnings?.length) {
        notify({ kind: 'warning', message: res.warnings.join(' ') })
      }

      if (res.missing_env?.length) {
        notify({ kind: 'warning', message: p.missingEnv(res.missing_env.join(', ')) })
      }

      setInstallId('')
      await loadHub()
    } catch (err) {
      notifyError(err, p.installFailed)
    } finally {
      setInstallBusy(false)
    }
  }, [installEnable, installForce, installId, loadHub, p])

  const onRescan = useCallback(async () => {
    setRescanBusy(true)

    try {
      const res = await rescanPlugins()
      notify({ kind: 'success', message: p.rescanned(res.count) })
      await loadHub()
    } catch (err) {
      notifyError(err, p.rescanFailed)
    } finally {
      setRescanBusy(false)
    }
  }, [loadHub, p])

  const onSaveProviders = useCallback(async () => {
    setProviderBusy(true)

    try {
      await savePluginProviders({
        memory_provider: memorySel === MEMORY_PROVIDER_BUILTIN ? '' : memorySel,
        context_engine: contextSel
      })
      notify({ kind: 'success', message: p.savedProviders })
      await loadHub()
    } catch (err) {
      notifyError(err, p.saveProvidersFailed)
    } finally {
      setProviderBusy(false)
    }
  }, [contextSel, loadHub, memorySel, p])

  const providers = hub?.providers
  const orphans = hub?.orphan_dashboard_plugins ?? []

  return (
    <PageSearchShell
      {...props}
      onSearchChange={setQuery}
      searchHidden={!hub}
      searchPlaceholder={p.search}
      searchTrailingAction={
        <Button
          aria-label={refreshing ? p.refreshing : p.refresh}
          className="text-(--ui-text-tertiary) hover:bg-transparent hover:text-foreground"
          disabled={refreshing}
          onClick={() => void loadHub()}
          size="icon-xs"
          title={refreshing ? p.refreshing : p.refresh}
          type="button"
          variant="ghost"
        >
          <Codicon name="refresh" size="0.875rem" spinning={refreshing} />
        </Button>
      }
      searchValue={query}
    >
      {!hub ? (
        <PageLoader label={p.loading} />
      ) : (
        <div className="h-full overflow-y-auto px-4 py-3">
          <div className="mx-auto flex max-w-3xl flex-col gap-6">
            {providers && (
              <Section description={p.providersHint} title={p.providersHeading}>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex min-w-0 flex-col gap-1.5">
                    <label className="text-xs font-medium text-muted-foreground" htmlFor="plugins-memory">
                      {p.memoryProviderLabel}
                    </label>
                    <Select onValueChange={setMemorySel} value={memorySel}>
                      <SelectTrigger className="w-full" id="plugins-memory">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={MEMORY_PROVIDER_BUILTIN}>{p.providerDefault}</SelectItem>
                        {providers.memory_options.map(option => (
                          <SelectItem key={option.name} value={option.name}>
                            {option.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex min-w-0 flex-col gap-1.5">
                    <label className="text-xs font-medium text-muted-foreground" htmlFor="plugins-context">
                      {p.contextEngineLabel}
                    </label>
                    <Select onValueChange={setContextSel} value={contextSel}>
                      <SelectTrigger className="w-full" id="plugins-context">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={CONTEXT_ENGINE_DEFAULT}>{CONTEXT_ENGINE_DEFAULT}</SelectItem>
                        {providers.context_options
                          .filter(option => option.name !== CONTEXT_ENGINE_DEFAULT)
                          .map(option => (
                            <SelectItem key={option.name} value={option.name}>
                              {option.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button className="w-fit" disabled={providerBusy} onClick={() => void onSaveProviders()} size="sm">
                  {providerBusy && <Codicon name="loading" size="0.875rem" spinning />}
                  {p.saveProviders}
                </Button>
              </Section>
            )}

            <Section description={p.installHint} title={p.installHeading}>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-muted-foreground" htmlFor="plugins-install">
                  {p.identifierLabel}
                </label>
                <Input
                  id="plugins-install"
                  onChange={event => setInstallId(event.target.value)}
                  placeholder="owner/repo or https://..."
                  spellCheck={false}
                  value={installId}
                />
              </div>

              <div className="flex flex-wrap items-center gap-6">
                <label className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Switch checked={installForce} onCheckedChange={setInstallForce} size="xs" />
                  {p.forceReinstall}
                </label>
                <label className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Switch checked={installEnable} onCheckedChange={setInstallEnable} size="xs" />
                  {p.enableAfterInstall}
                </label>
              </div>

              <Button className="w-fit" disabled={installBusy} onClick={() => void onInstall()} size="sm">
                {installBusy ? <Codicon name="loading" size="0.875rem" spinning /> : <Codicon name="plug" size="0.875rem" />}
                {p.installBtn}
              </Button>

              <p className="text-[0.7rem] text-muted-foreground">{p.rescanHint}</p>
              <Button
                className="w-fit"
                disabled={rescanBusy}
                onClick={() => void onRescan()}
                size="sm"
                variant="outline"
              >
                <Codicon name="refresh" size="0.875rem" spinning={rescanBusy} />
                {p.rescanBtn}
              </Button>
            </Section>

            <div className="flex flex-col gap-2">
              <h3 className="text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                {p.pluginListHeading}
              </h3>

              {rows.length === 0 ? (
                <p className="py-6 text-center text-xs text-muted-foreground">{p.noPlugins}</p>
              ) : (
                <ul className="flex flex-col gap-2">
                  {rows.map(row => (
                    <PluginRow busy={rowBusy === row.name} key={row.name} onRemove={() => setRemoveTarget(row.name)} row={row} runRow={runRow} />
                  ))}
                </ul>
              )}
            </div>

            {orphans.length > 0 && (
              <div className="flex flex-col gap-2">
                <h3 className="text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                  {p.orphanHeading}
                </h3>
                <ul className="flex flex-col gap-1 rounded-md border border-(--ui-stroke-quaternary) p-3">
                  {orphans.map(manifest => (
                    <li className="text-xs text-muted-foreground" key={manifest.name}>
                      <span className="font-medium text-foreground">{manifest.label || manifest.name}</span>
                      {manifest.description ? ` — ${manifest.description}` : null}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      <ConfirmDialog
        confirmLabel={t.common.delete}
        description={removeTarget ? p.removeConfirmDesc(removeTarget) : undefined}
        destructive
        onClose={() => setRemoveTarget(null)}
        onConfirm={async () => {
          if (!removeTarget) {
            return
          }

          const name = removeTarget
          setRemoveTarget(null)
          await runRow(name, () => removeAgentPlugin(name), p.removedToast(name))
        }}
        open={removeTarget !== null}
        title={p.removeConfirmTitle}
      />
    </PageSearchShell>
  )
}

interface SectionProps {
  title: string
  description?: string
  children: React.ReactNode
}

function Section({ title, description, children }: SectionProps) {
  return (
    <section className="flex flex-col gap-3 rounded-lg border border-(--ui-stroke-quaternary) p-4">
      <div className="flex flex-col gap-0.5">
        <h3 className="text-sm font-semibold">{title}</h3>
        {description ? <p className="text-xs text-muted-foreground">{description}</p> : null}
      </div>
      {children}
    </section>
  )
}

interface PluginRowProps {
  row: HubAgentPluginRow
  busy: boolean
  runRow: (name: string, fn: () => Promise<unknown>, success: string) => Promise<void>
  onRemove: () => void
}

function PluginRow({ row, busy, runRow, onRemove }: PluginRowProps) {
  const { t } = useI18n()
  const p = t.plugins
  const statusLabel = p.status[row.runtime_status]

  return (
    <li
      className={cn(
        'flex flex-col gap-3 rounded-md border border-(--ui-stroke-quaternary) px-3 py-2.5',
        busy && 'opacity-60'
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="truncate text-sm font-medium">{row.name}</span>
            <Badge variant="outline">{row.source}</Badge>
            <Badge variant="outline">v{row.version || '—'}</Badge>
            <Badge variant={statusVariant(row.runtime_status)}>{statusLabel}</Badge>
            {row.auth_required ? <Badge variant="destructive">{p.authRequired}</Badge> : null}
          </div>
          {row.description ? <p className="mt-1 text-xs text-muted-foreground">{row.description}</p> : null}
          {row.auth_required && row.auth_command ? (
            <p className="mt-2 font-mono text-[0.65rem] text-muted-foreground">{row.auth_command}</p>
          ) : null}
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-1.5">
          <Button
            disabled={busy || row.runtime_status === 'enabled'}
            onClick={() => void runRow(row.name, () => enableAgentPlugin(row.name), p.enabledToast)}
            size="xs"
            variant="ghost"
          >
            {p.enable}
          </Button>
          <Button
            disabled={busy || row.runtime_status === 'disabled'}
            onClick={() => void runRow(row.name, () => disableAgentPlugin(row.name), p.disabledToast)}
            size="xs"
            variant="ghost"
          >
            {p.disable}
          </Button>
          {row.can_update_git ? (
            <Button
              disabled={busy}
              onClick={() => void runRow(row.name, () => updateAgentPlugin(row.name), p.updatedToast)}
              size="xs"
              variant="ghost"
            >
              {p.update}
            </Button>
          ) : null}
          {row.has_dashboard_manifest ? (
            <Button
              aria-label={row.user_hidden ? p.showInSidebar : p.hideFromSidebar}
              disabled={busy}
              onClick={() =>
                void runRow(
                  row.name,
                  () => setPluginVisibility(row.name, !row.user_hidden),
                  row.user_hidden ? p.shownToast : p.hiddenToast
                )
              }
              size="icon-xs"
              title={row.user_hidden ? p.showInSidebar : p.hideFromSidebar}
              variant="ghost"
            >
              <Codicon name={row.user_hidden ? 'eye-closed' : 'eye'} size="0.875rem" />
            </Button>
          ) : null}
          {row.can_remove ? (
            <Button
              aria-label={p.remove}
              disabled={busy}
              onClick={onRemove}
              size="icon-xs"
              title={p.remove}
              variant="ghost"
            >
              <Codicon name="trash" size="0.875rem" />
            </Button>
          ) : null}
        </div>
      </div>
    </li>
  )
}
