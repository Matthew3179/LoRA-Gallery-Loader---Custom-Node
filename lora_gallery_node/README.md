# LoRA Gallery Node for ComfyUI

A visual LoRA selector that is **functionally identical to rgthree's Power Lora Loader** — same Python backend logic, same widget serialization protocol, same `MODEL + CLIP → MODEL + CLIP` signature — but with a rich gallery UI instead of text rows.

---

## Installation

Copy the folder into your ComfyUI custom nodes directory:

```
ComfyUI/
  custom_nodes/
    lora_gallery_node/
      __init__.py
      lora_gallery_node.py
      web/
        lora_gallery.js
```

Restart ComfyUI, then add the node via:
`Right-click canvas → Add Node → loaders → LoRA Gallery 🖼️`

---

## How it works (PLL compatibility)

The Python `load_loras()` method is a direct equivalent of rgthree's:

```python
# kwargs received: lora_1 = {on, lora, strength, strengthTwo}, lora_2 = …
for key, value in kwargs.items():
    if key starts with LORA_ and value has on/lora/strength:
        if value["on"] and strengths != 0:
            model, clip = LoraLoader().load_lora(model, clip, lora_name, strength_model, strength_clip)
```

- `strength` → model strength  
- `strengthTwo` → clip strength (if `null`, uses `strength` for both — same as PLL)  
- `on: false` → LoRA is skipped (same as PLL toggle)

Workflows saved with this node are **not** compatible with PLL and vice versa (the widget data format differs), but the execution behavior is identical.

---

## Features

| Feature | Details |
|---|---|
| **Visual cards** | 86×86px image per LoRA. Grayscale = unselected/off. Full color = active. |
| **Toggle on/off** | Click a selected card to toggle it off without removing it (mirrors PLL's toggle). |
| **Set preview image** | Hover a card → click "Set image", or right-click → Set preview image. Saved to `.lora_gallery_previews/` next to your LoRA files. |
| **Search** | Filters across all groups in real time for LoRAs and trigger words. |
| **Active filter** | ★ Active button shows only enabled LoRAs. |


---

## Strength values

- Any float is accepted: negative values, values > 1, zero.
- Blank clip strength = use model strength for clip (matches PLL default).

---

## Preview image storage

```
loras/
  my_lora.safetensors
  .lora_gallery_previews/
    my_lora.png      ← preview image
    meta.json        ← manual model-type overrides
```

Supported formats: `.png`, `.jpg`, `.jpeg`, `.webp`

---

## Requirements

- ComfyUI (any recent version)
- Python 3.10+
- No extra pip installs needed
