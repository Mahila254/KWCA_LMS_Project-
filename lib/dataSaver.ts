/**
 * Low-data mode, for learners on slow or expensive connections. When on:
 * lesson videos wait for a tap before loading, and the large background
 * photos aren't downloaded (see [data-saver] in app/globals.css).
 *
 * It turns itself on when the phone's own "Data Saver" is on or the
 * connection is 2G, and anyone can switch it on or off in the footer;
 * their choice is remembered on that device.
 *
 * The switch and the video gate are in components/DataSaver.tsx.
 */

export const DATA_SAVER_STORAGE_KEY = "kwcf-data-saver";

// Runs in <head> before the page paints, so photos are never requested.
export const dataSaverScript = `try{var s=localStorage.getItem(${JSON.stringify(
  DATA_SAVER_STORAGE_KEY
)}),c=navigator.connection;if(s==="on"||(s!=="off"&&c&&(c.saveData||/2g/.test(c.effectiveType||""))))document.documentElement.dataset.saver="on"}catch(e){}`;

export function setDataSaver(on: boolean) {
  if (on) document.documentElement.dataset.saver = "on";
  else delete document.documentElement.dataset.saver;

  try {
    localStorage.setItem(DATA_SAVER_STORAGE_KEY, on ? "on" : "off");
  } catch {}
}
