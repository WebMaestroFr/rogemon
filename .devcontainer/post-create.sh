#!/bin/bash

LOCK_FILE="/workspace/.devcontainer/.lock"

touch "$LOCK_FILE"

echo "Installing Node dependencies..."
npm install

echo "Building the project..."
npm run build

echo "Setting up Git hooks..."
HOOKS_DIR="/workspace/.git/hooks"
mkdir -p "$HOOKS_DIR"

cat <<'EOF' >"$HOOKS_DIR/pre-commit"
#!/bin/sh
FILES=$(git diff --cached --name-only --diff-filter=ACMR | sed 's| |\\ |g')
[ -z "$FILES" ] && exit 0
echo "$FILES" | xargs ./node_modules/.bin/prettier --ignore-unknown --write
echo "$FILES" | xargs git add
exit 0
EOF

cat <<'EOF' >"$HOOKS_DIR/post-commit"
#!/bin/sh
git update-index -g
EOF

chmod +x "$HOOKS_DIR/pre-commit" "$HOOKS_DIR/post-commit"

rm -f "$LOCK_FILE"
