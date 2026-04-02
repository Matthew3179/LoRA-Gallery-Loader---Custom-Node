import os
import json
import base64
import hashlib
from pathlib import Path

import folder_paths
from nodes import LoraLoader
from server import PromptServer
from aiohttp import web

WEB_DIRECTORY = "./web"

PREVIEW_FOLDER = ".lora_gallery_previews"
IMG_EXTS = {".png", ".jpg", ".jpeg", ".webp"}

def _preview_dir(d):
    p = os.path.join(d, PREVIEW_FOLDER)
    os.makedirs(p, exist_ok=True)
    return p

def _stem(f):
    return Path(f).stem

def _find_preview(filename, file_dir):
    pd = os.path.join(file_dir, PREVIEW_FOLDER)
    s = _stem(filename)
    for ext in IMG_EXTS:
        p = os.path.join(pd, s + ext)
        if os.path.isfile(p):
            return p
    return None

def _b64e(p):
    return base64.urlsafe_b64encode(p.encode()).decode()

def _b64d(s):
    try:
        return base64.urlsafe_b64decode(s.encode()).decode()
    except Exception:
        return ""

def _load_meta(file_dir):
    p = os.path.join(file_dir, PREVIEW_FOLDER, "meta.json")
    if os.path.isfile(p):
        try:
            with open(p) as f:
                return json.load(f)
        except Exception:
            pass
    return {}

def _save_meta(file_dir, meta):
    p = os.path.join(file_dir, PREVIEW_FOLDER, "meta.json")
    os.makedirs(os.path.dirname(p), exist_ok=True)
    with open(p, "w") as f:
        json.dump(meta, f, indent=2)

def _extract_trigger_words(filename, file_dir):
    stem = _stem(filename)
    words = []

    txt_path = os.path.join(file_dir, stem + ".txt")
    if os.path.isfile(txt_path):
        try:
            with open(txt_path, "r", encoding="utf-8", errors="ignore") as f:
                content = f.read().strip()
            if content:
                words.extend([w.strip() for w in content.replace("\n", ",").split(",") if w.strip()])
        except Exception:
            pass

    if not words:
        json_path = os.path.join(file_dir, stem + ".json")
        if os.path.isfile(json_path):
            try:
                with open(json_path, "r", encoding="utf-8", errors="ignore") as f:
                    data = json.load(f)
                if isinstance(data, dict):
                    tw = data.get("trainedWords") or data.get("trained_words") or []
                    if isinstance(tw, list):
                        words.extend([str(w).strip() for w in tw if str(w).strip()])
                    if not words:
                        act = data.get("activation text") or data.get("activation_text") or ""
                        if act:
                            words.extend([w.strip() for w in str(act).replace("\n", ",").split(",") if w.strip()])
            except Exception:
                pass

    if not words:
        yaml_path = os.path.join(file_dir, stem + ".yaml")
        if os.path.isfile(yaml_path):
            try:
                with open(yaml_path, "r", encoding="utf-8", errors="ignore") as f:
                    for line in f:
                        line = line.strip()
                        if line.lower().startswith("trigger") or line.lower().startswith("activation"):
                            val = line.split(":", 1)[-1].strip().strip('"').strip("'")
                            if val:
                                words.extend([w.strip() for w in val.split(",") if w.strip()])
                            break
            except Exception:
                pass

    if not words and filename.lower().endswith(".safetensors"):
        full_path = os.path.join(file_dir, filename)
        if os.path.isfile(full_path):
            try:
                with open(full_path, "rb") as f:
                    length_bytes = f.read(8)
                    if len(length_bytes) == 8:
                        header_len = int.from_bytes(length_bytes, "little")
                        if 0 < header_len < 100 * 1024 * 1024:
                            header_bytes = f.read(header_len)
                            header = json.loads(header_bytes.decode("utf-8", errors="ignore"))
                            meta = header.get("__metadata__", {})
                            for key in ("ss_tag_frequency", "tag_frequency"):
                                val = meta.get(key)
                                if val:
                                    if isinstance(val, str):
                                        try:
                                            val = json.loads(val)
                                        except Exception:
                                            pass
                                    if isinstance(val, dict):
                                        all_tags = {}
                                        for bucket in val.values():
                                            if isinstance(bucket, dict):
                                                all_tags.update(bucket)
                                        if all_tags:
                                            sorted_tags = sorted(all_tags.items(), key=lambda x: -x[1])
                                            words.extend([t for t, _ in sorted_tags[:20]])
                                    break
                            if not words:
                                for key in ("ss_trigger_words", "trigger_words", "activation text",
                                            "activation_text", "trainedWords", "ss_activation_tags"):
                                    val = meta.get(key)
                                    if val:
                                        if isinstance(val, str):
                                            try:
                                                parsed = json.loads(val)
                                                if isinstance(parsed, list):
                                                    words.extend([str(w).strip() for w in parsed if str(w).strip()])
                                                elif isinstance(parsed, str):
                                                    words.extend([w.strip() for w in parsed.replace("\n", ",").split(",") if w.strip()])
                                            except Exception:
                                                words.extend([w.strip() for w in val.replace("\n", ",").split(",") if w.strip()])
                                        elif isinstance(val, list):
                                            words.extend([str(w).strip() for w in val if str(w).strip()])
                                        break
            except Exception:
                pass

    seen = set()
    unique = []
    for w in words:
        if w.lower() not in seen:
            seen.add(w.lower())
            unique.append(w)
    return unique


_TYPES = [
    ("FLUX",        ["flux"]),
    ("SDXL",        ["sdxl", "_xl", "-xl"]),
    ("SD 1.5",      ["sd15", "sd1.5", "v1-5", "v1_5"]),
    ("SD 2.x",      ["sd2", "v2-", "v2_"]),
    ("QWEN",        ["qwen"]),
    ("WAN",         ["wan2", "wan_"]),
    ("HUNYUAN",     ["hunyuan"]),
    ("LTXV",        ["ltxv", "ltx-v", "ltx_v"]),
    ("MOCHI",       ["mochi"]),
    ("COGVIDEO",    ["cogvideo", "cogvid"]),
    ("ANIMATEDIFF", ["animatediff", "motion_module"]),
]

def _model_type(filename, override=None):
    if override:
        return override
    low = filename.lower()
    for label, kws in _TYPES:
        for kw in kws:
            if kw in low:
                return label
    return "Other"

def _resolve_lora(name):
    if not name:
        return None
    if folder_paths.get_full_path("loras", name):
        return name
    for lora_dir in folder_paths.get_folder_paths("loras"):
        for root, dirs, files in os.walk(lora_dir):
            dirs[:] = [d for d in dirs if d != PREVIEW_FOLDER]
            for fname in files:
                if Path(fname).suffix.lower() not in {".safetensors", ".ckpt", ".pt"}:
                    continue
                rel = os.path.relpath(os.path.join(root, fname), lora_dir)
                if rel == name or fname == name or _stem(fname) == _stem(name):
                    return rel
    return None

def _register_routes():
    routes = PromptServer.instance.routes

    @routes.get("/lora_gallery/list")
    async def lora_list(request):
        result = []
        for lora_dir in folder_paths.get_folder_paths("loras"):
            if not os.path.isdir(lora_dir):
                continue
            for root, dirs, files in os.walk(lora_dir):
                dirs[:] = [d for d in dirs if d != PREVIEW_FOLDER]
                meta = _load_meta(root)
                overrides = meta.get("overrides", {})
                for fname in sorted(files):
                    if Path(fname).suffix.lower() not in {".safetensors", ".ckpt", ".pt"}:
                        continue
                    rel = os.path.relpath(os.path.join(root, fname), lora_dir)
                    override = overrides.get(_stem(fname), {}).get("model_type")
                    preview = _find_preview(fname, root)
                    enc_dir = _b64e(root)
                    trigger_words = _extract_trigger_words(fname, root)
                    result.append({
                        "filename": fname,
                        "relative_path": rel,
                        "lora_dir": lora_dir,
                        "file_dir": root,
                        "model_type": _model_type(fname, override),
                        "has_preview": preview is not None,
                        "preview_url": f"/lora_gallery/preview?dir={enc_dir}&file={fname}" if preview else None,
                        "trigger_words": trigger_words,
                    })
        return web.json_response({"loras": result})

    @routes.get("/lora_gallery/preview")
    async def get_preview(request):
        file_dir = _b64d(request.rel_url.query.get("dir", ""))
        fname    = request.rel_url.query.get("file", "")
        preview  = _find_preview(fname, file_dir)
        if not preview:
            return web.Response(status=404)
        ext  = Path(preview).suffix.lower().lstrip(".")
        mime = "image/jpeg" if ext in ("jpg", "jpeg") else f"image/{ext}"
        with open(preview, "rb") as f:
            data = f.read()
        return web.Response(body=data, content_type=mime)

    @routes.post("/lora_gallery/set_preview")
    async def set_preview(request):
        body = await request.json()
        fname    = body.get("filename", "")
        file_dir = body.get("file_dir", "")
        img_b64  = body.get("image_b64", "")
        ext      = body.get("ext", "png").lstrip(".")
        if not (fname and file_dir and img_b64):
            return web.json_response({"success": False})
        if "," in img_b64:
            img_b64 = img_b64.split(",", 1)[1]
        pd = _preview_dir(file_dir)
        s  = _stem(fname)
        for e in IMG_EXTS:
            old = os.path.join(pd, s + e)
            if os.path.isfile(old):
                os.remove(old)
        with open(os.path.join(pd, f"{s}.{ext}"), "wb") as f:
            f.write(base64.b64decode(img_b64))
        return web.json_response({"success": True, "preview_url": f"/lora_gallery/preview?dir={_b64e(file_dir)}&file={fname}"})

    @routes.post("/lora_gallery/remove_preview")
    async def remove_preview(request):
        body    = await request.json()
        preview = _find_preview(body.get("filename", ""), body.get("file_dir", ""))
        if preview and os.path.isfile(preview):
            os.remove(preview)
        return web.json_response({"success": True})

try:
    _register_routes()
except Exception as e:
    print(f"[LoRA Gallery] Failed to register routes: {e}")


class LoRAGalleryNode:

    NAME     = "LoRA Gallery"
    CATEGORY = "loaders"

    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {
                "model":      ("MODEL",),
                "clip":       ("CLIP",),
                "lora_state": ("STRING", {"default": "{}"}),
            },
        }

    RETURN_TYPES = ("MODEL", "CLIP")
    RETURN_NAMES = ("MODEL", "CLIP")
    FUNCTION     = "load_loras"

    def load_loras(self, model, clip, lora_state="{}"):
        try:
            state = json.loads(lora_state) if lora_state.strip() else {}
        except Exception:
            return (model, clip)
        for entry in state.get("loras", []):
            if not entry.get("on"):
                continue
            name = _resolve_lora(entry.get("lora", ""))
            if not name:
                continue
            sm = float(entry.get("strength", 1.0))
            st = entry.get("strengthTwo")
            sc = float(st) if st is not None else sm
            if sm == 0 and sc == 0:
                continue
            try:
                model, clip = LoraLoader().load_lora(model, clip, name, sm, sc)
            except Exception as e:
                print(f"[LoRA Gallery] Error: {e}")
        return (model, clip)

    @classmethod
    def IS_CHANGED(cls, model, clip, lora_state="{}"):
        return hashlib.md5(lora_state.encode()).hexdigest()


NODE_CLASS_MAPPINGS        = {"LoRAGalleryNode": LoRAGalleryNode}
NODE_DISPLAY_NAME_MAPPINGS = {"LoRAGalleryNode": "LoRA Gallery 🖼️"}
