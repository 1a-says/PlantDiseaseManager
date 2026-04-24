export function currentRoute() {
  const hash = window.location.hash.slice(1);
  return hash || 'pests';
}

export function navigate(path) {
  window.location.hash = path;
}
