gitdir="$(git rev-parse --git-dir)"
hook="$gitdir/hooks/post-commit"

# disable post-commit hook temporarily
[ -x $hook ] && chmod -x $hook

git commit -m "Build"

# enable it again
chmod +x $hook
