export function logError(error: unknown): void {
  if (!process.env.CLAWBOT_INK_DEBUG_ERRORS) {
    return
  }

  console.error(error)
}
