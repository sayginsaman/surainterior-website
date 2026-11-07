#!/bin/zsh
# Encode a Higgsfield clip for scroll scrubbing.
#   scripts/encode-film.sh <source.mp4> <name>
# → public/media/film/<name>-desktop.mp4, <name>-mobile.mp4, <name>-poster.jpg
# Short GOPs and no B-frames keep seeking cheap; the poster is the encoded first frame.
set -e
F=${FFMPEG:-ffmpeg}
OUT="$(dirname "$0")/../public/media/film"
mkdir -p "$OUT"
$F -v error -y -i "$1" -an -vf "scale=1200:1600:flags=lanczos" -c:v libx264 -preset slow -crf 21 -g 6 -keyint_min 6 -sc_threshold 0 -bf 0 -pix_fmt yuv420p -movflags +faststart "$OUT/$2-desktop.mp4"
$F -v error -y -i "$1" -an -vf "scale=1080:1440:flags=lanczos" -c:v libx264 -preset slow -crf 25 -g 4 -keyint_min 4 -sc_threshold 0 -bf 0 -pix_fmt yuv420p -movflags +faststart "$OUT/$2-mobile.mp4"
$F -v error -y -i "$OUT/$2-desktop.mp4" -frames:v 1 -q:v 3 "$OUT/$2-poster.jpg"
ls -la "$OUT" | grep "$2"
