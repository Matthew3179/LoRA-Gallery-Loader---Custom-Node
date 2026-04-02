![Screenshot 2026-04-02 095425](https://github.com/user-attachments/assets/e3d0c074-eb9c-4d6a-b7c7-3f0ffa6848aa)
![Screenshot 2026-04-02 125616](https://github.com/user-attachments/assets/91df6ebc-ab26-48d8-b168-9868b1ab0d0c)

V2 Updates: Added trigger word search bar. Fixed overlay and spacing.

Custom ComfyUI node that allows you to better visualize active LORAs. Drop it in your custom nodes folder, nothing else required.

Create custom groups on the right. You can group them by model, character, style, or however you see fit.

Pulls your LORAs from your model folder, just like drop down menus of current loaders (like rgthree's PowerLoraLoader).

When selecting edit images button, it allows you to change the image for that LORAs icon. For people I upload a picture of them. For styles or capability LORAs, I ask chatGPT or other AI models to generate an icon for me. It's up to you.

Master List on the left can be hidden by selecting the master list button. Your sections are also collapsable.

Active LORAs will be in color, inactive will be grayed out. Just click it to activate and deactivate. I'm having issues with groups and it showing selected/active in one list and not the other. When in doubt, use the "active" button to see what is active and stick to your custom groups for organizing as opposed to editing the master list. You can also rename your LORA files to get better display names. If you have oprganized your lora folder in a special way with subfolder, hover your mouse over the lora icon to see its path.

Nothing special when it comes to workflows as it functions like any other loader. Place it where you normally place your LORA loaders.

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
