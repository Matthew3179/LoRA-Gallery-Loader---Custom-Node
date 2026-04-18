import { app } from "../../scripts/app.js";

const GALLERY_CSS = `
.lgg-root {
  font-family: 'Segoe UI', system-ui, sans-serif;
  background: #131317; color: #ddd;
  display: flex; flex-direction: column;
  width: 100%; height: 100%; box-sizing: border-box;
  overflow: hidden; position: relative;
}
.lgg-toolbar {
  display: flex; align-items: center; gap: 5px;
  padding: 6px 8px; background: #0d0d11;
  border-bottom: 1px solid #222230; flex-shrink: 0; flex-wrap: wrap;
}
.lgg-search-bar {
  display: flex; align-items: center; gap: 5px;
  padding: 4px 8px; background: #0f0f13;
  border-bottom: 1px solid #1c1c28; flex-shrink: 0;
}
.lgg-search-bar label {
  font-size: 9px; color: #484858; white-space: nowrap;
  text-transform: uppercase; letter-spacing: .05em; font-weight: 700;
}
.lgg-search {
  flex: 1; min-width: 60px; background: #1b1b24;
  border: 1px solid #2e2e40; border-radius: 4px;
  color: #ddd; padding: 3px 7px; font-size: 11px; outline: none;
}
.lgg-search:focus { border-color: #5a5aee; }
.lgg-trigger-search {
  flex: 1; min-width: 60px; background: #1a1a22;
  border: 1px solid #2e3a2e; border-radius: 4px;
  color: #8ca; padding: 3px 7px; font-size: 11px; outline: none;
}
.lgg-trigger-search:focus { border-color: #3a8a5a; }
.lgg-trigger-search::placeholder { color: #3a5a3a; }
.lgg-btn {
  background: #1e1e2a; border: 1px solid #2e2e40; border-radius: 4px;
  color: #999; padding: 3px 8px; font-size: 11px; cursor: pointer;
  white-space: nowrap; transition: background .12s, color .12s; user-select: none;
}
.lgg-btn:hover  { background: #2a2a3c; color: #eee; }
.lgg-btn.active { background: #32328a; color: #ccf; border-color: #5a5aee; }
.lgg-btn.green  { border-color: #3a7a3a; color: #7d7; }
.lgg-btn.green:hover { background: #1a3a1a; color: #afa; }
.lgg-btn.ml-toggle { border-color: #3a3a6a; color: #88a; }
.lgg-btn.ml-toggle.active { background: #1e1e40; color: #aaf; border-color: #5a5aee; }
.lgg-btn.reset-btn { border-color: #6a2020; color: #c66; }
.lgg-btn.reset-btn:hover { background: #2a1010; color: #f88; border-color: #aa3333; }
.lgg-count { font-size: 10px; color: #555; white-space: nowrap; }
.lgg-panels { display: flex; flex: 1; overflow: hidden; min-height: 0; }
.lgg-browse {
  width: 46%; min-width: 160px; max-width: 340px;
  border-right: 1px solid #222230;
  display: flex; flex-direction: column; overflow: hidden; background: #111115;
  transition: width .22s ease, min-width .22s ease, opacity .18s ease; flex-shrink: 0;
}
.lgg-browse.collapsed { width: 0 !important; min-width: 0 !important; opacity: 0; pointer-events: none; border-right: none; }
.lgg-browse-hdr { padding: 4px 8px; background: #0d0d11; border-bottom: 1px solid #222230; font-size: 10px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; color: #484858; flex-shrink: 0; }
.lgg-browse-body { overflow-y: auto; flex: 1; padding: 4px; scrollbar-width: thin; scrollbar-color: #2a2a3c #111115; min-height: 0; }
.lgg-browse-body::-webkit-scrollbar { width: 4px; }
.lgg-browse-body::-webkit-scrollbar-thumb { background: #2a2a3c; border-radius: 2px; }
.lgg-sections-panel { flex: 1; display: flex; flex-direction: column; overflow: hidden; background: #131317; min-width: 0; }
.lgg-sections-toolbar { display: flex; align-items: center; gap: 5px; padding: 5px 8px; background: #0d0d11; border-bottom: 1px solid #222230; flex-shrink: 0; }
.lgg-sections-label { font-size: 10px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; color: #484858; flex: 1; user-select: none; }
.lgg-sections-body { overflow-y: auto; flex: 1; padding: 6px; scrollbar-width: thin; scrollbar-color: #2a2a3c #131317; min-height: 0; }
.lgg-sections-body::-webkit-scrollbar { width: 4px; }
.lgg-sections-body::-webkit-scrollbar-thumb { background: #2a2a3c; border-radius: 2px; }
.lgg-empty-hint { border: 2px dashed #252535; border-radius: 6px; padding: 22px 12px; text-align: center; color: #3a3a4a; font-size: 11px; line-height: 1.6; margin: 4px; }
.lgg-group { margin-bottom: 4px; border: 1px solid #1c1c2a; border-radius: 5px; overflow: hidden; }
.lgg-group-hdr { display: flex; align-items: center; gap: 6px; padding: 5px 7px; background: #161620; cursor: pointer; font-size: 10px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; color: #666; user-select: none; }
.lgg-group-hdr:hover { background: #1c1c28; }
.lgg-group-hdr .arr { font-size: 7px; transition: transform .17s; color: #3a3a4a; flex-shrink: 0; }
.lgg-group-hdr.open .arr { transform: rotate(90deg); }
.lgg-group-badge { margin-left: auto; background: #161624; border: 1px solid #28283c; border-radius: 8px; font-size: 9px; color: #4a4a5a; padding: 1px 5px; }
.lgg-group-badge.lit { background: #24246a; border-color: #5a5aee; color: #aaf; }
.lgg-group-body { display: none; padding: 5px 4px; background: #0f0f14; }
.lgg-group-body.open { display: flex; flex-wrap: wrap; gap: 5px; }
.lgg-section { margin-bottom: 5px; border: 1px solid #1c1c2a; border-radius: 6px; }
.lgg-section-hdr { display: flex; align-items: center; gap: 5px; padding: 6px 8px; background: #181824; cursor: pointer; user-select: none; border-radius: 5px 5px 0 0; }
.lgg-section-hdr:hover { background: #1e1e2c; }
.lgg-section-hdr .arr { font-size: 7px; transition: transform .17s; color: #3a3a4a; flex-shrink: 0; }
.lgg-section-hdr.open .arr { transform: rotate(90deg); }
.lgg-section-name { font-size: 11px; font-weight: 700; letter-spacing: .05em; text-transform: uppercase; color: #777; flex: 1; cursor: text; outline: none; background: transparent; border: none; font-family: inherit; min-width: 30px; }
.lgg-section-name:focus { color: #cce; background: #0e0e1e; border-radius: 3px; padding: 1px 4px; margin: -1px -4px; }
.lgg-section-badge { background: #16162a; border: 1px solid #28283c; border-radius: 8px; font-size: 9px; color: #4a4a5a; padding: 1px 5px; white-space: nowrap; }
.lgg-section-badge.lit { background: #24246a; border-color: #5a5aee; color: #aaf; }
.lgg-section-del { background: none; border: none; color: #4a3a3a; font-size: 14px; cursor: pointer; padding: 0 2px; line-height: 1; transition: color .12s; flex-shrink: 0; }
.lgg-section-del:hover { color: #f66; }
.lgg-section-body { display: none; padding: 6px; background: #0f0f14; min-height: 60px; border-top: 1px solid #1c1c2a; border-radius: 0 0 5px 5px; }
.lgg-section-body.open { display: flex; flex-wrap: wrap; gap: 6px; align-items: flex-start; align-content: flex-start; }
.lgg-section-body.drop-empty { border: 2px dashed #28283c; background: #0c0c12; }
.lgg-section-body.dragging-over { border: 2px dashed #5a5aee !important; background: #10102a !important; }
.lgg-card { width: 116px; display: flex; flex-direction: column; align-items: center; border-radius: 6px; border: 2px solid transparent; padding: 4px; background: #0d0d14; cursor: grab; transition: border-color .2s, background .2s, box-shadow .2s; position: relative; user-select: none; flex-shrink: 0; }
.lgg-card:hover { background: #161622; }
.lgg-card.on { border-color: #1e7a38; background: #0d1a10; box-shadow: 0 0 0 1px rgba(40,180,80,.12), 0 0 10px rgba(40,180,80,.10), 0 0 22px rgba(40,180,80,.06); }
.lgg-card.off { opacity: .60; }
.lgg-card.dragging { opacity: .2; border-style: dashed; box-shadow: none; }
.lgg-check { position: absolute; top: 6px; right: 6px; width: 17px; height: 17px; border-radius: 4px; display: flex; align-items: center; justify-content: center; font-size: 11px; line-height: 1; pointer-events: none; z-index: 2; background: rgba(0,0,0,.75); border: 1.5px solid #383848; transition: background .18s, border-color .18s; }
.lgg-card.on  .lgg-check { background: #1a9a3a; border-color: #44dd66; color: #fff; }
.lgg-card.off .lgg-check { background: rgba(60,10,10,.85); border-color: #883333; color: #f88; }
.lgg-card-rm { position: absolute; top: 5px; left: 5px; width: 15px; height: 15px; border-radius: 50%; background: rgba(0,0,0,.75); border: 1px solid #444; color: #777; font-size: 10px; line-height: 15px; text-align: center; cursor: pointer; opacity: 0; transition: opacity .12s, color .12s; z-index: 3; }
.lgg-card:hover .lgg-card-rm { opacity: 1; }
.lgg-card-rm:hover { color: #f55; border-color: #f55; }
.lgg-img-wrap { width: 108px; height: 108px; border-radius: 4px; overflow: hidden; background: #06060d; position: relative; flex-shrink: 0; cursor: pointer; }
.lgg-img { width: 100%; height: 100%; object-fit: cover; display: block; transition: filter .22s; filter: grayscale(100%) brightness(.4); pointer-events: none; }
.lgg-card.on .lgg-img { filter: grayscale(0%) brightness(1); }
.lgg-placeholder { width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 3px; color: #252535; font-size: 9px; text-align: center; pointer-events: none; }
.lgg-card.on .lgg-placeholder { color: #3a5a3a; }
.lgg-root.edit-mode .lgg-img-wrap { outline: 1.5px dashed rgba(180,120,0,.5); outline-offset: -1px; cursor: pointer; }
.lgg-root.edit-mode .lgg-img-wrap:hover { outline-color: #cc9900; }
.lgg-root.edit-mode .lgg-img-wrap::after { content: '✏️'; position: absolute; bottom: 4px; right: 4px; font-size: 12px; background: rgba(0,0,0,.72); border-radius: 3px; padding: 1px 3px; pointer-events: none; }
.lgg-root.edit-mode .lgg-card { cursor: default; }
.lgg-name { font-size: 9px; color: #4a4a5a; text-align: center; margin-top: 4px; line-height: 1.3; word-break: break-word; max-width: 108px; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; transition: color .18s; pointer-events: none; }
.lgg-card.on .lgg-name { color: #5aaa6a; }
.lgg-trigger-tags { display: flex; flex-wrap: wrap; gap: 2px; margin-top: 3px; width: 108px; justify-content: center; }
.lgg-trigger-tag { font-size: 8px; background: #1a2a1a; border: 1px solid #2a4a2a; border-radius: 3px; color: #5a8a5a; padding: 1px 4px; white-space: nowrap; max-width: 104px; overflow: hidden; text-overflow: ellipsis; }
.lgg-trigger-tag.match { background: #1a3a1a; border-color: #3a8a3a; color: #8acc8a; font-weight: 700; }
.lgg-str-row { display: flex; align-items: center; margin-top: 5px; width: 108px; gap: 0; border: 1px solid #1e1e2e; border-radius: 4px; overflow: hidden; background: #08080f; }
.lgg-str-btn { flex-shrink: 0; width: 22px; height: 22px; background: #1a1a28; border: none; color: #666; font-size: 14px; line-height: 1; cursor: pointer; user-select: none; display: flex; align-items: center; justify-content: center; transition: background .1s, color .1s; }
.lgg-str-btn:hover { background: #2a2a44; color: #cce; }
.lgg-str-btn:active { background: #3a3a60; }
.lgg-str-divider { width: 1px; background: #2a2a3a; flex-shrink: 0; align-self: stretch; }
.lgg-str-input { flex: 1; min-width: 0; background: transparent; border: none; color: #999; font-size: 10px; padding: 2px 3px; text-align: center; outline: none; }
.lgg-str-input:focus { color: #fff; }
.lgg-str-input::-webkit-inner-spin-button, .lgg-str-input::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
.lgg-str-input[type=number] { -moz-appearance: textfield; }
.lgg-card.on .lgg-str-row { border-color: #1a5a28; }
.lgg-card.on .lgg-str-input { color: #8ca; }
.lgg-card.on .lgg-str-input:focus { color: #fff; }
.lgg-card.on .lgg-str-btn { color: #4a8a5a; }
.lgg-card.on .lgg-str-btn:hover { background: #152a1a; color: #8ca; }
.lgg-card.on .lgg-str-divider { background: #1a5a28; }
.lgg-str-row:focus-within { border-color: #ffffff; }
.lgg-str-row:focus-within .lgg-str-btn { border-color: transparent; }
.lgg-str-row:focus-within .lgg-str-divider { background: #555; }
.lgg-status { padding: 3px 8px; background: #0d0d11; border-top: 1px solid #222230; font-size: 10px; color: #383848; display: flex; justify-content: space-between; flex-shrink: 0; align-items: center; gap: 6px; }
.lgg-status-left { white-space: nowrap; }
.lgg-warning { font-size: 9px; color: #5a3a18; text-align: right; line-height: 1.3; flex: 1; }
.lgg-ctx { position: fixed; background: #16162a; border: 1px solid #2c2c50; border-radius: 6px; box-shadow: 0 8px 28px rgba(0,0,0,.65); z-index: 99999; padding: 3px 0; min-width: 170px; }
.lgg-ctx-item { padding: 6px 13px; font-size: 11px; cursor: pointer; color: #bbb; transition: background .09s; }
.lgg-ctx-item:hover { background: #20203c; color: #fff; }
.lgg-ctx-sep { height: 1px; background: #1e1e32; margin: 3px 0; }
.lgg-ctx-item.danger { color: #f77; }
.lgg-ctx-item.danger:hover { background: #2c1010; }
.lgg-ctx-item.subdued { color: #555; font-size: 10px; cursor: default; }
.lgg-ctx-item.subdued:hover { background: transparent; }
.lgg-btn.edit-mode-btn { border-color: #5a4a1a; color: #aa8833; }
.lgg-btn.edit-mode-btn:hover { background: #2a2010; color: #ddaa44; }
.lgg-btn.edit-mode-btn.active { background: #3a2a00; color: #ffcc44; border-color: #cc9900; animation: lgg-pulse 2s ease-in-out infinite; }
@keyframes lgg-pulse { 0%,100% { box-shadow: 0 0 6px rgba(200,150,0,.3); } 50% { box-shadow: 0 0 14px rgba(200,150,0,.55); } }
.lgg-edit-banner { display: none; align-items: center; gap: 8px; padding: 4px 10px; background: linear-gradient(90deg,#1c1400,#1a1200); border-bottom: 1px solid #443300; font-size: 10px; color: #cc9922; flex-shrink: 0; }
.lgg-edit-banner.visible { display: flex; }
.lgg-edit-banner-text { flex: 1; }
.lgg-edit-banner-close { background: none; border: 1px solid #664400; border-radius: 3px; color: #aa7700; font-size: 10px; padding: 2px 7px; cursor: pointer; }
.lgg-edit-banner-close:hover { background: #2a1a00; color: #ffcc44; }
.lgg-img-del { display: none; position: absolute; top: 4px; left: 4px; width: 16px; height: 16px; border-radius: 50%; background: rgba(80,0,0,.85); border: 1px solid #883333; color: #f88; font-size: 10px; line-height: 16px; text-align: center; cursor: pointer; z-index: 4; align-items: center; justify-content: center; }
.lgg-img-del:hover { background: rgba(140,0,0,.9); color: #fff; border-color: #f44; }
.lgg-root.edit-mode .lgg-img-del { display: flex; }
.lgg-frame-overlay { position: fixed; inset: 0; z-index: 999999; background: rgba(0,0,0,.82); display: flex; align-items: center; justify-content: center; }
.lgg-frame-modal { background: #181820; border: 1px solid #3a3a5a; border-radius: 10px; padding: 18px; display: flex; flex-direction: column; gap: 14px; box-shadow: 0 20px 60px rgba(0,0,0,.8); min-width: 300px; user-select: none; }
.lgg-frame-title { font-size: 13px; font-weight: 700; color: #ccc; text-align: center; }
.lgg-frame-hint  { font-size: 10px; color: #666; text-align: center; margin-top: -8px; }
.lgg-frame-vp { width: 260px; height: 260px; border-radius: 6px; overflow: hidden; border: 2px solid #5a5aee; position: relative; cursor: grab; background: #08080f; flex-shrink: 0; align-self: center; touch-action: none; }
.lgg-frame-vp:active { cursor: grabbing; }
.lgg-frame-img { position: absolute; pointer-events: none; display: block; }
.lgg-frame-zoom-row { display: flex; align-items: center; gap: 8px; }
.lgg-frame-zoom-label { font-size: 10px; color: #666; white-space: nowrap; }
.lgg-frame-zoom { flex: 1; accent-color: #5a5aee; cursor: pointer; }
.lgg-frame-actions { display: flex; gap: 8px; justify-content: center; }
.lgg-frame-btn { padding: 6px 18px; border-radius: 5px; font-size: 12px; cursor: pointer; border: 1px solid #3a3a5a; font-family: inherit; transition: background .12s; }
.lgg-frame-btn.confirm { background: #2a2a8a; color: #ccf; border-color: #5a5aee; }
.lgg-frame-btn.confirm:hover { background: #3a3aaa; }
.lgg-frame-btn.cancel  { background: #1e1e2a; color: #888; border-color: #333; }
.lgg-frame-btn.cancel:hover { background: #28282c; color: #bbb; }
`;

function injectCSS() {
  if (document.getElementById("lgg-css10")) return;
  const s = document.createElement("style"); s.id = "lgg-css10"; s.textContent = GALLERY_CSS;
  document.head.appendChild(s);
}

const stemFn = n => n.replace(/\.[^.]+$/, "");
function removeCtx() { document.querySelectorAll(".lgg-ctx").forEach(e => e.remove()); }
function defEntry(key) { return { on: true, lora: key, strength: 1, strengthTwo: null }; }

let _dragLora = null, _dragSec = null, _dragIdx = null;

app.registerExtension({
  name: "LoraGalleryLoadedMultiModel",

  async beforeRegisterNodeDef(nodeType, nodeData) {
    if (nodeData.name !== "LoraGalleryLoadedMultiModel") return;

    const _onCreated = nodeType.prototype.onNodeCreated;
    nodeType.prototype.onNodeCreated = function () {
      _onCreated?.apply(this, arguments);
      injectCSS();

      this._lggAll          = [];
      this._lggSel          = {};
      this._lggSections     = [];
      this._lggGrpOpen      = {};
      this._lggSecOpen      = {};
      this._lggMLVisible    = true;
      this._lggOnlyOn       = false;
      this._lggEditMode     = false;
      this._lggLoaded       = false;
      this._lggNextId       = 1;
      this._lggPendingState = null;
      this._lggSearch       = "";
      this._lggTrigSearch   = "";

      this._lggSW = this.widgets?.find(w => w.name === "lora_state");
      if (this._lggSW) {
        this._lggSW.hidden = true;
        this._lggSW.computeSize = () => [0, -4];
      }

      const root = this._lggRoot = document.createElement("div");
      root.className = "lgg-root";

      const tb = document.createElement("div"); tb.className = "lgg-toolbar";
      const btnML   = this._lggBtnML   = document.createElement("button"); btnML.className = "lgg-btn ml-toggle active"; btnML.textContent = "◧ Master List";
      const btnAct  = this._lggBtnAct  = document.createElement("button"); btnAct.className = "lgg-btn"; btnAct.textContent = "★ Active";
      const btnEdit = this._lggBtnEdit = document.createElement("button"); btnEdit.className = "lgg-btn edit-mode-btn"; btnEdit.textContent = "✏️ Edit Images";
      const btnRef  = document.createElement("button"); btnRef.className = "lgg-btn"; btnRef.textContent = "⟳ Refresh Node"; btnRef.title = "Reload the LoRA list from disk";
      const btnRst  = document.createElement("button"); btnRst.className = "lgg-btn reset-btn"; btnRst.textContent = "↺ Reset Node";
      // Same circular-arrow icon as Reset Node, but its job is to wipe
      // every user-chosen preview image rather than touch the node state.
      const btnRstImg = this._lggBtnRstImg = document.createElement("button"); btnRstImg.className = "lgg-btn reset-btn"; btnRstImg.textContent = "↺ Reset All LoRA Icon Images"; btnRstImg.title = "Deletes all user-chosen preview images for every LoRA. Does not affect LoRA files themselves.";
      const cntEl   = this._lggCnt = document.createElement("span"); cntEl.className = "lgg-count";
      tb.append(btnML, btnAct, btnEdit, btnRef, btnRstImg, btnRst, cntEl);

      const sb = document.createElement("div"); sb.className = "lgg-search-bar";
      const lbl1 = document.createElement("label"); lbl1.textContent = "LoRA:";
      const srch = this._lggSrch = document.createElement("input"); srch.className = "lgg-search"; srch.placeholder = "Search names…"; srch.type = "text";
      const lbl2 = document.createElement("label"); lbl2.textContent = "Trigger:";
      const trig = this._lggTrig = document.createElement("input"); trig.className = "lgg-trigger-search"; trig.placeholder = "Search trigger words…"; trig.type = "text";
      sb.append(lbl1, srch, lbl2, trig);

      const eb = this._lggEB = document.createElement("div"); eb.className = "lgg-edit-banner";
      const ebt = document.createElement("span"); ebt.className = "lgg-edit-banner-text"; ebt.textContent = "✏️ Image Edit Mode — click any image to change it. Selection is locked.";
      const ebc = document.createElement("button"); ebc.className = "lgg-edit-banner-close"; ebc.textContent = "Done Editing";
      eb.append(ebt, ebc);

      const panels = document.createElement("div"); panels.className = "lgg-panels";

      const browse = this._lggBrowse = document.createElement("div"); browse.className = "lgg-browse";
      browse.append(Object.assign(document.createElement("div"), { className: "lgg-browse-hdr", textContent: "Master List — drag into sections →" }));
      const bBody = this._lggBBody = document.createElement("div"); bBody.className = "lgg-browse-body";
      browse.append(bBody);

      const sPanel = document.createElement("div"); sPanel.className = "lgg-sections-panel";
      const sTb    = document.createElement("div"); sTb.className = "lgg-sections-toolbar";
      const sLbl   = document.createElement("span"); sLbl.className = "lgg-sections-label"; sLbl.textContent = "My Sections";
      const btnAdd = document.createElement("button"); btnAdd.className = "lgg-btn green"; btnAdd.textContent = "+ Section";
      sTb.append(sLbl, btnAdd);
      const sBody = this._lggSBody = document.createElement("div"); sBody.className = "lgg-sections-body";
      sPanel.append(sTb, sBody);
      panels.append(browse, sPanel);

      const stat = document.createElement("div"); stat.className = "lgg-status";
      const stL  = this._lggStL = document.createElement("span"); stL.className = "lgg-status-left";
      const warn = document.createElement("span"); warn.className = "lgg-warning"; warn.textContent = "⚠ Reset Node removes all custom settings and returns node to default state.";
      stat.append(stL, warn);

      root.append(tb, sb, eb, panels, stat);

      this.addDOMWidget("lora_gallery_ui", "lgg_dom", root, {
        getValue: () => ({}),
        setValue: () => {},
        computeSize: (w) => [w, 520],
      });
      this.setSize([700, 580]);
      this.resizable = true;

      const _origDraw = this.onDrawForeground;
      this.onDrawForeground = function (ctx, graphCanvas) {
        if (this._lggSW) { this._lggSW.hidden = true; this._lggSW.computeSize = () => [0, -4]; }
        _origDraw?.call(this, ctx, graphCanvas);
      };

      for (const inp of [srch, trig]) {
        inp.addEventListener("mousedown", e => e.stopPropagation());
        inp.addEventListener("keydown",   e => e.stopPropagation());
      }
      srch.addEventListener("input", () => { this._lggSearch = srch.value.trim(); this._lggRenderBrowse(); });
      trig.addEventListener("input", () => { this._lggTrigSearch = trig.value.trim(); this._lggRenderBrowse(); });

      btnML.addEventListener("click",   () => this._lggToggleML());
      btnAct.addEventListener("click",  () => { this._lggOnlyOn = !this._lggOnlyOn; btnAct.classList.toggle("active", this._lggOnlyOn); this._lggRenderBrowse(); });
      btnEdit.addEventListener("click", () => this._lggToggleEdit());
      ebc.addEventListener("click",     () => this._lggToggleEdit(false));
      btnRef.addEventListener("click",  () => this._lggLoad());
      btnAdd.addEventListener("click",  () => this._lggAddSection());
      btnRstImg.addEventListener("click", () => this._lggResetAllIcons());
      btnRst.addEventListener("click",  () => this._lggReset());
      root.addEventListener("mousedown", e => e.stopPropagation());
      root.addEventListener("wheel",     e => e.stopPropagation());

      if (this._lggPendingState) {
        this._lggApplyState(this._lggPendingState);
        this._lggPendingState = null;
      }

      this._lggLoad();

      // Slot reveal: only slot 1 is visible initially. Connecting slot N
      // reveals slot N+1, up to MAX_MODEL_SLOTS. Defer to next tick so
      // ComfyUI has finished wiring up the inputs/outputs arrays.
      setTimeout(() => this._lggRefreshSlots(), 0);
    };

    nodeType.prototype._lggLoad = async function () {
      this._lggStL.textContent = "Loading…";
      try {
        const r = await fetch("/lora_gallery/list");
        this._lggAll = (await r.json()).loras || [];
        if (!this._lggLoaded) {
          this._lggLoaded = true;
          this._lggApplyState(this._lggReadWidget());
        }
        this._lggRenderBrowse(); this._lggRenderSections(); this._lggUpdateStatus();
      } catch (e) {
        console.error("[LoRA Gallery]", e);
        this._lggBBody.innerHTML = '<div style="padding:18px;color:#444;font-size:11px">Could not load LoRAs</div>';
      }
    };

    nodeType.prototype._lggReadWidget = function () {
      const w = this._lggSW || this.widgets?.find(w => w.name === "lora_state");
      if (w) this._lggSW = w;
      try { return JSON.parse(w?.value || "{}"); } catch (_) { return {}; }
    };

    nodeType.prototype._lggApplyState = function (state) {
      if (!state || typeof state !== "object") return;
      if (Array.isArray(state.loras)) {
        this._lggSel = {};
        for (const e of state.loras)
          if (e.lora) this._lggSel[e.lora] = { on: e.on ?? true, lora: e.lora, strength: e.strength ?? 1, strengthTwo: e.strengthTwo ?? null };
      }
      if (Array.isArray(state.sections))    this._lggSections  = state.sections;
      if (typeof state.nextId === "number")  this._lggNextId    = state.nextId;
      if (state.grpOpen)                     this._lggGrpOpen   = state.grpOpen;
      if (state.secOpen)                     this._lggSecOpen   = state.secOpen;
      if ("mlVisible" in state)              this._lggMLVisible = state.mlVisible;
      if (this._lggBrowse) {
        this._lggBrowse.classList.toggle("collapsed", !this._lggMLVisible);
        if (this._lggBtnML) {
          this._lggBtnML.classList.toggle("active", this._lggMLVisible);
          this._lggBtnML.textContent = this._lggMLVisible ? "◧ Master List" : "◨ Master List";
        }
      }
    };

    nodeType.prototype._lggCommit = function () {
      const w = this._lggSW || this.widgets?.find(w => w.name === "lora_state");
      if (w) this._lggSW = w;
      if (!w) { console.warn("[LoRA Gallery] lora_state widget missing"); return; }
      w.value = JSON.stringify({
        loras:     Object.values(this._lggSel).map(e => ({ on: e.on, lora: e.lora, strength: e.strength, strengthTwo: e.strengthTwo })),
        sections:  this._lggSections,
        nextId:    this._lggNextId,
        grpOpen:   this._lggGrpOpen,
        secOpen:   this._lggSecOpen,
        mlVisible: this._lggMLVisible,
      });
      if (app.graph) app.graph.setDirtyCanvas(true, true);
    };

    nodeType.prototype._lggResetAllIcons = async function () {
      // Deletes every user-chosen preview image on disk. Does NOT touch
      // LoRA files, sections, selections, or any other state. The user
      // can always re-add preview images by clicking any LoRA in Edit Mode.
      const total = (this._lggAll || []).filter(l => l.has_preview).length;
      const msg = total
        ? `Delete all ${total} LoRA icon image(s)?\n\nThis only removes the preview images you chose — your LoRA files and selections are unaffected. This cannot be undone.`
        : "No LoRA icon images are currently set. Continue anyway? (Will sweep preview folders for any stray files.)";
      if (!confirm(msg)) return;
      try {
        const r = await fetch("/lora_gallery/reset_all_previews", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({}),
        });
        const d = await r.json();
        if (d.success) {
          // Reload the list so has_preview flags refresh from disk.
          await this._lggLoad();
          const count = d.deleted ?? 0;
          this._lggStL.textContent = `Deleted ${count} icon image(s).`;
          // Restore normal status line shortly.
          setTimeout(() => this._lggUpdateStatus(), 2500);
        } else {
          alert("Reset failed: " + (d.error || "unknown error"));
        }
      } catch (err) {
        console.error("[LoRA Gallery] Reset all icons failed", err);
        alert("Reset failed: " + err.message);
      }
    };

    nodeType.prototype._lggReset = function () {
      if (!confirm("Reset Node? This will remove all selected LoRAs, custom sections, and preview images from the node. This cannot be undone.")) return;
      this._lggSel      = {};
      this._lggSections = [];
      this._lggNextId   = 1;
      this._lggGrpOpen  = {};
      this._lggSecOpen  = {};
      this._lggCommit();
      this._lggRenderBrowse(); this._lggRenderSections(); this._lggUpdateStatus(); this._lggUpdateCount();
    };

    nodeType.prototype._lggToggleML = function () {
      this._lggMLVisible = !this._lggMLVisible;
      this._lggBrowse.classList.toggle("collapsed", !this._lggMLVisible);
      this._lggBtnML.classList.toggle("active", this._lggMLVisible);
      this._lggBtnML.textContent = this._lggMLVisible ? "◧ Master List" : "◨ Master List";
      this._lggCommit();
    };

    nodeType.prototype._lggToggleEdit = function (f) {
      this._lggEditMode = f !== undefined ? f : !this._lggEditMode;
      this._lggRoot.classList.toggle("edit-mode", this._lggEditMode);
      this._lggBtnEdit.classList.toggle("active", this._lggEditMode);
      this._lggBtnEdit.textContent = this._lggEditMode ? "✏️ Editing…" : "✏️ Edit Images";
      this._lggEB.classList.toggle("visible", this._lggEditMode);
      this._lggUpdateStatus();
    };

    nodeType.prototype._lggRenderBrowse = function () {
      const body = this._lggBBody; body.innerHTML = "";
      const q  = (this._lggSearch    || "").toLowerCase();
      const tq = (this._lggTrigSearch || "").toLowerCase();
      let list = this._lggAll;

      if (q)  list = list.filter(l => l.filename.toLowerCase().includes(q));
      if (tq) list = list.filter(l => (l.trigger_words || []).some(tw => tw.toLowerCase().includes(tq)));
      if (this._lggOnlyOn) list = list.filter(l => this._lggSel[l.relative_path]?.on);

      if (!list.length) {
        const msg = tq ? `No LoRAs have trigger words matching "${tq}"` : q ? `No LoRAs match "${q}"` : "No LoRAs found";
        body.innerHTML = `<div style="padding:18px;color:#3a3a4a;font-size:11px;text-align:center">${msg}</div>`;
        this._lggUpdateCount(); return;
      }

      // Flat list — the master list reflects the on-disk order from the
      // backend. No family/category grouping; the user organizes LoRAs
      // into sections themselves, and this panel is just the inventory.
      const flat = document.createElement("div");
      flat.className = "lgg-group-body open";
      flat.style.cssText = "display:flex;flex-wrap:wrap;gap:5px;padding:5px 4px;background:#0f0f14;border-radius:5px;border:1px solid #1c1c2a;";
      for (const l of list) flat.appendChild(this._lggCard(l, false, null, null));
      body.appendChild(flat);

      this._lggUpdateCount();
    };

    nodeType.prototype._lggRenderSections = function () {
      const body = this._lggSBody; body.innerHTML = "";
      if (!this._lggSections.length) {
        const h = document.createElement("div"); h.className = "lgg-empty-hint";
        h.innerHTML = "No sections yet.<br>Click <b>+ Section</b> to create one,<br>then drag LoRAs from the Master List.";
        body.appendChild(h); return;
      }
      for (const sec of this._lggSections) body.appendChild(this._lggSection(sec));
    };

    nodeType.prototype._lggSection = function (sec) {
      const open = this._lggSecOpen[sec.id] !== false;
      const el   = document.createElement("div"); el.className = "lgg-section"; el.dataset.secId = sec.id;
      const hdr  = document.createElement("div"); hdr.className = "lgg-section-hdr" + (open ? " open" : "");
      const arr  = document.createElement("span"); arr.className = "arr"; arr.textContent = "▶";
      const ni   = document.createElement("input"); ni.className = "lgg-section-name"; ni.value = sec.name;
      ni.addEventListener("mousedown", e => e.stopPropagation());
      ni.addEventListener("click",     e => e.stopPropagation());
      ni.addEventListener("keydown",   e => { e.stopPropagation(); if (e.key === "Enter") ni.blur(); });
      ni.addEventListener("blur",      () => { sec.name = ni.value.trim() || "Section"; this._lggCommit(); });
      const nAct  = (sec.loraKeys || []).filter(k => this._lggSel[k]?.on).length;
      const badge = document.createElement("span"); badge.className = "lgg-section-badge" + (nAct ? " lit" : ""); badge.textContent = nAct ? `${nAct}/${sec.loraKeys.length}` : (sec.loraKeys?.length || 0);
      const del   = document.createElement("button"); del.className = "lgg-section-del"; del.textContent = "×";
      del.addEventListener("click", e => { e.stopPropagation(); this._lggDelSec(sec.id); });
      hdr.append(arr, ni, badge, del);
      hdr.addEventListener("click", e => {
        if (e.target === ni || e.target === del) return;
        const n = !hdr.classList.contains("open");
        hdr.classList.toggle("open", n); sbody.classList.toggle("open", n);
        this._lggSecOpen[sec.id] = n; this._lggCommit();
      });
      const sbody = document.createElement("div"); sbody.className = "lgg-section-body" + (open ? " open" : "");
      if (!sec.loraKeys?.length) sbody.classList.add("drop-empty");
      sbody.addEventListener("dragover", e => { e.preventDefault(); e.dataTransfer.dropEffect = _dragSec?.id === sec.id ? "move" : "copy"; sbody.classList.add("dragging-over"); sbody.classList.remove("drop-empty"); });
      sbody.addEventListener("dragleave", e => { if (!sbody.contains(e.relatedTarget)) { sbody.classList.remove("dragging-over"); if (!sec.loraKeys?.length) sbody.classList.add("drop-empty"); } });
      sbody.addEventListener("drop", e => {
        e.preventDefault(); sbody.classList.remove("dragging-over");
        if (!_dragLora) return;
        const key = _dragLora.relative_path;
        if (_dragSec && _dragSec.id === sec.id) {
          const toI = this._lggDropIdx(e, sbody), frI = _dragIdx;
          if (frI !== null && toI !== frI) { sec.loraKeys.splice(frI, 1); sec.loraKeys.splice(toI > frI ? toI - 1 : toI, 0, key); this._lggCommit(); this._lggRenderSections(); }
        } else if (!(sec.loraKeys || []).includes(key)) {
          if (!sec.loraKeys) sec.loraKeys = [];
          sec.loraKeys.splice(this._lggDropIdx(e, sbody), 0, key);
          if (!this._lggSel[key]) this._lggSel[key] = defEntry(key);
          this._lggCommit(); this._lggRenderSections(); this._lggRenderBrowse(); this._lggUpdateStatus();
        }
      });
      for (let i = 0; i < (sec.loraKeys || []).length; i++) {
        const lora = this._lggAll.find(l => l.relative_path === sec.loraKeys[i]);
        if (lora) sbody.appendChild(this._lggCard(lora, true, sec, i));
      }
      el.append(hdr, sbody); return el;
    };

    nodeType.prototype._lggDropIdx = function (e, sbody) {
      const cards = [...sbody.querySelectorAll(".lgg-card")];
      for (let i = 0; i < cards.length; i++) { const r = cards[i].getBoundingClientRect(); if (e.clientX < r.left + r.width / 2) return i; }
      return cards.length;
    };

    nodeType.prototype._lggCard = function (lora, inSec, sec, secIdx) {
      const key = lora.relative_path, sel = this._lggSel[key], isOn = sel?.on ?? false;
      const tq  = (this._lggTrigSearch || "").toLowerCase();
      const card = document.createElement("div"); card.className = "lgg-card" + (sel ? (isOn ? " on" : " off") : ""); card.title = key; card.draggable = true;
      const chk  = document.createElement("div"); chk.className = "lgg-check"; chk.textContent = isOn ? "✓" : sel ? "✕" : ""; card.appendChild(chk);
      if (inSec && sec) {
        const rm = document.createElement("div"); rm.className = "lgg-card-rm"; rm.textContent = "×";
        rm.addEventListener("click", e => { e.stopPropagation(); sec.loraKeys = sec.loraKeys.filter(k => k !== key); this._lggCommit(); this._lggRenderSections(); this._lggRenderBrowse(); this._lggUpdateStatus(); });
        card.appendChild(rm);
      }
      const iw = document.createElement("div"); iw.className = "lgg-img-wrap";
      this._lggBuildIW(iw, lora);
      iw.addEventListener("click", e => { e.stopPropagation(); if (this._lggEditMode) this._lggPickImg(lora, iw); else this._lggToggle(lora, card, chk); });
      const nm = document.createElement("div"); nm.className = "lgg-name"; nm.textContent = stemFn(lora.filename);
      card.append(iw, nm);

      const words = lora.trigger_words || [];
      if (words.length && tq) {
        const tags = document.createElement("div"); tags.className = "lgg-trigger-tags";
        const show = words.filter(w => w.toLowerCase().includes(tq));
        for (const w of show.slice(0, 4)) {
          const tag = document.createElement("span"); tag.className = "lgg-trigger-tag match";
          tag.textContent = w; tag.title = w; tags.appendChild(tag);
        }
        if (show.length > 4) {
          const more = document.createElement("span"); more.className = "lgg-trigger-tag"; more.textContent = `+${show.length - 4} more`; more.title = show.slice(4).join(", "); tags.appendChild(more);
        }
        if (tags.children.length) card.appendChild(tags);
      }

      const sr = document.createElement("div"); sr.className = "lgg-str-row";
      const btnM = document.createElement("button"); btnM.className = "lgg-str-btn"; btnM.textContent = "−"; btnM.title = "Decrease strength";
      btnM.type = "button";
      const divL = document.createElement("div"); divL.className = "lgg-str-divider";
      const si = document.createElement("input"); si.className = "lgg-str-input"; si.type = "number"; si.step = "0.05"; si.placeholder = "1.0"; si.title = "Strength (Enter to confirm)";
      if (sel) si.value = sel.strength ?? 1;
      const divR = document.createElement("div"); divR.className = "lgg-str-divider";
      const btnP = document.createElement("button"); btnP.className = "lgg-str-btn"; btnP.textContent = "+"; btnP.title = "Increase strength";
      btnP.type = "button";
      sr.append(btnM, divL, si, divR, btnP); card.append(sr);

      const stopEvts = ["mousedown","click","keydown","keyup"];
      for (const el of [btnM, btnP, si]) for (const ev of stopEvts) el.addEventListener(ev, e => e.stopPropagation());

      const applyStrength = (v) => {
        if (!this._lggSel[key]) return;
        const rounded = Math.round(v * 100) / 100;
        si.value = rounded;
        this._lggSel[key].strength = rounded;
        this._lggCommit();
      };
      btnM.addEventListener("click", e => { e.stopPropagation(); applyStrength((parseFloat(si.value) || 1) - 0.05); });
      btnP.addEventListener("click", e => { e.stopPropagation(); applyStrength((parseFloat(si.value) || 1) + 0.05); });
      si.addEventListener("keydown", e => { if (e.key === "Enter") si.blur(); });
      si.addEventListener("blur", () => { if (!this._lggSel[key]) return; const v = parseFloat(si.value); if (!isNaN(v)) { this._lggSel[key].strength = Math.round(v * 100) / 100; this._lggCommit(); } });
      card.addEventListener("dragstart", e => { _dragLora = lora; _dragSec = inSec ? sec : null; _dragIdx = inSec ? secIdx : null; card.classList.add("dragging"); e.dataTransfer.effectAllowed = "copyMove"; e.dataTransfer.setData("text/plain", key); });
      card.addEventListener("dragend",   () => { card.classList.remove("dragging"); _dragLora = _dragSec = _dragIdx = null; });
      card.addEventListener("contextmenu", e => { e.preventDefault(); e.stopPropagation(); this._lggCtx(e, lora, card, chk, inSec, sec); });
      return card;
    };

    nodeType.prototype._lggBuildIW = function (iw, lora) {
      iw.innerHTML = "";
      if (lora.has_preview && lora.preview_url) {
        const img = document.createElement("img"); img.className = "lgg-img"; img.src = lora.preview_url + "&_t=" + Date.now(); img.alt = lora.filename; img.onerror = () => img.replaceWith(this._lggPh()); iw.appendChild(img);
      } else { iw.appendChild(this._lggPh()); }
      if (lora.has_preview) {
        const d = document.createElement("div"); d.className = "lgg-img-del"; d.textContent = "✕";
        d.addEventListener("click", async e => { e.stopPropagation(); if (!this._lggEditMode) return; await fetch("/lora_gallery/remove_preview", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ filename: lora.filename, file_dir: lora.file_dir }) }); lora.has_preview = false; lora.preview_url = null; this._lggRefreshIW(lora); });
        iw.appendChild(d);
      }
    };

    nodeType.prototype._lggPh = function () {
      const p = document.createElement("div"); p.className = "lgg-placeholder"; p.innerHTML = `<span style="font-size:24px">🧩</span><span>No image</span>`; return p;
    };

    nodeType.prototype._lggToggle = function (lora, card, chk) {
      const key = lora.relative_path, ex = this._lggSel[key];
      if (!ex) { this._lggSel[key] = defEntry(key); card.className = "lgg-card on"; chk.textContent = "✓"; const si = card.querySelector(".lgg-str-input"); if (si && !si.value) si.value = "1"; }
      else if (ex.on) { ex.on = false; card.className = "lgg-card off"; chk.textContent = "✕"; }
      else            { ex.on = true;  card.className = "lgg-card on";  chk.textContent = "✓"; }
      this._lggCommit(); this._lggUpdateCount(); this._lggUpdateStatus(); this._lggUpdateSecBadges();
    };

    nodeType.prototype._lggCtx = function (e, lora, card, chk, inSec, sec) {
      removeCtx();
      const menu = document.createElement("div"); menu.className = "lgg-ctx";
      const item = (t, c, f) => { const d = document.createElement("div"); d.className = "lgg-ctx-item" + (c ? ` ${c}` : ""); d.textContent = t; if (f) d.addEventListener("click", () => { removeCtx(); f(); }); menu.appendChild(d); };
      const sep  = () => { const s = document.createElement("div"); s.className = "lgg-ctx-sep"; menu.appendChild(s); };
      const gc   = () => card.querySelector(".lgg-check");
      const sel  = this._lggSel[lora.relative_path];
      if (!sel) item("Select & Enable", "", () => this._lggToggle(lora, card, gc()));
      else if (sel.on) { item("Disable (keep)", "", () => this._lggToggle(lora, card, gc())); item("Remove selection", "danger", () => { delete this._lggSel[lora.relative_path]; this._lggCommit(); this._lggRenderBrowse(); this._lggRenderSections(); this._lggUpdateStatus(); }); }
      else             { item("Re-enable", "",          () => this._lggToggle(lora, card, gc())); item("Remove selection", "danger", () => { delete this._lggSel[lora.relative_path]; this._lggCommit(); this._lggRenderBrowse(); this._lggRenderSections(); this._lggUpdateStatus(); }); }
      sep();
      if (this._lggEditMode) {
        item("📷 Set preview image…", "", () => this._lggPickImg(lora, card.querySelector(".lgg-img-wrap")));
        if (lora.has_preview) item("🗑 Remove preview", "danger", async () => { await fetch("/lora_gallery/remove_preview", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ filename: lora.filename, file_dir: lora.file_dir }) }); lora.has_preview = false; lora.preview_url = null; this._lggRefreshIW(lora); });
      } else { item("🔒 Images locked — enter Edit Mode", "subdued", () => this._lggToggleEdit(true)); }
      if (this._lggSections.length) {
        sep(); item("Add to section:", "subdued", null);
        for (const s of this._lggSections) {
          const has = s.loraKeys?.includes(lora.relative_path);
          item(`  ${has ? "✓ " : ""}${s.name}`, has ? "subdued" : "", () => { if (has) return; if (!s.loraKeys) s.loraKeys = []; s.loraKeys.push(lora.relative_path); if (!this._lggSel[lora.relative_path]) this._lggSel[lora.relative_path] = defEntry(lora.relative_path); this._lggCommit(); this._lggRenderSections(); this._lggRenderBrowse(); this._lggUpdateStatus(); });
        }
      }
      menu.style.left = Math.min(e.clientX, window.innerWidth  - 200) + "px";
      menu.style.top  = Math.min(e.clientY, window.innerHeight - 300) + "px";
      document.body.appendChild(menu);
      setTimeout(() => document.addEventListener("click", removeCtx, { once: true }), 0);
    };

    nodeType.prototype._lggAddSection = function () {
      const sec = { id: this._lggNextId++, name: "New Section", loraKeys: [] };
      this._lggSections.push(sec); this._lggSecOpen[sec.id] = true;
      this._lggCommit(); this._lggRenderSections();
      setTimeout(() => { const inp = this._lggSBody.querySelector(`[data-sec-id="${sec.id}"] .lgg-section-name`); if (inp) { inp.focus(); inp.select(); } }, 60);
    };

    nodeType.prototype._lggDelSec = function (id) {
      if (!confirm("Delete this section? LoRAs remain active, just unorganized.")) return;
      this._lggSections = this._lggSections.filter(s => s.id !== id);
      this._lggCommit(); this._lggRenderSections();
    };

    nodeType.prototype._lggPickImg = function (lora, iw) {
      if (!this._lggEditMode) return;
      const inp = document.createElement("input"); inp.type = "file"; inp.accept = "image/png,image/jpeg,image/webp"; inp.style.display = "none";
      document.body.appendChild(inp);
      inp.addEventListener("change", () => { const f = inp.files[0]; if (!f) { document.body.removeChild(inp); return; } const ext = f.name.split(".").pop().toLowerCase(); const r = new FileReader(); r.onload = ev => { document.body.removeChild(inp); this._lggOpenFramer(lora, ev.target.result, ext); }; r.readAsDataURL(f); });
      inp.click();
    };

    nodeType.prototype._lggOpenFramer = function (lora, dataUrl, ext) {
      const VP = 260;
      const ov = document.createElement("div"); ov.className = "lgg-frame-overlay";
      const mo = document.createElement("div"); mo.className = "lgg-frame-modal";
      mo.append(Object.assign(document.createElement("div"), { className: "lgg-frame-title", textContent: "Frame Your Image" }), Object.assign(document.createElement("div"), { className: "lgg-frame-hint", textContent: "Drag to pan • Scroll or slider to zoom" }));
      const vp = document.createElement("div"); vp.className = "lgg-frame-vp"; vp.style.cssText = `width:${VP}px;height:${VP}px`;
      const fi = document.createElement("img"); fi.className = "lgg-frame-img"; fi.src = dataUrl; vp.appendChild(fi);
      const zr = document.createElement("div"); zr.className = "lgg-frame-zoom-row";
      zr.append(Object.assign(document.createElement("span"), { className: "lgg-frame-zoom-label", textContent: "Zoom:" }));
      const zs = document.createElement("input"); zs.className = "lgg-frame-zoom"; Object.assign(zs, { type: "range", min: "0", max: "100", value: "0" }); zr.append(zs);
      const ac = document.createElement("div"); ac.className = "lgg-frame-actions";
      const ok = Object.assign(document.createElement("button"), { className: "lgg-frame-btn confirm", textContent: "✓ Use This Frame" });
      const ca = Object.assign(document.createElement("button"), { className: "lgg-frame-btn cancel",  textContent: "Cancel" });
      ac.append(ca, ok); mo.append(vp, zr, ac); ov.appendChild(mo); document.body.appendChild(ov);
      for (const ev of ["mousedown","keydown","wheel","dragstart"]) ov.addEventListener(ev, e => { e.stopPropagation(); if (ev === "dragstart") e.preventDefault(); });
      let W=0,H=0,sc=1,mn=1,ox=0,oy=0;
      const cl=()=>{const dw=W*sc,dh=H*sc;ox=Math.min(0,Math.max(VP-dw,ox));oy=Math.min(0,Math.max(VP-dh,oy));};
      const ap=()=>{fi.style.cssText=`position:absolute;pointer-events:none;width:${W*sc}px;height:${H*sc}px;left:${ox}px;top:${oy}px`;};
      const ss=(s,px=VP/2,py=VP/2)=>{const p=sc;sc=Math.max(mn,Math.min(s,mn*8));ox=px-(px-ox)*(sc/p);oy=py-(py-oy)*(sc/p);cl();ap();zs.value=Math.min(100,Math.max(0,Math.round(((sc-mn)/(mn*7))*100)));};
      const init=()=>{W=fi.naturalWidth;H=fi.naturalHeight;if(!W||!H)return;mn=Math.max(VP/W,VP/H);sc=mn;ox=(VP-W*sc)/2;oy=(VP-H*sc)/2;cl();ap();zs.value="0";};
      fi.complete&&fi.naturalWidth?init():fi.addEventListener("load",init);
      let dr=false,lx=0,ly=0;
      vp.addEventListener("mousedown",e=>{if(e.button!==0)return;dr=true;lx=e.clientX;ly=e.clientY;vp.style.cursor="grabbing";e.preventDefault();});
      window.addEventListener("mousemove",e=>{if(!dr)return;ox+=e.clientX-lx;oy+=e.clientY-ly;lx=e.clientX;ly=e.clientY;cl();ap();});
      window.addEventListener("mouseup",()=>{dr=false;vp.style.cursor="grab";});
      vp.addEventListener("wheel",e=>{e.preventDefault();const r=vp.getBoundingClientRect();ss(sc*(e.deltaY<0?1.1:0.91),e.clientX-r.left,e.clientY-r.top);},{passive:false});
      let tl=0,ty=0,tp=0;
      vp.addEventListener("touchstart",e=>{if(e.touches.length===1){tl=e.touches[0].clientX;ty=e.touches[0].clientY;}else if(e.touches.length===2)tp=Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY);e.preventDefault();},{passive:false});
      vp.addEventListener("touchmove",e=>{if(e.touches.length===1){ox+=e.touches[0].clientX-tl;oy+=e.touches[0].clientY-ty;tl=e.touches[0].clientX;ty=e.touches[0].clientY;cl();ap();}else if(e.touches.length===2){const d=Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY);ss(sc*(d/tp));tp=d;}e.preventDefault();},{passive:false});
      zs.addEventListener("input",()=>ss(mn+(parseFloat(zs.value)/100)*mn*7));
      zs.addEventListener("mousedown",e=>e.stopPropagation());
      zs.addEventListener("keydown",e=>e.stopPropagation());
      ca.addEventListener("click",()=>ov.remove());
      ov.addEventListener("click",e=>{if(e.target===ov)ov.remove();});
      ok.addEventListener("click",async()=>{
        const SZ=512,cv=document.createElement("canvas");cv.width=cv.height=SZ;
        cv.getContext("2d").drawImage(fi,-ox/sc,-oy/sc,VP/sc,VP/sc,0,0,SZ,SZ);
        const ee=(ext==="jpg"||ext==="jpeg")?"jpeg":"png";ok.textContent="Saving…";ok.disabled=true;
        try{const rr=await fetch("/lora_gallery/set_preview",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({filename:lora.filename,file_dir:lora.file_dir,image_b64:cv.toDataURL(`image/${ee}`,0.92),ext:ee})});const dd=await rr.json();if(dd.success){lora.has_preview=true;lora.preview_url=dd.preview_url;this._lggRefreshIW(lora);}}catch(err){console.error(err);}
        ov.remove();
      });
    };

    nodeType.prototype._lggRefreshIW = function (lora) {
      const cards = this._lggRoot?.querySelectorAll(`.lgg-card[title="${CSS.escape(lora.relative_path)}"]`);
      if (!cards?.length) { this._lggRenderBrowse(); this._lggRenderSections(); return; }
      for (const card of cards) {
        const iw = card.querySelector(".lgg-img-wrap"); if (!iw) continue;
        this._lggBuildIW(iw, lora);
        iw.addEventListener("click", e => { e.stopPropagation(); if (this._lggEditMode) this._lggPickImg(lora,iw); else this._lggToggle(lora,card,card.querySelector(".lgg-check")); });
      }
    };

    nodeType.prototype._lggUpdateCount = function () { const n=Object.values(this._lggSel).filter(v=>v.on).length; this._lggCnt.textContent=n?`${n} active`:""; };
    nodeType.prototype._lggUpdateStatus = function () {
      if (this._lggEditMode) { this._lggStL.textContent="✏️ Edit mode — click any image to replace it"; return; }
      this._lggStL.textContent=`${Object.values(this._lggSel).filter(v=>v.on).length} active / ${this._lggAll.length} total`;
    };
    nodeType.prototype._lggUpdateGrpBadge = function (mt) {
      this._lggBBody?.querySelectorAll(".lgg-group").forEach(g => {
        const lbl=g.querySelector(".lgg-group-hdr span:nth-child(2)");if(!lbl||lbl.textContent!==mt)return;
        const badge=g.querySelector(".lgg-group-badge"),loras=this._lggAll.filter(l=>l.model_type===mt),n=loras.filter(l=>this._lggSel[l.relative_path]).length;
        badge.className="lgg-group-badge"+(n?" lit":"");badge.textContent=n?`${n}/${loras.length}`:loras.length;
      });
    };
    nodeType.prototype._lggUpdateSecBadges = function () {
      this._lggSBody?.querySelectorAll(".lgg-section").forEach(el => {
        const id=parseInt(el.dataset.secId),sec=this._lggSections.find(s=>s.id===id);if(!sec)return;
        const badge=el.querySelector(".lgg-section-badge"),n=(sec.loraKeys||[]).filter(k=>this._lggSel[k]?.on).length;
        badge.className="lgg-section-badge"+(n?" lit":"");badge.textContent=n?`${n}/${sec.loraKeys.length}`:(sec.loraKeys?.length||0);
      });
    };

    const _onSer = nodeType.prototype.onSerialize;
    nodeType.prototype.onSerialize = function (data) {
      this._lggCommit();
      _onSer?.apply(this, arguments);
    };

    const _onCfg = nodeType.prototype.onConfigure;
    nodeType.prototype.onConfigure = function (data) {
      _onCfg?.apply(this, arguments);
      const state = this._lggReadWidget();
      if (this._lggRoot) {
        this._lggApplyState(state);
        if (this._lggLoaded) { this._lggRenderBrowse(); this._lggRenderSections(); this._lggUpdateStatus(); }
        this._lggLoaded = false;
      } else {
        this._lggPendingState = state;
      }
      // When loading a saved workflow, refresh slot visibility so saved
      // connections drive the reveal correctly from the first render.
      setTimeout(() => this._lggRefreshSlots?.(), 0);
    };

    // ------------------------------------------------------------------
    // Slot reveal — dynamic add/remove of MODEL sockets
    // ------------------------------------------------------------------
    // Backend declares 5 model inputs (model_1..model_5) and 5 MODEL
    // outputs (MODEL_1..MODEL_5). We dynamically add/remove the MODEL
    // sockets so unused slots don't clutter the node.
    //
    // Slot 1 is always visible. Slot N+1 reveals when slot N has a
    // model link. Slots don't auto-collapse when disconnected — once
    // a user is working with multiple slots we don't want them vanishing
    // under the cursor. They only shrink back when the node is fresh
    // or a workflow is loaded with fewer connections.

    const MAX_SLOTS = 5;

    nodeType.prototype._lggGetInputIdx = function (name) {
      if (!this.inputs) return -1;
      return this.inputs.findIndex(i => i && i.name === name);
    };
    nodeType.prototype._lggGetOutputIdx = function (name) {
      if (!this.outputs) return -1;
      return this.outputs.findIndex(o => o && o.name === name);
    };

    nodeType.prototype._lggSlotFilled = function (n) {
      const mi = this._lggGetInputIdx(`model_${n}`);
      if (mi < 0) return false;
      return this.inputs[mi].link != null;
    };

    // Add the model_N input and MODEL_N output if not already present.
    nodeType.prototype._lggAddSlot = function (n) {
      if (this._lggGetInputIdx(`model_${n}`) < 0) {
        this.addInput(`model_${n}`, "MODEL");
      }
      if (this._lggGetOutputIdx(`MODEL_${n}`) < 0) {
        this.addOutput(`MODEL_${n}`, "MODEL");
      }
    };

    // Remove model_N input and MODEL_N output if present AND neither
    // has an active link. If the input has a link OR the output has
    // any downstream links, leave the slot alone — we won't silently
    // break the user's graph.
    nodeType.prototype._lggRemoveSlot = function (n) {
      if (n === 1) return;  // slot 1 is permanent
      const mi = this._lggGetInputIdx(`model_${n}`);
      const oi = this._lggGetOutputIdx(`MODEL_${n}`);
      if (mi >= 0 && this.inputs[mi].link != null) return;
      if (oi >= 0 && this.outputs[oi].links && this.outputs[oi].links.length > 0) return;
      if (mi >= 0) this.removeInput(mi);
      const oi2 = this._lggGetOutputIdx(`MODEL_${n}`);
      if (oi2 >= 0) this.removeOutput(oi2);
    };

    // Main refresh. Rule: one slot past the last filled one, capped at
    // MAX_SLOTS. Minimum is 1 slot visible.
    //
    // IMPORTANT: This does NOT call setSize(). Changing slot count makes
    // the node naturally taller/shorter via LiteGraph's layout; we don't
    // want to override any resizing the user has done via corner-drag.
    // Only the initial node creation sets an explicit size.
    nodeType.prototype._lggRefreshSlots = function () {
      if (!this.inputs) return;

      let lastFilled = 0;
      for (let n = 1; n <= MAX_SLOTS; n++) {
        if (this._lggSlotFilled(n)) lastFilled = n;
      }
      const visibleCount = Math.min(MAX_SLOTS, Math.max(1, lastFilled + 1));

      for (let n = 1; n <= visibleCount; n++) this._lggAddSlot(n);
      for (let n = MAX_SLOTS; n > visibleCount; n--) this._lggRemoveSlot(n);

      // Do NOT force a size reset. LiteGraph recomputes node height
      // automatically from slot count; width stays wherever the user
      // dragged it. If the node is shorter than its content, LiteGraph
      // will grow it down to fit.
      this.setDirtyCanvas?.(true, true);
    };

    const _onConn = nodeType.prototype.onConnectionsChange;
    nodeType.prototype.onConnectionsChange = function (type, slotIndex, isConnected, linkInfo, ioSlot) {
      const r = _onConn?.apply(this, arguments);
      setTimeout(() => this._lggRefreshSlots?.(), 0);
      return r;
    };
  },
});
