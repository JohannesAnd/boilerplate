import notFoundRouted from './signals/notFoundRouted';

export default () => {
  return (module) => {
    module.addState({
      currentPage: null,
      user: null,
      isAuthenticating: false
    });

    module.addSignals({
      notFoundRouted
    });

    return {};
  };
};
