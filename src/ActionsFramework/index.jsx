export const applyUpdater = (stateUpdater, state) =>
  typeof stateUpdater === 'function' ? stateUpdater(state) : stateUpdater;

export const shallowMerger = (stateUpdater) => (state) => {
  const update = typeof stateUpdater === 'function' ? stateUpdater(state) : stateUpdater;
  return typeof state === 'object' ? { ...state, ...update } : update
}

export const apply = (f, args) => f.apply(undefined, args)

export const compose = (...funcs) => (arg) => funcs.reduceRight((v, f) => f(v), arg)

export const composeUpdaters = (...updaters) => (state) =>
  updaters.reduceRight(
    (state, updater) => Object.assign(state, applyUpdater(updater, state)),
    { ...state }
  )

export const empty = Object.freeze({})

export const updateKey = (key) => (updater) => shallowMerger((state) => ({
  [key]: applyUpdater(updater, (state || empty)[key])
}))

export const updateIn = (...keys) => apply(compose, keys.map(updateKey))

export const bindUpdaters = (component, updaters, argMappers = {}) => {
  const actions = {}
  for (const key of Object.keys(updaters)) {
    const argMapper = argMappers[key]
    if (argMapper) {
      actions[key] = (arg) => component.setState(updaters[key](argMapper(arg)))
    } else {
      actions[key] = (arg) => component.setState(updaters[key](arg))
    }
  }
  return actions
}
