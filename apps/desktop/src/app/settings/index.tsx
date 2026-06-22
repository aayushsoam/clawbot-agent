import { IconDownload, IconRefresh, IconUpload, IconArrowLeft } from '@tabler/icons-react'
import { useRef } from 'react'

import { Tip } from '@/components/ui/tooltip'
import { getClawbotConfigDefaults, getClawbotConfigRecord, saveClawbotConfig } from '@/clawbot'
import { useI18n } from '@/i18n'
import { triggerHaptic } from '@/lib/haptics'
import { Archive, Globe, Info, KeyRound, Settings2, Sparkles, Wrench, Zap } from '@/lib/icons'
import { notifyError } from '@/store/notifications'

import { useRouteEnumParam } from '../hooks/use-route-enum-param'
import { OverlayIconButton } from '../overlays/overlay-chrome'
import { OverlayMain, OverlayNavItem, OverlaySidebar, OverlaySplitLayout } from '../overlays/overlay-split-layout'
import { OverlayView } from '../overlays/overlay-view'

import { AboutSettings } from './about-settings'
import { AppearanceSettings } from './appearance-settings'
import { ConfigSettings } from './config-settings'
import { SECTIONS } from './constants'
import { GatewaySettings } from './gateway-settings'
import { KEYS_VIEWS, KeysSettings, type KeysView } from './keys-settings'
import { McpSettings } from './mcp-settings'
import { PROVIDER_VIEWS, ProvidersSettings, type ProviderView } from './providers-settings'
import { SessionsSettings } from './sessions-settings'
import type { SettingsPageProps, SettingsView as SettingsViewId } from './types'

const SETTINGS_VIEWS: readonly SettingsViewId[] = [
  ...SECTIONS.map(s => `config:${s.id}` as SettingsViewId),
  'providers',
  'gateway',
  'keys',
  'mcp',
  'sessions',
  'about'
]

export function SettingsView({ gateway, onClose, onConfigSaved, onMainModelChanged }: SettingsPageProps) {
  const { t } = useI18n()
  const [activeView, setActiveView] = useRouteEnumParam('tab', SETTINGS_VIEWS, 'config:model' as SettingsViewId)
  // Providers subnav (Accounts vs API keys) lives in its own param so each
  // sub-view is deep-linkable and survives a refresh.
  const [providerView, setProviderView] = useRouteEnumParam<ProviderView>('pview', PROVIDER_VIEWS, 'accounts')
  const [keysView, setKeysView] = useRouteEnumParam<KeysView>('kview', KEYS_VIEWS, 'tools')

  const openProviderView = (view: ProviderView) => {
    setActiveView('providers')
    setProviderView(view)
  }

  const openKeysView = (view: KeysView) => {
    setActiveView('keys')
    setKeysView(view)
  }

  const importInputRef = useRef<HTMLInputElement | null>(null)

  const exportConfig = async () => {
    try {
      const cfg = await getClawbotConfigRecord()
      const blob = new Blob([JSON.stringify(cfg, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'clawbot-config.json'
      a.click()
      URL.revokeObjectURL(url)
      triggerHaptic('success')
    } catch (err) {
      notifyError(err, t.settings.exportFailed)
    }
  }

  const resetConfig = async () => {
    if (!window.confirm(t.settings.resetConfirm)) {
      return
    }

    try {
      await saveClawbotConfig(await getClawbotConfigDefaults())
      triggerHaptic('success')
      onConfigSaved?.()
    } catch (err) {
      notifyError(err, t.settings.resetFailed)
    }
  }

  return (
    <div className="flex h-full flex-col min-h-0 min-w-0 overflow-y-auto p-6">
      {activeView === 'config:appearance' ? (
        <AppearanceSettings />
      ) : activeView === 'about' ? (
        <AboutSettings />
      ) : activeView === 'gateway' ? (
        <GatewaySettings />
      ) : activeView.startsWith('config:') ? (
        <ConfigSettings
          activeSectionId={activeView.slice('config:'.length)}
          importInputRef={importInputRef}
          onConfigSaved={onConfigSaved}
          onMainModelChanged={onMainModelChanged}
        />
      ) : activeView === 'providers' ? (
        <ProvidersSettings onViewChange={setProviderView} view={providerView} />
      ) : activeView === 'keys' ? (
        <KeysSettings view={keysView} />
      ) : activeView === 'mcp' ? (
        <McpSettings gateway={gateway} onConfigSaved={onConfigSaved} />
      ) : (
        <SessionsSettings />
      )}
    </div>
  )
}

export { SettingsView as SettingsPage }
