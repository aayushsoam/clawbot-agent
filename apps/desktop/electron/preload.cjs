const { contextBridge, ipcRenderer, webUtils } = require('electron')

contextBridge.exposeInMainWorld('clawbotDesktop', {
  getConnection: profile => ipcRenderer.invoke('clawbot:connection', profile),
  touchBackend: profile => ipcRenderer.invoke('clawbot:backend:touch', profile),
  getGatewayWsUrl: profile => ipcRenderer.invoke('clawbot:gateway:ws-url', profile),
  getBootProgress: () => ipcRenderer.invoke('clawbot:boot-progress:get'),
  getConnectionConfig: profile => ipcRenderer.invoke('clawbot:connection-config:get', profile),
  saveConnectionConfig: payload => ipcRenderer.invoke('clawbot:connection-config:save', payload),
  applyConnectionConfig: payload => ipcRenderer.invoke('clawbot:connection-config:apply', payload),
  testConnectionConfig: payload => ipcRenderer.invoke('clawbot:connection-config:test', payload),
  probeConnectionConfig: remoteUrl => ipcRenderer.invoke('clawbot:connection-config:probe', remoteUrl),
  oauthLoginConnectionConfig: remoteUrl => ipcRenderer.invoke('clawbot:connection-config:oauth-login', remoteUrl),
  oauthLogoutConnectionConfig: remoteUrl => ipcRenderer.invoke('clawbot:connection-config:oauth-logout', remoteUrl),
  profile: {
    get: () => ipcRenderer.invoke('clawbot:profile:get'),
    set: name => ipcRenderer.invoke('clawbot:profile:set', name)
  },
  api: request => ipcRenderer.invoke('clawbot:api', request),
  notify: payload => ipcRenderer.invoke('clawbot:notify', payload),
  requestMicrophoneAccess: () => ipcRenderer.invoke('clawbot:requestMicrophoneAccess'),
  readFileDataUrl: filePath => ipcRenderer.invoke('clawbot:readFileDataUrl', filePath),
  readFileText: filePath => ipcRenderer.invoke('clawbot:readFileText', filePath),
  selectPaths: options => ipcRenderer.invoke('clawbot:selectPaths', options),
  writeClipboard: text => ipcRenderer.invoke('clawbot:writeClipboard', text),
  saveImageFromUrl: url => ipcRenderer.invoke('clawbot:saveImageFromUrl', url),
  saveImageBuffer: (data, ext) => ipcRenderer.invoke('clawbot:saveImageBuffer', { data, ext }),
  saveClipboardImage: () => ipcRenderer.invoke('clawbot:saveClipboardImage'),
  getPathForFile: file => {
    try {
      return webUtils.getPathForFile(file) || ''
    } catch {
      return ''
    }
  },
  normalizePreviewTarget: (target, baseDir) => ipcRenderer.invoke('clawbot:normalizePreviewTarget', target, baseDir),
  watchPreviewFile: url => ipcRenderer.invoke('clawbot:watchPreviewFile', url),
  stopPreviewFileWatch: id => ipcRenderer.invoke('clawbot:stopPreviewFileWatch', id),
  setTitleBarTheme: payload => ipcRenderer.send('clawbot:titlebar-theme', payload),
  setPreviewShortcutActive: active => ipcRenderer.send('clawbot:previewShortcutActive', Boolean(active)),
  openExternal: url => ipcRenderer.invoke('clawbot:openExternal', url),
  fetchLinkTitle: url => ipcRenderer.invoke('clawbot:fetchLinkTitle', url),
  settings: {
    getDefaultProjectDir: () => ipcRenderer.invoke('clawbot:setting:defaultProjectDir:get'),
    setDefaultProjectDir: dir => ipcRenderer.invoke('clawbot:setting:defaultProjectDir:set', dir),
    pickDefaultProjectDir: () => ipcRenderer.invoke('clawbot:setting:defaultProjectDir:pick')
  },
  revealLogs: () => ipcRenderer.invoke('clawbot:logs:reveal'),
  getRecentLogs: () => ipcRenderer.invoke('clawbot:logs:recent'),
  readDir: dirPath => ipcRenderer.invoke('clawbot:fs:readDir', dirPath),
  gitRoot: startPath => ipcRenderer.invoke('clawbot:fs:gitRoot', startPath),
  terminal: {
    dispose: id => ipcRenderer.invoke('clawbot:terminal:dispose', id),
    resize: (id, size) => ipcRenderer.invoke('clawbot:terminal:resize', id, size),
    start: options => ipcRenderer.invoke('clawbot:terminal:start', options),
    write: (id, data) => ipcRenderer.invoke('clawbot:terminal:write', id, data),
    onData: (id, callback) => {
      const channel = `clawbot:terminal:${id}:data`
      const listener = (_event, payload) => callback(payload)
      ipcRenderer.on(channel, listener)
      return () => ipcRenderer.removeListener(channel, listener)
    },
    onExit: (id, callback) => {
      const channel = `clawbot:terminal:${id}:exit`
      const listener = (_event, payload) => callback(payload)
      ipcRenderer.on(channel, listener)
      return () => ipcRenderer.removeListener(channel, listener)
    }
  },
  onClosePreviewRequested: callback => {
    const listener = () => callback()
    ipcRenderer.on('clawbot:close-preview-requested', listener)
    return () => ipcRenderer.removeListener('clawbot:close-preview-requested', listener)
  },
  onOpenUpdatesRequested: callback => {
    const listener = () => callback()
    ipcRenderer.on('clawbot:open-updates', listener)
    return () => ipcRenderer.removeListener('clawbot:open-updates', listener)
  },
  onWindowStateChanged: callback => {
    const listener = (_event, payload) => callback(payload)
    ipcRenderer.on('clawbot:window-state-changed', listener)
    return () => ipcRenderer.removeListener('clawbot:window-state-changed', listener)
  },
  onPreviewFileChanged: callback => {
    const listener = (_event, payload) => callback(payload)
    ipcRenderer.on('clawbot:preview-file-changed', listener)
    return () => ipcRenderer.removeListener('clawbot:preview-file-changed', listener)
  },
  onBackendExit: callback => {
    const listener = (_event, payload) => callback(payload)
    ipcRenderer.on('clawbot:backend-exit', listener)
    return () => ipcRenderer.removeListener('clawbot:backend-exit', listener)
  },
  onPowerResume: callback => {
    const listener = () => callback()
    ipcRenderer.on('clawbot:power-resume', listener)
    return () => ipcRenderer.removeListener('clawbot:power-resume', listener)
  },
  onBootProgress: callback => {
    const listener = (_event, payload) => callback(payload)
    ipcRenderer.on('clawbot:boot-progress', listener)
    return () => ipcRenderer.removeListener('clawbot:boot-progress', listener)
  },
  // First-launch bootstrap progress -- emitted by the install.ps1 stage
  // runner in main.cjs (apps/desktop/electron/bootstrap-runner.cjs).
  // Renderer's install overlay subscribes to live events and queries the
  // current snapshot via getBootstrapState() to recover after a devtools
  // reload mid-bootstrap.
  getBootstrapState: () => ipcRenderer.invoke('clawbot:bootstrap:get'),
  resetBootstrap: () => ipcRenderer.invoke('clawbot:bootstrap:reset'),
  repairBootstrap: () => ipcRenderer.invoke('clawbot:bootstrap:repair'),
  cancelBootstrap: () => ipcRenderer.invoke('clawbot:bootstrap:cancel'),
  onBootstrapEvent: callback => {
    const listener = (_event, payload) => callback(payload)
    ipcRenderer.on('clawbot:bootstrap:event', listener)
    return () => ipcRenderer.removeListener('clawbot:bootstrap:event', listener)
  },
  getVersion: () => ipcRenderer.invoke('clawbot:version'),
  updates: {
    check: () => ipcRenderer.invoke('clawbot:updates:check'),
    apply: opts => ipcRenderer.invoke('clawbot:updates:apply', opts),
    getBranch: () => ipcRenderer.invoke('clawbot:updates:branch:get'),
    setBranch: name => ipcRenderer.invoke('clawbot:updates:branch:set', name),
    onProgress: callback => {
      const listener = (_event, payload) => callback(payload)
      ipcRenderer.on('clawbot:updates:progress', listener)
      return () => ipcRenderer.removeListener('clawbot:updates:progress', listener)
    }
  }
})
