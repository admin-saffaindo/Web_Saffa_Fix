// Saffa Bubur Bayi - App Configuration

// Default PIN for Saffa Admin Hub
export const ADMIN_PIN = "110592";

// Retrieves the Google Apps Script Web App URL
export function getAppsScriptUrl(): string {
  return (import.meta as any).env?.VITE_APPS_SCRIPT_URL || localStorage.getItem('saffa_apps_script_url') || "";
}

// Saves the Google Apps Script Web App URL to localStorage
export function setAppsScriptUrl(url: string): void {
  localStorage.setItem('saffa_apps_script_url', url);
}
