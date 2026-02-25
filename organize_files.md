# SOP: Organize Files by Category

## Goal
Automatically categorize files in a specified directory into subfolders based on their file extensions.

## Inputs
- `target_directory`: The path to the directory to organize. Defaults to current directory if not provided.
- `extensions_mapping`: (Internal) A mapping of extensions to category names.

## Tools
- `execution/organize_files.py`

## Process
1. Scan the `target_directory` for files.
2. For each file, identify its extension.
3. Determine the category based on the extension:
    - **Images**: .jpg, .jpeg, .png, .gif, .bmp, .tiff, .webp, .svg
    - **Videos**: .mp4, .mkv, .flv, .wmv, .avi, .mov, .m4v
    - **Documents**: .pdf, .doc, .docx, .txt, .xls, .xlsx, .ppt, .pptx, .csv, .md
    - **Audio**: .mp3, .wav, .flac, .aac, .ogg
    - **Archives**: .zip, .rar, .7z, .tar, .gz
    - **Code/Projects**: .py, .js, .html, .css, .java, .cpp, .sh, .json, .yaml, .yml
    - **Others**: Anything else.
4. Create the category subfolder if it doesn't exist.
5. Move the file into the corresponding category subfolder.

## Edge Cases
- **Duplicate Names**: If a file with the same name already exists in the target folder, append a timestamp or counter.
- **Hidden Files**: Skip hidden files (starting with `.`) unless specified.
- **System Folders**: Do not move files into `directives/`, `execution/`, or `.tmp/`.

## Output
- A summary of moved files and categories created.
