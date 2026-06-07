import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.clawbot.mobile',
  appName: 'Clawbot',
  webDir: 'dist',
  server: {
    androidScheme: 'http',
    cleartext: true
  }
}

export default config
