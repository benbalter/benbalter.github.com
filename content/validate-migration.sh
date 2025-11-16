#!/bin/bash
# Validation script for Jekyll to Next.js content migration

set -e

echo "======================================"
echo "Content Migration Validation Script"
echo "======================================"
echo ""

# Count files
echo "=== File Counts ==="
POSTS_COUNT=$(find content/posts -name "*.md" | wc -l)
PAGES_COUNT=$(find content/pages -type f | wc -l)
DATA_COUNT=$(find content/data -name "*.yml" | wc -l)
RESUME_COUNT=$(find content/resume -name "*.md" | wc -l)

echo "Posts: $POSTS_COUNT"
echo "Pages: $PAGES_COUNT"
echo "Data files: $DATA_COUNT"
echo "Resume positions: $RESUME_COUNT"
echo "Total: $((POSTS_COUNT + PAGES_COUNT + DATA_COUNT + RESUME_COUNT))"
echo ""

# Check for required frontmatter
echo "=== Checking Posts Frontmatter ==="
missing=0
for file in content/posts/*.md; do
  if ! grep -q "^title:" "$file"; then
    echo "❌ Missing title: $(basename $file)"
    ((missing++))
  fi
  if ! grep -q "^description:" "$file"; then
    echo "❌ Missing description: $(basename $file)"
    ((missing++))
  fi
  if ! grep -q "^date:" "$file"; then
    echo "❌ Missing date: $(basename $file)"
    ((missing++))
  fi
done

if [ $missing -eq 0 ]; then
  echo "✅ All posts have required frontmatter (title, description, date)"
else
  echo "❌ Found $missing issues in posts"
  exit 1
fi
echo ""

echo "=== Checking Pages Frontmatter ==="
missing=0
for file in content/pages/*; do
  [ -f "$file" ] || continue
  if ! grep -q "^title:" "$file"; then
    echo "❌ Missing title: $(basename $file)"
    ((missing++))
  fi
  if ! grep -q "^description:" "$file"; then
    echo "❌ Missing description: $(basename $file)"
    ((missing++))
  fi
done

if [ $missing -eq 0 ]; then
  echo "✅ All pages have required frontmatter (title, description)"
else
  echo "❌ Found $missing issues in pages"
  exit 1
fi
echo ""

echo "=== Checking Resume Positions Frontmatter ==="
missing=0
for file in content/resume/*.md; do
  if ! grep -q "^employer:" "$file"; then
    echo "❌ Missing employer: $(basename $file)"
    ((missing++))
  fi
  if ! grep -q "^title:" "$file"; then
    echo "❌ Missing title: $(basename $file)"
    ((missing++))
  fi
  if ! grep -q "^start_date:" "$file"; then
    echo "❌ Missing start_date: $(basename $file)"
    ((missing++))
  fi
done

if [ $missing -eq 0 ]; then
  echo "✅ All resume positions have required frontmatter (employer, title, start_date)"
else
  echo "❌ Found $missing issues in resume positions"
  exit 1
fi
echo ""

# Check for unprefixed Jekyll fields (excluding code examples in content)
echo "=== Checking for Unprefixed Jekyll Fields ==="
jekyll_fields_found=0

# Check for unprefixed layout in frontmatter (not in code blocks)
# We need to be careful to exclude the post that has layout examples in markdown
unprefixed_layout=$(grep -r "^layout:" content/ --include="*.md" --include="*.html" | grep -v "content/posts/2015-06-11" | wc -l)
if [ $unprefixed_layout -gt 0 ]; then
  echo "❌ Found $unprefixed_layout files with unprefixed 'layout:' field"
  grep -r "^layout:" content/ --include="*.md" --include="*.html" | grep -v "content/posts/2015-06-11"
  ((jekyll_fields_found++))
fi

unprefixed_permalink=$(grep -r "^permalink:" content/ --include="*.md" --include="*.html" | wc -l)
if [ $unprefixed_permalink -gt 0 ]; then
  echo "❌ Found $unprefixed_permalink files with unprefixed 'permalink:' field"
  grep -r "^permalink:" content/ --include="*.md" --include="*.html"
  ((jekyll_fields_found++))
fi

unprefixed_redirect=$(grep -r "^redirect_from:" content/ --include="*.md" --include="*.html" | wc -l)
if [ $unprefixed_redirect -gt 0 ]; then
  echo "❌ Found $unprefixed_redirect files with unprefixed 'redirect_from:' field"
  grep -r "^redirect_from:" content/ --include="*.md" --include="*.html"
  ((jekyll_fields_found++))
fi

unprefixed_seo=$(grep -r "^seo:" content/ --include="*.md" --include="*.html" | wc -l)
if [ $unprefixed_seo -gt 0 ]; then
  echo "❌ Found $unprefixed_seo files with unprefixed 'seo:' field"
  grep -r "^seo:" content/ --include="*.md" --include="*.html"
  ((jekyll_fields_found++))
fi

if [ $jekyll_fields_found -eq 0 ]; then
  echo "✅ All Jekyll-specific fields are properly prefixed with '_legacy_'"
else
  echo "❌ Found unprefixed Jekyll fields"
  exit 1
fi
echo ""

echo "======================================"
echo "✅ Migration Validation PASSED"
echo "======================================"
echo ""
echo "Summary:"
echo "  - All content files present and organized"
echo "  - All required frontmatter fields present"
echo "  - All Jekyll-specific fields properly prefixed"
echo "  - Ready for Next.js implementation"
