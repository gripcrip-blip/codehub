"""Collect HoYoverse promo codes from public sources into data/codes.json.

No login, no redemption, no verification — we only record what was found.
"""

from __future__ import annotations

import json
import re
import urllib.error
import urllib.request
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[1]
CODES_PATH = ROOT / "data" / "codes.json"

USER_AGENT = (
    "PromoHoyo/1.0 (+https://github.com/gripcrip-blip/codehub; promo-code aggregator)"
)

GAME_SLUGS = {
    "genshin": "genshin-impact",
    "hkrpg": "honkai-star-rail",
    "nap": "zenless-zone-zero",
    "honkai3rd": "honkai-impact-3rd",
    "tot": "tears-of-themis",
}

SERIA_ENDPOINTS = {
    "genshin-impact": "https://hoyo-codes.seria.moe/codes?game=genshin",
    "honkai-star-rail": "https://hoyo-codes.seria.moe/codes?game=hkrpg",
    "zenless-zone-zero": "https://hoyo-codes.seria.moe/codes?game=nap",
    "honkai-impact-3rd": "https://hoyo-codes.seria.moe/codes?game=honkai3rd",
    "tears-of-themis": "https://hoyo-codes.seria.moe/codes?game=tot",
}

FANDOM_PAGES = {
    "genshin-impact": (
        "https://genshin-impact.fandom.com/api.php"
        "?action=query&prop=revisions&titles=Promotional_Code"
        "&rvprop=content&rvslots=main&format=json"
    ),
    "honkai-star-rail": (
        "https://honkai-star-rail.fandom.com/api.php"
        "?action=query&prop=revisions&titles=Redemption_Code"
        "&rvprop=content&rvslots=main&format=json"
    ),
    "zenless-zone-zero": (
        "https://zenless-zone-zero.fandom.com/api.php"
        "?action=query&prop=revisions&titles=Redemption_Code"
        "&rvprop=content&rvslots=main&format=json"
    ),
}

CODE_RE = re.compile(r"^[A-Za-z0-9]{4,24}$")
CODE_ROW_RE = re.compile(
    r"\{\{\s*Code Row\s*\|(?P<body>.*?)}}",
    re.IGNORECASE | re.DOTALL,
)

MAX_PER_GAME = 40


def now_iso() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace(
        "+00:00", "Z"
    )


def fetch(url: str) -> str:
    req = urllib.request.Request(
        url,
        headers={
            "User-Agent": USER_AGENT,
            "Accept": "application/json, text/plain, */*",
        },
    )
    with urllib.request.urlopen(req, timeout=30) as response:
        return response.read().decode("utf-8", errors="replace")


def fetch_json(url: str) -> Any:
    return json.loads(fetch(url))


def make_id(game: str, code: str) -> str:
    return f"{game}-{code.lower()}"


def format_reward(raw: str | None) -> str | None:
    if not raw:
        return None
    text = re.sub(r"\{\{[^}]+\}\}", "", raw).strip()
    text = re.sub(r"\[\[([^|\]]+\|)?([^\]]+)\]\]", r"\2", text)
    text = re.sub(r"\[https?://[^\s\]]+\s+([^\]]+)\]", r"\1", text)
    text = text.replace("&nbsp;", " ").replace("\xa0", " ")
    text = re.sub(r"\s+", " ", text).strip(" ;,")
    if not text or text.lower().startswith("redeem code for free"):
        return None

    parts: list[str] = []
    for chunk in re.split(r"[;]", text):
        chunk = chunk.strip()
        if not chunk:
            continue
        starred = re.match(r"(.+?)\s*\*\s*(\d[\d,]*)\s*$", chunk)
        if starred:
            parts.append(f"{starred.group(2)} {starred.group(1).strip()}")
            continue
        parts.append(chunk)
    return " + ".join(parts) if parts else None


def is_code(value: str) -> bool:
    value = value.strip()
    if not CODE_RE.match(value):
        return False
    if value.lower() in {"code", "codes", "redeem", "header", "active"}:
        return False
    return True


def upsert(
    bucket: dict[tuple[str, str], dict[str, Any]],
    *,
    game: str,
    code: str,
    reward: str | None,
    found_at: str,
    source_name: str,
    source_url: str,
) -> None:
    code = code.strip()
    if not is_code(code):
        return
    key = (game, code.upper())
    existing = bucket.get(key)
    if existing is None:
        item: dict[str, Any] = {
            "id": make_id(game, code),
            "code": code,
            "game": game,
            "foundAt": found_at,
            "source": {"name": source_name, "url": source_url},
        }
        if reward:
            item["reward"] = reward
        bucket[key] = item
        return

    if reward and not existing.get("reward"):
        existing["reward"] = reward
    if found_at < existing["foundAt"]:
        existing["foundAt"] = found_at
        existing["source"] = {"name": source_name, "url": source_url}


def collect_seria(bucket: dict[tuple[str, str], dict[str, Any]]) -> None:
    found_at = now_iso()
    for game, url in SERIA_ENDPOINTS.items():
        try:
            payload = fetch_json(url)
        except (urllib.error.URLError, TimeoutError, json.JSONDecodeError) as exc:
            print(f"[seria] skip {game}: {exc}")
            continue
        for row in payload.get("codes") or []:
            upsert(
                bucket,
                game=game,
                code=str(row.get("code") or ""),
                reward=format_reward(row.get("rewards")),
                found_at=found_at,
                source_name="hoyo-codes",
                source_url=url.split("?")[0],
            )
        print(f"[seria] {game}: {len(payload.get('codes') or [])} codes")


def fandom_wikitext(url: str) -> str:
    payload = fetch_json(url)
    pages = payload.get("query", {}).get("pages", {})
    for page in pages.values():
        revisions = page.get("revisions") or []
        if not revisions:
            continue
        slot = revisions[0].get("slots", {}).get("main", {})
        return slot.get("*") or ""
    return ""


def collect_fandom(bucket: dict[tuple[str, str], dict[str, Any]]) -> None:
    for game, url in FANDOM_PAGES.items():
        try:
            wikitext = fandom_wikitext(url)
        except (urllib.error.URLError, TimeoutError, json.JSONDecodeError) as exc:
            print(f"[fandom] skip {game}: {exc}")
            continue
        added = 0
        for match in CODE_ROW_RE.finditer(wikitext):
            fields = [part.strip() for part in match.group("body").split("|")]
            if len(fields) < 4:
                continue
            code, server, reward_raw, discovered = fields[0], fields[1], fields[2], fields[3]
            if server.upper() == "CN":
                continue
            if not re.fullmatch(r"\d{4}-\d{2}-\d{2}", discovered):
                continue
            found_at = f"{discovered}T12:00:00Z"
            upsert(
                bucket,
                game=game,
                code=code,
                reward=format_reward(reward_raw),
                found_at=found_at,
                source_name="Fandom Wiki",
                source_url=url.split("?")[0],
            )
            added += 1
        print(f"[fandom] {game}: {added} code rows")


def load_existing() -> dict[str, Any]:
    if not CODES_PATH.exists():
        return {"demo": True, "updatedAt": now_iso(), "codes": []}
    return json.loads(CODES_PATH.read_text(encoding="utf-8"))


def merge(
    existing: dict[str, Any],
    collected: dict[tuple[str, str], dict[str, Any]],
) -> list[dict[str, Any]]:
    if existing.get("demo"):
        return list(collected.values())

    bucket = dict(collected)
    for row in existing.get("codes") or []:
        code = str(row.get("code") or "")
        game = str(row.get("game") or "")
        if not code or not game:
            continue
        upsert(
            bucket,
            game=game,
            code=code,
            reward=row.get("reward"),
            found_at=str(row.get("foundAt") or now_iso()),
            source_name=(row.get("source") or {}).get("name") or "archive",
            source_url=(row.get("source") or {}).get("url") or "",
        )

    by_game: dict[str, list[dict[str, Any]]] = {}
    for item in bucket.values():
        by_game.setdefault(item["game"], []).append(item)

    result: list[dict[str, Any]] = []
    for game, items in by_game.items():
        items.sort(key=lambda item: item["foundAt"], reverse=True)
        result.extend(items[:MAX_PER_GAME])
    return result


def main() -> None:
    existing = load_existing()
    collected: dict[tuple[str, str], dict[str, Any]] = {}
    collect_seria(collected)
    collect_fandom(bucket=collected)
    codes = merge(existing, collected)
    codes.sort(key=lambda item: (item["foundAt"], item["id"]), reverse=True)

    previous = existing.get("codes") or []
    if json.dumps(previous, sort_keys=True, ensure_ascii=False) == json.dumps(
        codes, sort_keys=True, ensure_ascii=False
    ):
        print("no code changes")
        return

    payload = {
        "demo": False,
        "updatedAt": now_iso(),
        "codes": codes,
    }
    CODES_PATH.write_text(
        json.dumps(payload, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    print(f"wrote {len(codes)} codes -> {CODES_PATH}")


if __name__ == "__main__":
    main()
