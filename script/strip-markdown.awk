# Shared Markdown/MDX -> plain-text stripper for prose linters.
# Used by script/languagetool (via stdin) and script/harper (via file args) so
# both lint prose, not markup artifacts. Extended beyond basic Markdown to drop
# remark/pandoc directives (:name[text]{attrs}) and attribute blocks ({#id},
# {.class}) — without this, linters flag anchor slugs like {#dont-get-angry}
# and directive attributes as misspellings.
BEGIN { in_frontmatter=0; frontmatter_count=0 }

# Skip YAML front matter
/^---$/ {
  frontmatter_count++
  if (frontmatter_count <= 2) { in_frontmatter = !in_frontmatter; next }
}
in_frontmatter { next }

# Skip MDX import/export statements
/^import / { next }
/^export / { next }

# Skip code blocks
/^```/ { in_code = !in_code; next }
in_code { next }

# Skip inline code
{ gsub(/`[^`]+`/, " ") }

# Skip HTML tags
{ gsub(/<[^>]+>/, " ") }

# Skip MDX components
/^<[A-Z]/ { next }

# Skip images
{ gsub(/!\[[^\]]*\]\([^)]*\)/, " ") }

# Remark/pandoc directives ":name[text]{attrs}" -> keep display text.
# Strip the ":name" prefix so the "[text]" survives link/bracket handling below,
# then the attribute block "{...}" is removed by the next rule.
{ gsub(/:[a-zA-Z][a-zA-Z0-9_-]*\[/, "[") }

# Attribute blocks "{#id}" / "{.class}" (anchor slugs, styling hooks) -> drop
{ gsub(/\{[#.][^}]*\}/, " ") }

# Convert links to just their text (preserve link text, remove URL)
{
  while (match($0, /\[[^\]]*\]\([^)]*\)/)) {
    link = substr($0, RSTART, RLENGTH)
    sub(/^\[/, "", link)
    sub(/\]\([^)]*\)/, "", link)
    $0 = substr($0, 1, RSTART-1) link substr($0, RSTART+RLENGTH)
  }
}

# Remove any remaining markdown link brackets
{ gsub(/\[/, "") }
{ gsub(/\]/, "") }

# Skip heading markers
{ gsub(/^#{1,6} /, "") }

# Skip blockquote markers
{ gsub(/^> ?/, "") }

# Skip horizontal rules
/^[-*_]{3,}$/ { next }

# Skip list markers
{ gsub(/^[[:space:]]*[-*+] /, "") }
{ gsub(/^[[:space:]]*[0-9]+\. /, "") }

# Skip footnote definitions
/^\[\^[^\]]+\]:/ { next }

# Skip bold/italic markers
{ gsub(/\*{1,3}/, "") }
{ gsub(/_{1,3}/, " ") }

# Skip strikethrough
{ gsub(/~~/, "") }

# Print non-empty lines
NF { print }
