let zxcvbnPromise;
export function loadZxcvbn() {
  if (!zxcvbnPromise) {
    zxcvbnPromise = Promise.all([
      import("@zxcvbn-ts/core"),
      import("@zxcvbn-ts/language-common"),
      import("@zxcvbn-ts/language-en"),
    ]);
  }
  return zxcvbnPromise;
}
