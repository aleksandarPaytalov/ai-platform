/** Minimalistic hook test helpers without a runner (documented stubs). */
export type RenderHookResult<T> = { result: T };

export function renderHook<T>(hook: () => T): RenderHookResult<T> {
  // Placeholder to keep typing and structure; real tests should use RTL.
  return { result: hook() };
}


