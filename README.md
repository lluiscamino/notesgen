# notesgen

Enhanced Markdown processor for academic notes. Converts markdown files to HTML with support for math expressions, executable JavaScript blocks, and more.

## Installation

```bash
npm install -g notesgen
```

## Usage

```bash
notesgen <inputs...> [options]
```

### Options

- `-o, --output <path>` - Output file or directory
- `-r, --recursive` - Process directories recursively

### Examples

```bash
# Single file
notesgen README.md                    # Creates README.html

# With output file
notesgen README.md -o output.html     # Creates output.html

# Directory
notesgen docs/                        # Converts all .md files in docs/

# Directory with custom output
notesgen docs/ -o dist/               # Outputs all files to dist/

# Recursive processing
notesgen docs/ -r                     # Processes all .md files recursively in docs/

# Recursive with output directory
notesgen notes/ -r -o dist/           # Processes recursively, outputs to dist/ (mirrored tree)
```

**Note**: Only one input path is supported at a time. For multiple files, process a directory instead.

## Features

- ✅ Converts markdown to HTML
- ✅ Supports TeX math expressions (inline with `$...$` and block with `$$...$$`)
- ✅ Executable JavaScript blocks (inline with `@...@` and block with `@@...@@`)
- 🔜 Substitution of common accronyms (e.g. "wrt" → "with respect to")
- ✅ Recursive directory processing
- 🔜 Table of contents generation

## Math Support

The tool supports TeX math expressions:

- **Inline math**: Use single dollar signs: `$E = mc^2$`
- **Block math**: Use double dollar signs:
  ```markdown
  $$
  \int_{a}^{b} f(x) \,dx
  $$
  ```

## JavaScript Support

The tool supports executable JavaScript blocks that are evaluated during conversion. The code runs in a sandboxed VM context and the results are inserted into the HTML output.

- **Inline executable block**: Use single `@` markers: `@code@`
  ```markdown
  The result is @2 + 2@ which equals @4@.
  ```
  Renders as: The result is 4 which equals 4.

- **Block executable block**: Use double `@@` markers:
  ```markdown
  @@
  const a = 5;
  const b = 10;
  a * b
  @@
  ```
  Renders as: 50
