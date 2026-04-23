from __future__ import annotations

import sys
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
LOCAL_DEPENDENCIES_DIR = BASE_DIR / ".pydeps"

if LOCAL_DEPENDENCIES_DIR.exists():
    local_path = str(LOCAL_DEPENDENCIES_DIR)
    if local_path not in sys.path:
        sys.path.insert(0, local_path)
