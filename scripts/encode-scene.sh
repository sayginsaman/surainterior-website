#!/bin/zsh
# Encode one 16:9 segment of the opening scene for scroll scrubbing.
#   scripts/encode-scene.sh <source.mp4> <id> [last_good_frame]
# The optional frame count trims a clip before a cut the model put in near its end.
# → public/media/scene/<id>-desktop.mp4 (1920×1080, CRF 24), <id>-mobile.mp4 (9:16 centre crop, 720×1280),
#   <id>-poster.jpg (encoded first frame).
# Short GOPs and no B-frames keep seeking cheap in every browser.
set -e
F=${FFMPEG:-ffmpeg}
OUT="$(dirname "$0")/../public/media/scene"
mkdir -p "$OUT"
TRIM=""
[ -n "$3" ] && TRIM="trim=end_frame=$3,setpts=PTS-STARTPTS,"
$F -v error -y -i "$1" -an -vf "${TRIM}scale=1920:1080:flags=lanczos" -c:v libx264 -preset slow -crf 24 -g 6 -keyint_min 6 -sc_threshold 0 -bf 0 -pix_fmt yuv420p -movflags +faststart "$OUT/$2-desktop.mp4"
$F -v error -y -i "$1" -an -vf "${TRIM}crop=ih*9/16:ih,scale=720:1280:flags=lanczos" -c:v libx264 -preset slow -crf 26 -g 4 -keyint_min 4 -sc_threshold 0 -bf 0 -pix_fmt yuv420p -movflags +faststart "$OUT/$2-mobile.mp4"
$F -v error -y -i "$OUT/$2-desktop.mp4" -frames:v 1 -q:v 3 "$OUT/$2-poster.jpg"
ls -la "$OUT" | grep -- "$2-"
