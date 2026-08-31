"""Collect gacha promo codes from public sources into data/codes.json.

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
    "PromoGacha/1.0 (+https://github.com/gripcrip-blip/codehub; promo-code aggregator)"
)

ALLOWED_GAMES = {
    "genshin-impact",
    "honkai-star-rail",
    "zenless-zone-zero",
    "honkai-impact-3rd",
    "tears-of-themis",
    "wuthering-waves",
    "nikke",
    "fate-grand-order",
    "pokemon-tcg-pocket",
    "arknights",
    "love-and-deepspace",
    "afk-journey",
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

WIKI_TABLE_PAGES = {
    "wuthering-waves": (
        "https://wutheringwaves.fandom.com/api.php"
        "?action=query&prop=revisions&titles=Redemption_Code"
        "&rvprop=content&rvslots=main&format=json",
        "https://wutheringwaves.fandom.com/wiki/Redemption_Code",
    ),
    "afk-journey": (
        "https://afk-journey.fandom.com/api.php"
        "?action=query&prop=revisions&titles=Redemption_Code"
        "&rvprop=content&rvslots=main&format=json",
        "https://afk-journey.fandom.com/wiki/Redemption_Code",
    ),
}

HTML_PAGES = {
    "nikke": ("https://nikke.gg/cd-keys-guide/", "nikke.gg"),
    "pokemon-tcg-pocket": (
        "https://www.ign.com/wikis/pokemon-tcg-pocket/Pokemon_TCG_Pocket_Gift_Codes",
        "IGN",
    ),
    "love-and-deepspace": (
        "https://cosm-game.com/codes/love-and-deepspace-redeem-codes/",
        "COSM-GAME",
    ),
}

CODE_RE = re.compile(r"^[A-Za-z0-9][A-Za-z0-9-]{5,31}$")
CODE_ROW_RE = re.compile(
    r"\{\{\s*Code Row\s*\|(?P<body>.*?)}}",
    re.IGNORECASE | re.DOTALL,
)
CARD_LIST_RE = re.compile(r"\{\{\s*Card List\|([^}|]+)", re.IGNORECASE)
DISCOVERED_RE = re.compile(
    r"Discovered:\s*([A-Za-z]+ \d{1,2}, \d{4})",
    re.IGNORECASE,
)
HTML_CODE_RE = re.compile(
    r"(?:<td[^>]*>|<code[^>]*>|<strong[^>]*>|<li[^>]*>)\s*(?:<[^>]+>\s*)*"
    r"([A-Za-z0-9][A-Za-z0-9-]{5,31})\s*<",
    re.IGNORECASE,
)
CODE_LINE_RE = re.compile(
    r"^\|\s*('{0,3})([A-Za-z0-9][A-Za-z0-9-]{5,31})\1\s*$",
    re.MULTILINE,
)

MAX_PER_GAME = 40

MONTHS = {
    "january": 1,
    "february": 2,
    "march": 3,
    "april": 4,
    "may": 5,
    "june": 6,
    "july": 7,
    "august": 8,
    "september": 9,
    "october": 10,
    "november": 11,
    "december": 12,
    "jan": 1,
    "feb": 2,
    "mar": 3,
    "apr": 4,
    "jun": 6,
    "jul": 7,
    "aug": 8,
    "sep": 9,
    "sept": 9,
    "oct": 10,
    "nov": 11,
    "dec": 12,
}


def now_iso() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace(
        "+00:00", "Z"
    )


def fetch(url: str) -> str:
    req = urllib.request.Request(
        url,
        headers={
            "User-Agent": USER_AGENT,
            "Accept": "application/json, text/html, text/plain, */*",
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
    text = re.sub(r"<[^>]+>", " ", text)
    text = re.sub(r"\|\|.*", " ", text)
    text = re.sub(
        r"(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},\s+\d{4}.*",
        " ",
        text,
        flags=re.I,
    )
    text = re.sub(r"\s+", " ", text).strip(" ;,|{}")
    if not text or text.lower().startswith("redeem code for free"):
        return None
    if re.fullmatch(r"[|{}]+", text):
        return None
    if re.match(
        r"^(January|February|March|April|May|June|July|August|September|October|November|December)\b",
        text,
        re.I,
    ):
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


def is_junk_reward(value: Any) -> bool:
    if not value:
        return True
    text = str(value).strip()
    if text.startswith("||") or text.startswith("|}") or text in {"}", "|"}:
        return True
    if re.match(
        r"^(January|February|March|April|May|June|July|August|September|October|November|December)\b",
        text,
        re.I,
    ):
        return True
    return False


def card_list_reward(text: str) -> str | None:
    match = CARD_LIST_RE.search(text)
    if not match:
        return format_reward(text)
    return format_reward(match.group(1))


def parse_discovered(text: str) -> str | None:
    match = DISCOVERED_RE.search(text)
    if not match:
        iso = re.search(r"(\d{4})-(\d{2})-(\d{2})", text)
        if iso:
            return f"{iso.group(1)}-{iso.group(2)}-{iso.group(3)}T12:00:00Z"
        return None
    parsed = re.match(r"([A-Za-z]+)\s+(\d{1,2}),\s+(\d{4})", match.group(1))
    if not parsed:
        return None
    month_name, day, year = parsed.groups()
    month = MONTHS.get(month_name.lower())
    if not month:
        return None
    return f"{year}-{month:02d}-{int(day):02d}T12:00:00Z"


def is_code(value: str) -> bool:
    value = value.strip().strip("'\"*")
    if not CODE_RE.match(value):
        return False
    lowered = value.lower()
    blocked = {
        "code",
        "codes",
        "redeem",
        "header",
        "active",
        "expired",
        "status",
        "reward",
        "rewards",
        "server",
        "duration",
        "copy",
        "working",
        "inactive",
        "true",
        "false",
        "none",
        "null",
        "html",
        "http",
        "https",
        "item",
        "items",
        "home",
        "wiki",
    }
    if lowered in blocked:
        return False
    compact = value.replace("-", "")
    if compact.isalpha() and not compact.isupper() and len(compact) < 12:
        return False
    if compact.isalpha() and compact.isupper() and len(compact) < 8:
        return False
    if not any(ch.isdigit() for ch in compact) and len(compact) < 8:
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
    code = code.strip().strip("'*\"")
    if game not in ALLOWED_GAMES or not is_code(code):
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

    if reward:
        if not existing.get("reward") or is_junk_reward(existing.get("reward")):
            existing["reward"] = reward
    elif is_junk_reward(existing.get("reward")):
        existing.pop("reward", None)
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
        if "missing" in page:
            continue
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
            code, server, reward_raw, discovered = (
                fields[0],
                fields[1],
                fields[2],
                fields[3],
            )
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


def collect_wiki_tables(bucket: dict[tuple[str, str], dict[str, Any]]) -> None:
    for game, (api_url, source_url) in WIKI_TABLE_PAGES.items():
        try:
            wikitext = fandom_wikitext(api_url)
        except (urllib.error.URLError, TimeoutError, json.JSONDecodeError) as exc:
            print(f"[wiki-table] skip {game}: {exc}")
            continue
        added = 0
        for raw_row in re.split(r"\n\|-", wikitext):
            cells = [part.strip() for part in re.split(r"\|\|", raw_row) if part.strip()]
            first = ""
            if cells:
                first = re.sub(r"^[\|\s]+", "", cells[0])
                first = re.sub(r"<[^>]+>", "", first)
                first = first.split("\n")[0].strip(" '*")
            if not is_code(first):
                line = CODE_LINE_RE.search(raw_row)
                if not line:
                    continue
                first = line.group(2)
            rest = " || ".join(cells[1:]) if cells else raw_row
            before = len(bucket)
            upsert(
                bucket,
                game=game,
                code=first,
                reward=card_list_reward(rest),
                found_at=parse_discovered(raw_row) or now_iso(),
                source_name="Fandom Wiki",
                source_url=source_url,
            )
            if len(bucket) > before:
                added += 1
        print(f"[wiki-table] {game}: {added} codes")


def collect_html_pages(bucket: dict[tuple[str, str], dict[str, Any]]) -> None:
    found_at = now_iso()
    for game, (url, source_name) in HTML_PAGES.items():
        try:
            body = fetch(url)
            body = re.sub(r"<script[\s\S]*?</script>", " ", body, flags=re.I)
        except (urllib.error.URLError, TimeoutError) as exc:
            print(f"[html] skip {game}: {exc}")
            continue
        added = 0
        seen: set[str] = set()
        for match in HTML_CODE_RE.finditer(body):
            code = match.group(1)
            if code.upper() in seen:
                continue
            seen.add(code.upper())
            before = len(bucket)
            upsert(
                bucket,
                game=game,
                code=code,
                reward=None,
                found_at=found_at,
                source_name=source_name,
                source_url=url,
            )
            if len(bucket) > before:
                added += 1
        print(f"[html] {game}: {added} codes")


def load_existing() -> dict[str, Any]:
    if not CODES_PATH.exists():
        return {"demo": True, "updatedAt": now_iso(), "codes": []}
    return json.loads(CODES_PATH.read_text(encoding="utf-8"))


def merge(
    existing: dict[str, Any],
    collected: dict[tuple[str, str], dict[str, Any]],
) -> list[dict[str, Any]]:
    if existing.get("demo"):
        return [item for item in collected.values() if item["game"] in ALLOWED_GAMES]

    bucket = dict(collected)
    for row in existing.get("codes") or []:
        code = str(row.get("code") or "")
        game = str(row.get("game") or "")
        if game not in ALLOWED_GAMES or not code:
            continue
        reward = row.get("reward")
        if is_junk_reward(reward):
            reward = None
        upsert(
            bucket,
            game=game,
            code=code,
            reward=reward,
            found_at=str(row.get("foundAt") or now_iso()),
            source_name=(row.get("source") or {}).get("name") or "archive",
            source_url=(row.get("source") or {}).get("url") or "",
        )

    by_game: dict[str, list[dict[str, Any]]] = {}
    for item in bucket.values():
        if item["game"] not in ALLOWED_GAMES:
            continue
        by_game.setdefault(item["game"], []).append(item)

    result: list[dict[str, Any]] = []
    for _game, items in by_game.items():
        items.sort(key=lambda item: item["foundAt"], reverse=True)
        result.extend(items[:MAX_PER_GAME])
    return result


def main() -> None:
    existing = load_existing()
    collected: dict[tuple[str, str], dict[str, Any]] = {}
    collect_seria(collected)
    collect_fandom(bucket=collected)
    collect_wiki_tables(collected)
    collect_html_pages(collected)
    codes = merge(existing, collected)
    codes.sort(key=lambda item: (item["foundAt"], item["id"]), reverse=True)

    previous = [
        row
        for row in (existing.get("codes") or [])
        if row.get("game") in ALLOWED_GAMES
    ]
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
