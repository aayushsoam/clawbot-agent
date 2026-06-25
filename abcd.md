# Unicode Dot Animations

Here are the unicode-based animations using dots (Braille and block characters) for **Spinners**, **Waiting States**, and **Thinking States** to give your CLI feedback a futuristic, monospaced look.

---

## 1. Unicode Dot Spinners (SPINNERS)

These spinners are composed entirely of Braille patterns and small dots:

```python
SPINNERS = {
    # Classic braille perimeter rotation
    'dots': ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'],
    
    # Bouncing up and down (Braille wave)
    'wave_dots': ['⡀', '⠄', '⠂', '⠁', '⠂', '⠄', '⡀', '⢀', '⠠', '⠐', '⠈', '⠐', '⠠', '⢀'],
    
    # Growing/Pulsing circles or bars using block dots
    'pulse_dots': ['⠀', '⠠', '⢠', '⣠', '⣰', '⣴', '⣼', '⣽', '⣾', '⠿'],
    
    # Orbiting center dots
    'orbit_dots': ['⠁', '⠂', '⠄', '⡀', '⢀', '⠠', '⠐', '⠈'],
    
    # DNA double helix simulation
    'dna_dots': [
        "⠋⠉⠙⠚", "⠉⠙⠚⠒", "⠙⠚⠒⠂", "⠚⠒⠂⠂", 
        "⠒⠂⠂⠒", "⠂⠂⠒⠲", "⠂⠒⠲⠴", "⠒⠲⠴⠤", 
        "⠲⠴⠤⠄", "⠴⠤⠄⠋", "⠤⠄⠋⠉", "⠄⠋⠉⠙"
    ],
    
    # Simple radar scan line
    'scan_dots': ['⠁⠀', '⠂⠀', '⠄⠀', '⡀⠀', '⢀⠀', '⠠⠀', '⠐⠀', '⠈⠀'],
}
```

---

## 2. Unicode Dot Waiting Faces (KAWAII_WAITING)

These faces use Braille dots for eyes/cheeks to represent waiting/standby states:

```python
KAWAII_WAITING = [
    "(⠙‿⠚)",      # Happy eyes with curve mouth
    "(⠁‿⠁)✿",     # Cute flower face
    "٩(⠙‿⠚)۶",    # Waving cheer
    "(⠖‿⠲)",      # Excited raised dots
    "(⠦‿⠴)",      # Blushing happy
    "(⠁.⠁)♪",     # Singing/music notes
    "(⠹‿⠱)",      # Cute side smile
    "(*⠖‿⠲*)",    # Sparkle cheeks
    "(⠆‿⠆)",      # Centered calm face
    "ʕ⠙‿⠚ʔ",      # Bear face with dot eyes
]
```

---

## 3. Unicode Dot Thinking Faces (KAWAII_THINKING)

These faces use Braille patterns to show thinking, ponderous, or cool expressions:

```python
KAWAII_THINKING = [
    "(⠒⡇.⢱⠒)",    # Eye twitching / processing
    "(⠹_⠱)",      # Looking left/right
    "(⠖_⠲)",      # Confused/surprised dots
    "(⠠⠤⠠)⌐■-■",  # Putting on glasses
    "(⌐■_■)",      # Deal with it (using block shades)
    "(⠂_⠂)",      # Deadpan gaze
    "(⠶_⠶)",      # Wide double dots (staring)
    "(ಠ_ಠ)",       # Disapproval look
    "(⠏_⠹)",      # Wondering dots
    "٩(⠒_⠒)۶",    # Facepalm/scratching head
    "(⠞_⠝)",      # Closed eyes thinking
    "(⠁_⠁)💭",    # Thought bubble
    "(⠇_⠸)",      # Tilting head
    "(⠋_⠏)",      # Puzzled face
    "(⠚_⠙)✧",     # Lightbulb moment / spark
]
```
