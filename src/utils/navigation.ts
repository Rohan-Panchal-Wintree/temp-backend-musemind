type NavFn = (to: string, opts?: { replace?: boolean; state?: any }) => void;

let _navigate: NavFn = () => {};

export const setNavigator = (fn: NavFn) => {
  _navigate = fn;
};

export const nav = (to: string, opts?: { replace?: boolean; state?: any }) => {
  _navigate(to, opts);
};
