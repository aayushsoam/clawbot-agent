import { en } from './en'
import type { Translations } from './types'

export const hi: Translations = {
  ...en,
  common: {
    ...en.common,
    save: 'सहेजें',
    saving: 'सहेजा जा रहा है...',
    cancel: 'रद्द करें',
    close: 'बंद करें',
    confirm: 'पुष्टि करें',
    delete: 'हटाएं',
    refresh: 'रीफ्रेश',
    retry: 'फिर कोशिश करें',
    on: 'चालू',
    off: 'बंद'
  },
  boot: {
    ...en.boot,
    ready: 'Clawbot Desktop तैयार है',
    desktopBootFailedWithMessage: message => `Desktop शुरू नहीं हुआ: ${message}`,
    steps: {
      connectingGateway: 'लाइव desktop gateway से कनेक्ट हो रहा है',
      loadingSettings: 'Clawbot सेटिंग्स लोड हो रही हैं',
      loadingSessions: 'हाल की sessions लोड हो रही हैं',
      startingDesktopConnection: 'Desktop connection शुरू हो रहा है',
      startingClawbotDesktop: 'Clawbot Desktop शुरू हो रहा है...'
    },
    errors: {
      backgroundExited: 'Clawbot background process बंद हो गया।',
      backgroundExitedDuringStartup: 'Startup के दौरान Clawbot background process बंद हो गया।',
      backendStopped: 'Backend बंद हो गया',
      desktopBootFailed: 'Desktop शुरू नहीं हुआ',
      gatewaySignInRequired: 'Gateway sign-in जरूरी है',
      ipcBridgeUnavailable: 'Desktop IPC bridge उपलब्ध नहीं है।'
    },
    failure: {
      ...en.boot.failure,
      title: 'Clawbot शुरू नहीं हो सका',
      description:
        'Background gateway चालू नहीं हुआ। नीचे दिए recovery steps try करें। इससे आपकी chats या settings delete नहीं होंगी।',
      remoteTitle: 'Remote gateway sign-in जरूरी है',
      remoteDescription:
        'आपका remote gateway session expire हो गया है। दोबारा sign in करके reconnect करें। इससे आपकी chats या settings delete नहीं होंगी।',
      retry: 'फिर कोशिश करें',
      repairInstall: 'Install repair करें',
      useLocalGateway: 'Local gateway इस्तेमाल करें',
      openLogs: 'Logs खोलें',
      repairHint: 'Repair installer को दोबारा चलाता है और fresh machine पर कुछ मिनट ले सकता है।',
      hideRecentLogs: 'Recent logs छिपाएं',
      showRecentLogs: 'Recent logs दिखाएं',
      signedInTitle: 'Sign in हो गया',
      signedInMessage: 'Remote gateway से reconnect हो रहा है...',
      signInIncompleteTitle: 'Sign-in अधूरा है',
      signInIncompleteMessage: 'Authentication पूरा होने से पहले login window बंद हो गई।',
      signInFailed: 'Sign-in failed',
      signInToRemoteGateway: 'Remote gateway में sign in करें',
      signInWithProvider: provider => `${provider} से sign in करें`,
      identityProvider: 'आपका identity provider'
    }
  },
  notifications: {
    ...en.notifications,
    region: 'Notifications',
    hide: 'छिपाएं',
    show: 'दिखाएं',
    more: count => `${count} और notification`,
    clearAll: 'सब clear करें',
    dismiss: 'Notification बंद करें',
    details: 'Details',
    copyDetail: 'Detail copy करें',
    copyDetailFailed: 'Notification detail copy नहीं हो सकी',
    backendOutOfDateTitle: 'Backend पुराना है',
    backendOutOfDateMessage:
      'आपका Clawbot backend इस desktop build से पुराना है और सही काम नहीं कर सकता। उन्हें match करने के लिए update करें।',
    updateClawbot: 'Clawbot update करें',
    updateReadyTitle: 'Update तैयार है',
    updateReadyMessage: count => `${count} नया change available है।`,
    seeWhatsNew: 'नया क्या है देखें'
  },
  titlebar: {
    ...en.titlebar,
    hideSidebar: 'Sidebar छिपाएं',
    showSidebar: 'Sidebar दिखाएं',
    search: 'Search',
    searchTitle: 'Sessions, views और actions search करें',
    swapSidebarSides: 'Sidebar sides बदलें',
    swapSidebarSidesTitle: 'Sessions और file browser sides बदलें',
    hideRightSidebar: 'Right sidebar छिपाएं',
    showRightSidebar: 'Right sidebar दिखाएं',
    muteHaptics: 'Haptics mute करें',
    unmuteHaptics: 'Haptics unmute करें',
    openSettings: 'Settings खोलें'
  },
  language: {
    label: 'भाषा',
    description: 'Desktop interface की भाषा चुनें।',
    saving: 'भाषा सहेजी जा रही है...',
    saveError: 'भाषा update नहीं हो सकी'
  },
  settings: {
    ...en.settings,
    closeSettings: 'Settings बंद करें',
    exportConfig: 'Config export करें',
    importConfig: 'Config import करें',
    resetToDefaults: 'Defaults पर reset करें',
    resetConfirm: 'सारी settings Clawbot defaults पर reset करें?',
    exportFailed: 'Export failed',
    resetFailed: 'Reset failed',
    nav: {
      gateway: 'Gateway',
      apiKeys: 'Tools और Keys',
      mcp: 'MCP',
      archivedChats: 'Archived Chats',
      about: 'About'
    },
    sections: {
      model: 'Model',
      chat: 'Chat',
      appearance: 'Appearance',
      workspace: 'Workspace',
      safety: 'Safety',
      memory: 'Memory और Context',
      voice: 'Voice',
      advanced: 'Advanced'
    },
    searchPlaceholder: {
      about: 'Clawbot Desktop के बारे में',
      config: 'Settings search करें...',
      gateway: 'Gateway connection...',
      keys: 'API keys search करें...',
      mcp: 'MCP servers search करें...',
      sessions: 'Archived sessions search करें...'
    },
    modeOptions: {
      light: { label: 'Light', description: 'Bright desktop surfaces' },
      dark: { label: 'Dark', description: 'Low-glare workspace' },
      system: { label: 'System', description: 'OS appearance follow करें' }
    },
    appearance: {
      title: 'Appearance',
      intro:
        'ये desktop-only display preferences हैं। Mode brightness control करता है; theme accent palette और chat surface styling control करती है।',
      colorMode: 'Color Mode',
      colorModeDesc: 'Fixed mode चुनें या Clawbot को system setting follow करने दें।',
      toolViewTitle: 'Tool Call Display',
      toolViewDesc: 'Product raw tool payloads छिपाता है; Technical full input/output दिखाता है।',
      product: 'Product',
      productDesc: 'Concise summaries के साथ human-friendly tool activity.',
      technical: 'Technical',
      technicalDesc: 'Raw tool args/results और low-level details शामिल करें।',
      themeTitle: 'Theme',
      themeDesc: 'सिर्फ desktop palettes. चुना हुआ mode इसके ऊपर apply होगा।'
    },
    about: {
      ...en.settings.about,
      heading: 'Clawbot Desktop',
      version: value => `Version ${value}`,
      versionUnavailable: 'Version उपलब्ध नहीं है',
      updates: 'Updates',
      checkNow: 'अभी check करें',
      checking: 'Check हो रहा है...',
      seeWhatsNew: 'नया क्या है देखें',
      releaseNotes: 'Release notes',
      onLatest: 'आप latest version पर हैं।',
      installing: 'Update install हो रहा है।',
      cantUpdate: 'यह build app के अंदर से खुद update नहीं कर सकता।',
      cantReach: 'Update server तक पहुंच नहीं हो सकी।',
      tapCheck: 'Update देखने के लिए Check now दबाएं।',
      automaticUpdates: 'Automatic updates',
      automaticUpdatesDesc: 'Clawbot Desktop updates background में install कर सकता है।',
      never: 'कभी नहीं',
      justNow: 'अभी',
      justNowSuffix: 'अभी',
      minAgo: count => `${count} min पहले`,
      hoursAgo: count => `${count} घंटे पहले`,
      daysAgo: count => `${count} दिन पहले`
    }
  },
  sidebar: {
    ...en.sidebar,
    nav: {
      newSession: 'New session',
      skills: 'Skills और Tools',
      messaging: 'Messaging',
      artifacts: 'Artifacts'
    },
    searchAria: 'Sessions search करें',
    searchPlaceholder: 'Sessions search करें...',
    clearSearch: 'Search clear करें',
    pinned: 'Pinned',
    sessions: 'Sessions',
    shiftClickHint: 'Chat pin करने के लिए shift-click करें - reorder करने के लिए drag करें',
    loading: 'Sessions लोड हो रही हैं...',
    loadMore: 'और load करें'
  },
  composer: {
    ...en.composer,
    message: 'Message',
    placeholderStarting: 'Clawbot शुरू हो रहा है...',
    placeholderReconnecting: 'Reconnect हो रहा है...',
    placeholderFollowUp: 'बताएं आपको क्या चाहिए',
    startVoice: 'Voice शुरू करें',
    queueMessage: 'Message queue करें',
    steer: 'Steer',
    stop: 'Stop',
    send: 'Send',
    speaking: 'बोल रहा है',
    transcribing: 'Transcribe हो रहा है',
    thinking: 'सोच रहा है',
    muted: 'Muted',
    listening: 'सुन रहा है',
    muteMic: 'Mic mute करें',
    unmuteMic: 'Mic unmute करें'
  }
}
