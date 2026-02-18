import os
import shutil
from pathlib import Path
from datetime import datetime

# Configuration
CATEGORIES = {
    "images": [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".tiff", ".webp", ".svg"],
    "videos": [".mp4", ".mkv", ".flv", ".wmv", ".avi", ".mov", ".m4v"],
    "documents": [".pdf", ".doc", ".docx", ".txt", ".xls", ".xlsx", ".ppt", ".pptx", ".csv", ".md"],
    "audio": [".mp3", ".wav", ".flac", ".aac", ".ogg"],
    "archives": [".zip", ".rar", ".7z", ".tar", ".gz"],
    "code_projects": [".py", ".js", ".html", ".css", ".java", ".cpp", ".sh", ".json", ".yaml", ".yml"],
    "others": []
}

EXCLUDED_DIRS = ["directives", "execution", ".tmp", ".git", ".agent", ".vscode"]

def get_category(extension):
    extension = extension.lower()
    for category, exts in CATEGORIES.items():
        if extension in exts:
            return category
    return "others"

def organize_directory(target_path):
    target_path = Path(target_path).resolve()
    print(f"Organizing directory: {target_path}")

    files_moved = 0
    categories_created = set()

    for item in target_path.iterdir():
        # Skip directories and hidden files
        if item.is_dir() or item.name.startswith("."):
            continue
            
        # Get category
        ext = item.suffix
        category = get_category(ext)
        
        # Create category folder
        category_dir = target_path / category
        if not category_dir.exists():
            category_dir.mkdir(parents=True, exist_ok=True)
            categories_created.add(category)
            
        # Handle duplicate filenames
        dest_path = category_dir / item.name
        if dest_path.exists():
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            dest_path = category_dir / f"{item.stem}_{timestamp}{item.suffix}"
            
        # Move file
        print(f"Moving {item.name} -> {category}/")
        shutil.move(str(item), str(dest_path))
        files_moved += 1

    return files_moved, list(categories_created)

if __name__ == "__main__":
    # Default to current directory if no argument provided
    import sys
    target = sys.argv[1] if len(sys.argv) > 1 else "."
    
    try:
        moved, created = organize_directory(target)
        print(f"\nSuccess!")
        print(f"Files moved: {moved}")
        print(f"Categories created/used: {', '.join(created) if created else 'None new'}")
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)
