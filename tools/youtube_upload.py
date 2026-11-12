"""tools/youtube_upload.py — upload a video (+ optional thumbnail) with the YouTube Data API v3.

  python3 tools/youtube_upload.py --video out.mp4 --meta episodes/epXX/metadata.json [--thumbnail thumb.png] [--privacy private]
  python3 tools/youtube_upload.py --test        # uploads a 3-second PRIVATE test clip to check the token/permissions

Auth: an OAuth access token with the scope https://www.googleapis.com/auth/youtube.upload.
  * In a Claude cloud session the token is saved as a network secret for www.googleapis.com and injected
    by the proxy (this script sends a placeholder header that the proxy replaces).
  * Locally: export YT_ACCESS_TOKEN=... before running.
metadata.json: {"title": "...", "description": "...", "tags": [...], "categoryId": "27", "madeForKids": false}
Always uploads PRIVATE by default; the channel owner reviews and publishes in YouTube Studio.
"""
import argparse, json, os, ssl, subprocess, sys, tempfile, urllib.request, urllib.error

API = "https://www.googleapis.com"
ca = "/root/.ccr/ca-bundle.crt"
CTX = ssl.create_default_context(cafile=ca) if os.path.exists(ca) else ssl.create_default_context()
TOKEN = os.environ.get("YT_ACCESS_TOKEN", "proxy-injected")

def req(method, url, data=None, headers=None):
    h = {"Authorization": f"Bearer {TOKEN}", **(headers or {})}
    r = urllib.request.Request(url, data=data, method=method, headers=h)
    try:
        with urllib.request.urlopen(r, context=CTX, timeout=600) as resp:
            return resp.status, dict(resp.headers), resp.read()
    except urllib.error.HTTPError as e:
        body = e.read().decode(errors="replace")
        sys.exit(f"HTTP {e.code} on {method} {url.split('?')[0]}\n{body[:1500]}")

def upload(video, meta, privacy):
    size = os.path.getsize(video)
    body = {"snippet": {"title": meta["title"][:100], "description": meta.get("description", "")[:5000],
                        "tags": meta.get("tags", []), "categoryId": str(meta.get("categoryId", "27"))},
            "status": {"privacyStatus": privacy, "selfDeclaredMadeForKids": bool(meta.get("madeForKids", False))}}
    _, hdr, _ = req("POST", f"{API}/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status",
                    json.dumps(body).encode(), {"Content-Type": "application/json; charset=UTF-8",
                    "X-Upload-Content-Type": "video/mp4", "X-Upload-Content-Length": str(size)})
    loc = hdr.get("Location") or hdr.get("location")
    if not loc: sys.exit("no upload session URL returned")
    print(f"uploading {size/1e6:.1f} MB …", flush=True)
    with open(video, "rb") as f: data = f.read()
    _, _, out = req("PUT", loc, data, {"Content-Type": "video/mp4", "Content-Length": str(size)})
    v = json.loads(out); print("uploaded:", v["id"], v["status"].get("uploadStatus"), v["status"].get("privacyStatus"))
    return v["id"]

def thumbnail(vid, path):
    ct = "image/png" if path.endswith(".png") else "image/jpeg"
    with open(path, "rb") as f: data = f.read()
    req("POST", f"{API}/upload/youtube/v3/thumbnails/set?videoId={vid}", data, {"Content-Type": ct})
    print("thumbnail set")

ap = argparse.ArgumentParser()
ap.add_argument("--video"); ap.add_argument("--meta"); ap.add_argument("--thumbnail")
ap.add_argument("--privacy", default="private", choices=["private", "unlisted", "public"])
ap.add_argument("--test", action="store_true")
a = ap.parse_args()
if a.test:
    tmp = os.path.join(tempfile.mkdtemp(), "test.mp4")
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-f", "lavfi", "-i", "testsrc=size=640x360:rate=24", "-f", "lavfi", "-i", "sine=f=440",
                    "-t", "3", "-pix_fmt", "yuv420p", "-c:v", "libx264", "-c:a", "aac", "-shortest", tmp], check=True)
    vid = upload(tmp, {"title": "API test (safe to delete)", "description": "Test upload from the pipeline.", "categoryId": "27"}, "private")
    print(f"OK — check https://studio.youtube.com/video/{vid}/edit (private). Delete it after confirming it can be published.")
    sys.exit(0)
if not (a.video and a.meta): ap.error("--video and --meta are required")
vid = upload(a.video, json.load(open(a.meta)), a.privacy)
if a.thumbnail: thumbnail(vid, a.thumbnail)
print(f"done: https://studio.youtube.com/video/{vid}/edit")
